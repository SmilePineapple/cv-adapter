# Automated Error Monitoring & Reporting Setup

**Date:** November 12, 2025
**Goal:** Turn users into testers by automatically catching and reporting errors

---

## 🎯 Solution: Sentry + Vercel Integration

### Why Sentry?
- ✅ **Free tier:** 5,000 errors/month
- ✅ **Vercel native integration:** 1-click setup
- ✅ **Real-time alerts:** Email, Slack, Discord
- ✅ **Error grouping:** Groups similar errors
- ✅ **User context:** See which users hit errors
- ✅ **Source maps:** See exact line of code causing error
- ✅ **Performance monitoring:** Track slow API calls
- ✅ **Release tracking:** See which deployment caused issues

---

## 📋 Setup Steps

### Step 1: Create Sentry Account (5 minutes)

1. Go to https://sentry.io/signup/
2. Sign up with GitHub (easiest)
3. Create a new project:
   - **Platform:** Next.js
   - **Project name:** cv-adapter
   - **Team:** Your organization

### Step 2: Install Sentry in Your Project (2 minutes)

```bash
# Run this in your project directory
npx @sentry/wizard@latest -i nextjs
```

This wizard will:
- Install `@sentry/nextjs` package
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Add Sentry to `next.config.js`
- Upload source maps automatically

### Step 3: Configure Environment Variables (1 minute)

Add to `.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
SENTRY_AUTH_TOKEN=your_auth_token_here
SENTRY_ORG=your_org_name
SENTRY_PROJECT=cv-adapter
```

Add to Vercel Environment Variables:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add the same variables above
3. Make sure they're available in Production, Preview, and Development

### Step 4: Integrate with Vercel (1 minute)

1. Go to Vercel Dashboard → Integrations
2. Search for "Sentry"
3. Click "Add Integration"
4. Select your project
5. Authorize

This automatically:
- Links deployments to Sentry releases
- Uploads source maps
- Tracks which deployment caused errors

---

## 🚀 Alternative: Custom Error Tracking (If You Don't Want Sentry)

### Option A: Vercel Log Drains (Built-in)

**What it does:** Streams all Vercel logs to external services

**Supported services:**
- Datadog
- Logtail
- Axiom
- New Relic
- Better Stack

**Setup:**
1. Go to Vercel Dashboard → Settings → Log Drains
2. Choose a service (Logtail has free tier)
3. Add webhook URL
4. All logs stream automatically

**Pros:**
- No code changes needed
- Captures everything
- Real-time streaming

**Cons:**
- Less context than Sentry
- No automatic error grouping
- No source maps

### Option B: Custom Error Logger to Supabase

**What it does:** Log errors to your own database

**Setup:**

1. Create error logging table:
```sql
CREATE TABLE error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('warning', 'error', 'fatal')),
  message TEXT NOT NULL,
  stack_trace TEXT,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  page_url TEXT,
  user_agent TEXT,
  error_code TEXT,
  metadata JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Index for fast queries
CREATE INDEX idx_error_logs_level ON error_logs(level);
CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id);

-- RLS policies (admin only)
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all error logs"
ON error_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

2. Create error logging utility:
```typescript
// src/lib/error-logger.ts
import { createSupabaseClient } from '@/lib/supabase'

export type ErrorLevel = 'warning' | 'error' | 'fatal'

interface LogErrorParams {
  level: ErrorLevel
  message: string
  stackTrace?: string
  errorCode?: string
  metadata?: Record<string, any>
}

export async function logError({
  level,
  message,
  stackTrace,
  errorCode,
  metadata
}: LogErrorParams) {
  try {
    const supabase = createSupabaseClient()
    
    // Get user context
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get page context
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'server'
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : 'server'
    
    // Log to Supabase
    const { error } = await supabase
      .from('error_logs')
      .insert({
        level,
        message,
        stack_trace: stackTrace,
        user_id: user?.id,
        user_email: user?.email,
        page_url: pageUrl,
        user_agent: userAgent,
        error_code: errorCode,
        metadata
      })
    
    if (error) {
      console.error('Failed to log error to Supabase:', error)
    }
    
    // Also log to console for Vercel logs
    console[level === 'fatal' ? 'error' : level](
      `[${level.toUpperCase()}]`,
      message,
      metadata
    )
  } catch (err) {
    // Don't throw - logging errors shouldn't break the app
    console.error('Error logger failed:', err)
  }
}

// Convenience functions
export const logWarning = (message: string, metadata?: Record<string, any>) =>
  logError({ level: 'warning', message, metadata })

export const logErrorMsg = (message: string, error?: Error, metadata?: Record<string, any>) =>
  logError({
    level: 'error',
    message,
    stackTrace: error?.stack,
    metadata: { ...metadata, errorName: error?.name }
  })

export const logFatal = (message: string, error?: Error, metadata?: Record<string, any>) =>
  logError({
    level: 'fatal',
    message,
    stackTrace: error?.stack,
    metadata: { ...metadata, errorName: error?.name }
  })
```

3. Create global error boundary:
```typescript
// src/components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { logFatal } from '@/lib/error-logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to your error tracking
    logFatal('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-700 mb-4">
              We've been notified and are working on a fix. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

4. Wrap your app:
```typescript
// src/app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

5. Use in API routes:
```typescript
// Example: src/app/api/upload/route.ts
import { logError, logWarning } from '@/lib/error-logger'

export async function POST(request: Request) {
  try {
    // Your code here
    
    if (someWarningCondition) {
      await logWarning('CV upload: Large file detected', {
        fileSize: file.size,
        fileName: file.name
      })
    }
    
  } catch (error) {
    await logError({
      level: 'error',
      message: 'CV upload failed',
      stackTrace: error.stack,
      errorCode: 'UPLOAD_FAILED',
      metadata: {
        fileName: file?.name,
        fileSize: file?.size
      }
    })
    
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

6. Create admin error dashboard:
```typescript
// src/app/admin/errors/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'

export default function ErrorLogsPage() {
  const [errors, setErrors] = useState([])
  const [filter, setFilter] = useState<'all' | 'warning' | 'error' | 'fatal'>('all')
  
  useEffect(() => {
    fetchErrors()
  }, [filter])
  
  const fetchErrors = async () => {
    const supabase = createSupabaseClient()
    
    let query = supabase
      .from('error_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100)
    
    if (filter !== 'all') {
      query = query.eq('level', filter)
    }
    
    const { data } = await query
    setErrors(data || [])
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Error Logs</h1>
      
      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {['all', 'warning', 'error', 'fatal'].map(level => (
          <button
            key={level}
            onClick={() => setFilter(level as any)}
            className={`px-4 py-2 rounded ${
              filter === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>
      
      {/* Error list */}
      <div className="space-y-4">
        {errors.map(error => (
          <div
            key={error.id}
            className={`p-4 rounded border-l-4 ${
              error.level === 'fatal'
                ? 'border-red-600 bg-red-50'
                : error.level === 'error'
                ? 'border-orange-600 bg-orange-50'
                : 'border-yellow-600 bg-yellow-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold">{error.level.toUpperCase()}</span>
                <span className="text-gray-600 ml-2">
                  {new Date(error.timestamp).toLocaleString()}
                </span>
              </div>
              {error.user_email && (
                <span className="text-sm text-gray-600">{error.user_email}</span>
              )}
            </div>
            
            <p className="font-medium mb-2">{error.message}</p>
            
            {error.page_url && (
              <p className="text-sm text-gray-600">Page: {error.page_url}</p>
            )}
            
            {error.stack_trace && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">
                  View Stack Trace
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  {error.stack_trace}
                </pre>
              </details>
            )}
            
            {error.metadata && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">
                  View Metadata
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  {JSON.stringify(error.metadata, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Pros:**
- Full control over data
- No external dependencies
- Free (uses your Supabase)
- Custom dashboard

**Cons:**
- More setup work
- No automatic grouping
- No source maps
- You have to build the dashboard

---

## 📊 Comparison Table

| Feature | Sentry | Vercel Log Drains | Custom Supabase |
|---------|--------|-------------------|-----------------|
| **Setup Time** | 5 min | 2 min | 30 min |
| **Cost** | Free (5k/mo) | Free + service cost | Free |
| **Error Grouping** | ✅ Automatic | ❌ Manual | ❌ Manual |
| **Source Maps** | ✅ Yes | ❌ No | ❌ No |
| **User Context** | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Alerts** | ✅ Email/Slack | ✅ Service dependent | ⚠️ Manual |
| **Performance** | ✅ Yes | ⚠️ Limited | ❌ No |
| **Dashboard** | ✅ Built-in | ✅ Service dependent | ⚠️ Build yourself |
| **Release Tracking** | ✅ Yes | ❌ No | ⚠️ Manual |

---

## 🎯 Recommendation

**For your use case, I recommend: Sentry**

**Why?**
1. ✅ **5 minutes setup** (fastest to value)
2. ✅ **Free tier is generous** (5,000 errors/month)
3. ✅ **Vercel native integration** (1-click)
4. ✅ **Source maps** (see exact line causing error)
5. ✅ **User context** (know which users hit errors)
6. ✅ **Email alerts** (get notified immediately)
7. ✅ **Error grouping** (don't get spammed)

**When to use Custom Supabase:**
- You want full data ownership
- You need custom error handling logic
- You want to build custom dashboards
- You're already at Sentry's limit

**When to use Log Drains:**
- You want ALL logs (not just errors)
- You're using Datadog/New Relic already
- You need compliance/audit trails

---

## 🚀 Quick Start: Sentry Setup (5 minutes)

### 1. Install Sentry
```bash
npx @sentry/wizard@latest -i nextjs
```

### 2. Add to Vercel
```bash
# Add these to Vercel Environment Variables
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
SENTRY_AUTH_TOKEN=your_auth_token_here
```

### 3. Configure Alerts
1. Go to Sentry Dashboard → Alerts
2. Create new alert:
   - **Trigger:** Error count > 5 in 5 minutes
   - **Action:** Send email to your email
3. Save

### 4. Test It
```typescript
// Add this to any page temporarily
throw new Error('Test Sentry integration')
```

### 5. Deploy
```bash
git add .
git commit -m "Add Sentry error monitoring"
git push
```

**Done!** You'll now get:
- Real-time error notifications
- Grouped error reports
- User context for each error
- Source maps showing exact code
- Performance monitoring

---

## 📧 Alert Configuration Examples

### Critical Errors (Immediate)
- **Trigger:** Any fatal error
- **Action:** Email + Slack
- **Frequency:** Immediately

### High Error Rate (5 min)
- **Trigger:** >10 errors in 5 minutes
- **Action:** Email
- **Frequency:** Once per 5 minutes

### New Error Type (Daily)
- **Trigger:** First occurrence of new error
- **Action:** Email
- **Frequency:** Immediately

### Weekly Summary (Weekly)
- **Trigger:** Every Monday 9am
- **Action:** Email digest
- **Frequency:** Weekly

---

## 🎯 What You'll Get

### Real-Time Visibility:
```
❌ User: jake@example.com
📍 Page: /generate/abc123
🐛 Error: "Failed to parse CV sections"
📊 Affected: 3 users in last hour
🔍 Stack trace: Line 182 in upload/route.ts
```

### Automatic Grouping:
```
🔴 CV Upload Failed (12 occurrences)
  - 8 users affected
  - First seen: 2 hours ago
  - Last seen: 5 minutes ago
  - Trend: Increasing ⬆️
```

### Performance Insights:
```
⚠️ Slow API: /api/rewrite
  - Avg: 8.2s (target: <3s)
  - P95: 12.5s
  - Affected users: 45
```

---

## ✅ Next Steps

1. **Choose your solution** (I recommend Sentry)
2. **Run the setup** (5 minutes)
3. **Configure alerts** (2 minutes)
4. **Test it** (1 minute)
5. **Monitor for a week**
6. **Review error patterns**
7. **Fix top issues**

---

**Your users will now be your best testers!** 🎯

Every error they hit will be:
- ✅ Automatically logged
- ✅ Grouped with similar errors
- ✅ Sent to you via email
- ✅ Trackable to specific users
- ✅ Linked to exact code line

**No more guessing what went wrong!** 🚀
