-- Add onboarding tracking to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_goal TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Add comments
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether user has completed onboarding flow';
COMMENT ON COLUMN profiles.onboarding_goal IS 'User selected goal during onboarding (new-job, career-change, international, improve)';
COMMENT ON COLUMN profiles.onboarding_completed_at IS 'When user completed onboarding';

-- Update existing users to have onboarding completed (they already know the app)
UPDATE profiles
SET onboarding_completed = TRUE,
    onboarding_completed_at = NOW()
WHERE onboarding_completed IS NULL OR onboarding_completed = FALSE;
