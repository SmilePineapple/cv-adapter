-- Email Campaign Queue System
-- Run this in Supabase SQL Editor

-- 1. Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'queued', -- queued, processing, completed, failed
  
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  error_message TEXT,
  
  -- Filters used
  exclude_pro_users BOOLEAN DEFAULT false,
  excluded_emails TEXT[] DEFAULT '{}',
  
  CONSTRAINT valid_status CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'paused'))
);

-- 2. Campaign Recipients Table
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_recipient_status CHECK (status IN ('pending', 'sent', 'failed'))
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON email_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipients_campaign_status ON campaign_recipients(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_recipients_pending ON campaign_recipients(campaign_id) WHERE status = 'pending';

-- 4. RLS Policies (Admin only)
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin full access to campaigns" ON email_campaigns
  FOR ALL
  USING (auth.uid() = '75ac6140-bedc-4bbd-84c3-8dfa07356766'::uuid);

CREATE POLICY "Admin full access to recipients" ON campaign_recipients
  FOR ALL
  USING (auth.uid() = '75ac6140-bedc-4bbd-84c3-8dfa07356766'::uuid);

-- 5. Function to update campaign stats
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE email_campaigns
  SET 
    sent_count = (
      SELECT COUNT(*) FROM campaign_recipients 
      WHERE campaign_id = NEW.campaign_id AND status = 'sent'
    ),
    failed_count = (
      SELECT COUNT(*) FROM campaign_recipients 
      WHERE campaign_id = NEW.campaign_id AND status = 'failed'
    ),
    updated_at = NOW()
  WHERE id = NEW.campaign_id;
  
  -- Mark campaign as completed if all recipients processed
  UPDATE email_campaigns
  SET 
    status = 'completed',
    completed_at = NOW()
  WHERE id = NEW.campaign_id
    AND status = 'processing'
    AND (sent_count + failed_count) >= total_recipients;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to auto-update stats
DROP TRIGGER IF EXISTS update_campaign_stats_trigger ON campaign_recipients;
CREATE TRIGGER update_campaign_stats_trigger
  AFTER INSERT OR UPDATE ON campaign_recipients
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_stats();

-- 7. Function to get next batch of pending emails
CREATE OR REPLACE FUNCTION get_pending_recipients(
  p_campaign_id UUID,
  p_batch_size INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  full_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.id,
    cr.user_id,
    cr.email,
    cr.full_name
  FROM campaign_recipients cr
  WHERE cr.campaign_id = p_campaign_id
    AND cr.status = 'pending'
  ORDER BY cr.created_at
  LIMIT p_batch_size;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE email_campaigns IS 'Stores email campaign metadata and progress';
COMMENT ON TABLE campaign_recipients IS 'Tracks individual email recipients and their send status';
