# Current Issues & Status

**Date**: 2025-09-30 11:19  
**Priority**: HIGH

## 🔴 Critical Issues

### 1. Authentication Failing (401 Unauthorized)
**Status**: INVESTIGATING  
**Impact**: Users cannot generate CVs

**Problem**:
- API route `/api/rewrite` returns 401 Unauthorized
- Supabase SSR client not finding user session
- Cookies may not be passed correctly

**Debug Steps Added**:
- ✅ Added extensive logging to `/api/rewrite`
- ✅ Logs cookies received
- ✅ Logs auth result
- ⏳ **NEED**: Server terminal output to see logs

**Next Steps**:
1. Check server terminal (where `npm run dev` is running)
2. Look for logs starting with `=== AUTH DEBUG ===`
3. See what cookies are being received
4. Check if `getUser()` is working

**Possible Causes**:
- Supabase SSR package not compatible with current setup
- Cookies not being passed from browser to API
- Session expired or invalid
- Cookie configuration issue

**Temporary Workaround**:
- User needs to log out and log back in
- May need to clear browser cookies

---

### 2. Cover Letters Query Failing (400 Bad Request)
**Status**: IDENTIFIED  
**Impact**: Dashboard shows error, cover letters don't load

**Problem**:
```
vuslzrevbkuugqeiadnq.supabase.co/rest/v1/cover_letters?select=id%2Cjob_title%2Ccompany_name%2Ccreated_at%2Ccontent&user_id=eq.75ac6140-bedc-4bbd-84c3-8dfa07356766&order=created_at.desc&limit=20
Failed to load resource: 400
```

**Root Cause**:
- Query is using `user_id=eq.XXX` in URL params
- Should use `.eq('user_id', XXX)` in query builder
- OR: RLS policy issue
- OR: Column name mismatch

**Fix Needed**:
Check `/src/app/dashboard/page.tsx` line ~166-171

---

### 3. Landing Page Redirect
**Status**: ✅ FIXED  
**Impact**: SEO landing page not showing

**Problem**:
- Root `/` was redirecting to `/landing`
- New SEO page in `(marketing)/page.tsx` not accessible

**Fix Applied**:
- ✅ Updated `/src/app/page.tsx` to export from `(marketing)/page.tsx`
- ✅ Root now shows new SEO-optimized landing page

---

## ⚠️ Warnings (Non-Critical)

### 4. Multiple GoTrueClient Instances
**Status**: WARNING  
**Impact**: May cause undefined behavior

**Message**:
```
Multiple GoTrueClient instances detected in the same browser context
```

**Cause**:
- Multiple Supabase client instances being created
- Likely from both SSR and client-side code

**Fix**: Consolidate Supabase client creation

---

### 5. Browser Extension Errors
**Status**: EXTERNAL  
**Impact**: None (browser extension issue)

**Errors**:
- Bugsnag extension loading
- Coupon Birds extension error
- These are from browser extensions, not our code

---

## 🔧 Technical Details

### Supabase SSR Setup
**Current Implementation**:
```typescript
// src/lib/supabase-server.ts
export const createSupabaseRouteClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignore errors
        }
      },
    },
  })
}
```

**Issue**: 
- `getUser()` not finding authenticated user
- Cookies may not be accessible in API route context

**Potential Solutions**:
1. Use `getSession()` instead of `getUser()`
2. Pass auth token in request headers
3. Revert to old auth helpers package
4. Use admin client with JWT verification

---

## 📋 Action Items

### Immediate (Now)
- [ ] Get server terminal output with auth debug logs
- [ ] Identify why cookies aren't working
- [ ] Fix cover letters query

### Short Term (Today)
- [ ] Fix authentication properly
- [ ] Test CV generation end-to-end
- [ ] Verify all features work

### Medium Term (This Week)
- [ ] Add proper error boundaries
- [ ] Improve session management
- [ ] Add session refresh logic
- [ ] Write tests for auth flow

---

## 🧪 Testing Checklist

### Authentication
- [ ] User can log in
- [ ] Session persists across page refreshes
- [ ] API routes can access user session
- [ ] Session expires properly
- [ ] User can log out

### CV Generation
- [ ] Upload CV works
- [ ] Generate page loads
- [ ] Can submit generation request
- [ ] API processes request
- [ ] Results page shows changes
- [ ] Can download CV

### Dashboard
- [ ] CVs list loads
- [ ] Generations list loads
- [ ] Cover letters list loads
- [ ] Stats show correctly
- [ ] Search works

---

## 💡 Debug Commands

### Check Server Logs
```bash
# In terminal where npm run dev is running
# Look for: === AUTH DEBUG ===
```

### Check Browser Cookies
```javascript
// In browser console
document.cookie
```

### Check Supabase Session
```javascript
// In browser console
const { data } = await supabase.auth.getSession()
console.log(data)
```

### Test API Directly
```bash
# Get auth token from browser
# Then test API
curl -X POST http://localhost:3000/api/rewrite \
  -H "Content-Type: application/json" \
  -H "Cookie: [paste cookies here]" \
  -d '{"cv_id":"xxx","job_title":"test"}'
```

---

## 📞 Support Info

**User**: Pro plan user  
**User ID**: 75ac6140-bedc-4bbd-84c3-8dfa07356766  
**Environment**: Development (localhost:3000)  
**Browser**: Edge (based on errors)  
**Next.js**: 15.5.4 (Turbopack)  
**Supabase**: @supabase/ssr package

---

**Status**: 🔴 BLOCKED - Need server terminal output to proceed with auth debugging
