-- Migration: Add Freemium Pricing Columns
-- Date: October 23, 2025
-- Purpose: Support new subscription-based pricing model

-- Add subscription tier tracking to usage_tracking table
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS features_unlocked JSONB DEFAULT '[]'::jsonb;

-- Create index for faster tier lookups
CREATE INDEX IF NOT EXISTS idx_usage_tracking_subscription_tier 
ON usage_tracking(subscription_tier);

-- Update existing users to free tier
UPDATE usage_tracking 
SET subscription_tier = 'free' 
WHERE subscription_tier IS NULL;

-- Add constraint to ensure valid tier values
ALTER TABLE usage_tracking
ADD CONSTRAINT check_subscription_tier 
CHECK (subscription_tier IN ('free', 'pro_monthly', 'pro_annual'));

-- Add comment for documentation
COMMENT ON COLUMN usage_tracking.subscription_tier IS 'User subscription tier: free, pro_monthly, or pro_annual';
COMMENT ON COLUMN usage_tracking.subscription_start_date IS 'When the current subscription started';
COMMENT ON COLUMN usage_tracking.subscription_end_date IS 'When the current subscription ends (NULL for lifetime/free)';
COMMENT ON COLUMN usage_tracking.features_unlocked IS 'JSON array of unlocked feature IDs';

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usage_tracking' 
AND column_name IN ('subscription_tier', 'subscription_start_date', 'subscription_end_date', 'features_unlocked')
ORDER BY ordinal_position;
