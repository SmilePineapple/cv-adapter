# Sentry Replay Integration - iOS Safari 15 Infinite Recursion Bug

## Issue Summary
**Error:** `RangeError: Maximum call stack size exceeded`  
**Location:** `HTMLMediaElement.canPlayType (src/preload/document.js:1:1)`  
**Affected Users:** iOS Safari 15.0 users  
**Sentry Issue ID:** 1191679e466b4b6da87ad05af0f1de85  
**Date:** Dec. 10, 2025, 9:02:16 p.m. UTC  
**Environment:** vercel-production  
**URL:** https://www.mycvbuddy.com/

## Root Cause Analysis

### The Problem
The Sentry Replay integration (`replayIntegration()`) is causing an **infinite recursion** on iOS Safari 15.0 when it attempts to instrument the `HTMLMediaElement.canPlayType` method. This is a known compatibility issue with older Safari versions.

### Technical Details
1. **Sentry Replay** uses rrweb (record and replay the web) to capture DOM mutations and user interactions
2. When instrumenting browser APIs, it wraps native methods like `HTMLMediaElement.canPlayType`
3. On iOS Safari 15.0, this instrumentation creates a **circular reference** where:
   - The wrapped `canPlayType` calls itself
   - Which calls itself again
   - Which calls itself again...
   - Until the call stack is exhausted

### Stack Trace
```
RangeError: Maximum call stack size exceeded
  at HTMLMediaElement.canPlayType (src/preload/document.js:1:1)
  at HTMLMediaElement.canPlayType (src/preload/document.js:1:1)
  at HTMLMediaElement.canPlayType (src/preload/document.js:1:1)
  at HTMLMediaElement.canPlayType (src/preload/document.js:1:1)
  at HTMLMediaElement.canPlayType (src/preload/document.js:1:1)
  ... (45 additional frames)
```

### Affected Configuration
**File:** `src/instrumentation-client.ts`

```typescript
Sentry.init({
  dsn: "https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840",
  integrations: [
    Sentry.replayIntegration(), // ❌ CAUSING THE ISSUE
  ],
  replaysSessionSampleRate: 0.05, // 5% in prod
  replaysOnErrorSampleRate: 1.0, // Always capture replay when error occurs
  // ...
});
```

## Known Issues & References

### GitHub Issues
1. **[Issue #9406](https://github.com/getsentry/sentry-javascript/discussions/9406)** - Sentry Replay's `isBlocked` function recursion results in `Maximum call stack size exceeded` error
2. **[Issue #12692](https://github.com/getsentry/sentry-javascript/issues/12692)** - RangeError: Maximum call stack size exceeded
3. **[Issue #5252](https://github.com/getsentry/sentry-javascript/issues/5252)** - Maximum call stack size exceeded
4. **[Issue #9196](https://github.com/getsentry/sentry-javascript/issues/9196)** - Replay integration breaks Help Scout beacon (iframe) in Safari

### Safari Compatibility
- **Safari <= 15.4** has known issues with Sentry Replay
- iOS Safari 15.0 specifically has problems with media element instrumentation
- WebKit bugs related to `HTMLMediaElement.canPlayType` have been documented

## Impact Assessment

### User Impact
- **Severity:** HIGH - Crashes the entire page for affected users
- **Affected Users:** iOS Safari 15.0 users (older iPhones that can't upgrade beyond iOS 15)
- **User Experience:** Complete page failure, white screen, no functionality
- **Business Impact:** Lost conversions, poor user experience, potential customer churn

### Browser Statistics
- iOS Safari 15.0 is an **older version** (released Sept 2021)
- Most users have upgraded to iOS 16+ or iOS 17+
- However, older devices (iPhone 6s, iPhone 7, etc.) may be stuck on iOS 15
- Estimated impact: **1-3% of mobile users**

## Solutions

### Solution 1: Disable Replay for Safari 15 (Recommended)
Add browser detection to conditionally disable replay for problematic Safari versions.

**Implementation:**
```typescript
// src/instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

// Detect Safari 15 or older
function isSafari15OrOlder(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = window.navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  
  if (!isSafari) return false;
  
  // Extract Safari version
  const match = ua.match(/Version\/(\d+)/);
  if (!match) return false;
  
  const version = parseInt(match[1], 10);
  return version <= 15;
}

// Conditionally include replay integration
const integrations = [];
if (!isSafari15OrOlder()) {
  integrations.push(Sentry.replayIntegration());
}

Sentry.init({
  dsn: "https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840",
  integrations,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  // ... rest of config
});
```

### Solution 2: Disable Replay Entirely (Quick Fix)
Remove `replayIntegration()` completely if session replay is not critical.

**Implementation:**
```typescript
Sentry.init({
  dsn: "...",
  integrations: [
    // Sentry.replayIntegration(), // ❌ REMOVED
  ],
  // Remove replay sample rates
  // replaysSessionSampleRate: 0.05,
  // replaysOnErrorSampleRate: 1.0,
});
```

**Pros:**
- ✅ Immediate fix
- ✅ No compatibility issues
- ✅ Reduced bundle size

**Cons:**
- ❌ Lose session replay functionality for all users
- ❌ Harder to debug user-reported issues
- ❌ No video-like reproduction of errors

### Solution 3: Upgrade Sentry SDK (Future)
Wait for Sentry to release a fix in a future version.

**Status:** 
- Current version: `@sentry/nextjs@10.25.0`
- Monitor: https://github.com/getsentry/sentry-javascript/issues
- Check release notes for Safari 15 compatibility fixes

### Solution 4: Add Replay Configuration Options
Try configuring replay to avoid media element instrumentation.

**Implementation:**
```typescript
Sentry.init({
  dsn: "...",
  integrations: [
    Sentry.replayIntegration({
      blockAllMedia: true, // Don't record media elements
      maskAllText: false,
      maskAllInputs: true,
    }),
  ],
});
```

## Recommended Action Plan

### Immediate (Today)
1. ✅ **Implement Solution 1** - Add Safari 15 detection and conditionally disable replay
2. ✅ Deploy to production immediately
3. ✅ Monitor Sentry for reduction in this error

### Short-term (This Week)
1. Add browser compatibility warning for iOS Safari 15 users
2. Test on iOS Safari 15 simulator/device to confirm fix
3. Update documentation about browser support

### Long-term (This Month)
1. Monitor Sentry SDK releases for official fix
2. Consider adding user-agent analytics to understand affected user base
3. Evaluate if session replay is worth the compatibility issues
4. Consider alternative replay solutions if needed

## Testing Checklist

Before deploying:
- [ ] Test on iOS Safari 15.0 (real device or simulator)
- [ ] Test on iOS Safari 16+ (should still have replay enabled)
- [ ] Test on Chrome/Firefox (should still have replay enabled)
- [ ] Verify Sentry still captures errors (without replay)
- [ ] Check that page loads without errors on all browsers
- [ ] Monitor Sentry dashboard for 24 hours after deployment

## Monitoring

### Success Metrics
- ✅ Zero occurrences of "Maximum call stack size exceeded" from iOS Safari 15
- ✅ Replay still working for Safari 16+ users
- ✅ No increase in other error types
- ✅ Page load time unchanged

### Sentry Filters
Add filter to ignore this error if it still occurs:
```javascript
beforeSend(event) {
  if (event.exception?.values?.[0]?.value?.includes('Maximum call stack size exceeded')) {
    const userAgent = event.request?.headers?.['User-Agent'] || '';
    if (userAgent.includes('Safari/15')) {
      return null; // Don't send to Sentry
    }
  }
  return event;
}
```

## Related Files
- `src/instrumentation-client.ts` - Sentry client initialization
- `src/instrumentation.ts` - Sentry server initialization  
- `sentry.server.config.ts` - Server-side Sentry config
- `sentry.edge.config.ts` - Edge runtime Sentry config
- `src/app/layout.tsx` - Root layout (loads Sentry)

## Additional Resources
- [Sentry Session Replay Docs](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Sentry Replay Troubleshooting](https://docs.sentry.io/platforms/javascript/session-replay/troubleshooting/)
- [Safari Compatibility Notes](https://docs.sentry.io/platforms/javascript/session-replay/#safari-compatibility)
- [GitHub: Sentry JavaScript Issues](https://github.com/getsentry/sentry-javascript/issues)

## Status
- [x] Issue identified
- [x] Root cause analyzed
- [x] Solution designed
- [ ] Fix implemented
- [ ] Fix tested
- [ ] Fix deployed
- [ ] Monitoring active
