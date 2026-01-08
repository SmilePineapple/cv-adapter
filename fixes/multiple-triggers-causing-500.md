# Multiple Triggers Causing Signup 500 Error

## Problem
User signup fails with 500 error:
```
ERROR: function net.http_post(url => unknown, headers => jsonb, body => text) does not exist
```

## Root Cause
There are **THREE triggers** on `auth.users` table:

1. ✅ `on_auth_user_created` → `handle_new_user()` - Our trigger (working)
2. ❌ `on_user_created` → `send_welcome_email()` - Trying to use net.http_post()
3. ❌ `trigger_auto_initialize_cohort` → `auto_initialize_cohort()` - Trying to use net.http_post()

The last two triggers are trying to make HTTP requests using `net.http_post()` function, but this function isn't working properly in your Supabase instance.

## Discovery Process
1. First error: "schema net does not exist" → Fixed by creating pg_net extension
2. Second error: "function net.http_post does not exist" → Function exists but doesn't work
3. Disabled webhook in Supabase Dashboard → Still failing
4. Checked all triggers → Found 3 triggers, 2 are problematic

## Solution

### Option 1: Disable Problematic Triggers (Recommended)

Run `disable-problem-triggers.sql`:

```sql
ALTER TABLE auth.users DISABLE TRIGGER on_user_created;
ALTER TABLE auth.users DISABLE TRIGGER trigger_auto_initialize_cohort;
```

This will:
- ✅ Allow users to sign up
- ✅ Keep our `handle_new_user` trigger working
- ❌ Disable welcome emails (can add later in app code)
- ❌ Disable cohort initialization (may need to handle differently)

### Option 2: Fix the Functions (Advanced)

If you need these triggers to work, you'll need to:
1. Contact Supabase support to fully enable pg_net extension
2. Or rewrite the functions to not use net.http_post()
3. Or move the logic to application code

## Impact

**After disabling the triggers:**
- ✅ Users can sign up successfully
- ✅ Profiles are created
- ✅ Usage tracking is created
- ❌ No automatic welcome emails (add in app code)
- ❌ No automatic cohort initialization (may need alternative)

## Files Modified
- None - just disabled triggers

## Files Created
- `disable-problem-triggers.sql` - SQL to disable problematic triggers
- `multiple-triggers-causing-500.md` - This documentation

## Testing
After running the fix:
1. Try signing up with a new email
2. Should succeed without 500 error
3. Check that user is created in auth.users
4. Check that profile and usage_tracking are created
5. Welcome email won't be sent (handle in app if needed)

## Long-term Solutions

### For Welcome Emails
Move to application code:
```typescript
// In src/app/auth/signup/page.tsx
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: fullName }
  }
})

if (!error) {
  // Send welcome email from app
  await fetch('/api/send-welcome-email', {
    method: 'POST',
    body: JSON.stringify({ email, name: fullName })
  })
}
```

### For Cohort Initialization
Either:
1. Initialize cohort in application code after signup
2. Or fix the trigger to not use HTTP requests
3. Or use Supabase Edge Functions instead

## Why This Happened

These triggers were likely added:
- From a previous implementation
- From a tutorial or template
- For features that aren't currently needed

They're trying to make HTTP requests from the database, which requires the `pg_net` extension to work properly. Since that's not working in your instance, they're blocking user signup.

## Prevention

For future:
- Audit all database triggers before deploying
- Test signup flow thoroughly after any database changes
- Prefer application-level logic over database triggers for HTTP requests
- Document all triggers and their purposes

## Related Issues
- ✅ Fixed: Missing net schema
- ✅ Fixed: Missing http_post function (partially)
- ✅ Fixed: Database trigger with wrong columns
- ✅ Fixed: Webhook configuration
- ✅ Fixed: Multiple conflicting triggers

## Status
Ready to deploy after running `disable-problem-triggers.sql`.
