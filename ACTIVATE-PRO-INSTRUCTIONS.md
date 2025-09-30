# How to Activate Pro Subscription (Manual Testing)

Since you've "upgraded" via Stripe but the subscription isn't showing, here's how to manually activate it:

## Option 1: Run SQL Directly in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. Run this script (replace `YOUR_USER_ID` with your actual user ID):

```sql
-- First, make sure the table has price_id column
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS price_id TEXT;

-- Insert or update your Pro subscription
INSERT INTO public.subscriptions (
  user_id,
  status,
  price_id,
  current_period_start,
  current_period_end,
  updated_at
) VALUES (
  'YOUR_USER_ID'::uuid,
  'active',
  'price_pro',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW()
)
ON CONFLICT (user_id) 
DO UPDATE SET
  status = 'active',
  price_id = 'price_pro',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '30 days',
  updated_at = NOW();
```

## Option 2: Use the API Endpoint

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command:

```javascript
fetch('/api/setup-pro-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(console.log)
```

4. Refresh the dashboard

## Option 3: Find Your User ID

If you don't know your user ID:

1. Go to Supabase Dashboard → Authentication → Users
2. Find your email and copy the User UID
3. Use it in Option 1

## After Activation

1. Refresh the dashboard page
2. You should see:
   - "100/month" generations instead of "3/month"
   - No "Upgrade to Pro" prompts
   - Pro badge/indicator

## Why This Happened

The Stripe checkout succeeded (`?success=true`) but the webhook that creates the subscription in the database either:
- Hasn't been configured yet
- Failed to fire
- Couldn't reach your localhost

For production, you'll need to set up Stripe webhooks properly.
