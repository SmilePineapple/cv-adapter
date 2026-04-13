-- Track which drip sequence emails have been sent to each user
-- Prevents sending the same sequence email more than once

CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_step TEXT NOT NULL, -- 'day0_welcome' | 'day3_pro_nudge' | 'day7_offer'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT,
  UNIQUE(user_id, sequence_step)
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_email_sequences_user_id ON email_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_step ON email_sequences(sequence_step);

-- RLS: only service role can read/write
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON email_sequences
  USING (false)
  WITH CHECK (false);
