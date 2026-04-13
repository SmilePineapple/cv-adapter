# Troubleshooting Guide

## Cover Letter Generation Errors

### Error: "Failed to generate cover letter"

This error can have several causes. Check the browser console for more details.

#### Possible Causes:

1. **OpenAI API Key Not Configured**
   - **Error**: "OpenAI API key not configured"
   - **Solution**: Add `OPENAI_API_KEY` to your `.env.local` file
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```
   - Restart the dev server after adding the key

2. **Authentication Error**
   - **Error**: "Unauthorized" or "No authorization header"
   - **Solution**: Make sure you're logged in. Try logging out and back in.

3. **CV Not Found**
   - **Error**: "CV not found"
   - **Solution**: Make sure you've uploaded a CV first. Go to `/upload` to upload one.

4. **Missing Required Fields**
   - **Error**: "Missing required fields"
   - **Solution**: Fill in all required fields (Job Title and Company Name are required)

5. **OpenAI API Error**
   - **Error**: Various OpenAI-related errors
   - **Solutions**:
     - Check if your OpenAI API key is valid
     - Check if you have credits in your OpenAI account
     - Check OpenAI service status

#### How to Debug:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for detailed error messages
   - The error will now show the actual API response

2. **Check Server Logs**
   - Look at the terminal where `npm run dev` is running
   - Server-side errors will be logged there

3. **Check Environment Variables**
   ```bash
   # Make sure these are set in .env.local
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_SUPABASE_URL=https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

4. **Test the API Directly**
   - Use a tool like Postman or curl to test `/api/cover-letter/generate`
   - Check the response for detailed error messages

## Dashboard Errors

### Error: "Error fetching cover letters"

**Fixed!** ✅ This was caused by querying a non-existent column. The fix has been applied.

If you still see this error:
1. Make sure you ran the `cover-letters-schema-fix.sql` migration
2. Clear your browser cache
3. Refresh the page

## Subscription Errors

### Error: "Subscription fetch error"

This is expected if:
- You haven't set up Stripe yet
- The subscriptions table is empty

**Solution**: The app handles this gracefully and shows a mock Pro subscription for testing.

To fix permanently:
1. Set up Stripe account
2. Add Stripe API keys to `.env.local`
3. Run subscription setup

## Upload Errors

### Error: "Please log in to upload files"

**Solution**: You need to be authenticated. Log in first.

### Error: "Failed to upload CV"

**Possible causes**:
1. File too large (max 10MB)
2. Invalid file type (only PDF, DOC, DOCX supported)
3. Authentication expired

**Solutions**:
1. Check file size and type
2. Try logging out and back in
3. Check server logs for details

## General Debugging Steps

1. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check Environment Variables**
   ```bash
   # In cv-adapter directory
   cat .env.local
   ```

3. **Restart Dev Server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

4. **Check Database Connection**
   - Go to Supabase dashboard
   - Check if tables exist
   - Check if RLS policies are enabled

5. **Check API Routes**
   - Look at terminal logs when making requests
   - Errors will be logged there

## Common Environment Variable Issues

### Missing OPENAI_API_KEY
```
Error: OpenAI API key not configured
```
**Fix**: Add to `.env.local`:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### Invalid Supabase Keys
```
Error: Unauthorized
```
**Fix**: Verify Supabase keys in `.env.local` match your Supabase project

### Stripe Not Configured
```
Error: Stripe is not configured
```
**Fix**: This is optional. Add Stripe keys if you want payment features:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

## Getting Help

If you're still stuck:

1. **Check the error message carefully** - The improved error messages now show exactly what went wrong

2. **Check the documentation**:
   - FIXES_APPLIED.md - Recent fixes
   - DEPLOYMENT_CHECKLIST.md - Setup steps
   - PROJECT_STATUS.md - Overall status

3. **Check the logs**:
   - Browser console (F12)
   - Server terminal
   - Supabase logs

4. **Common fixes**:
   - Restart dev server
   - Clear browser cache
   - Check environment variables
   - Verify database migrations ran

## Quick Fixes

### "Everything is broken!"
```bash
# 1. Stop the server (Ctrl+C)
# 2. Clear node modules and reinstall
rm -rf node_modules
npm install
# 3. Restart
npm run dev
```

### "I changed .env.local but nothing changed"
- Restart the dev server! Environment variables are only loaded on startup.

### "Database errors"
- Run the migrations:
  1. `cv-editor-schema.sql`
  2. `cover-letters-schema-fix.sql`
- Check Supabase dashboard for errors

---

**Remember**: Most errors now have detailed messages. Always check the console/logs first!
