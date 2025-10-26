# Tweet Length Issue

## The Problem

The cron is trying to post a tweet with **332 characters**, but Twitter's limit is **280 characters** for free tier!

```
Content length: 332
Twitter limit: 280
Over by: 52 characters
```

## The Content

From the logs:
```
"🔍 Looking for that dream job? Your CV is your fi..."
```

This is the CV tip post with:
- Main content
- Link (https://www.mycvbuddy.com)
- Hashtags

## The Fix

We need to either:
1. Shorten the content before posting
2. Truncate to 280 characters
3. Remove some hashtags

## Solution

Update the `formatPostForPlatform` function to enforce Twitter's 280 character limit.
