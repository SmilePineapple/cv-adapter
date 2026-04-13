# Admin Dashboard Guide

## Overview
A comprehensive admin analytics dashboard has been implemented for CV Adapter to monitor user activity, track revenue, and manage the platform.

## Access Information

### Admin Email
- **Email**: `jakedalerourke@gmail.com`
- Only this email has access to the admin dashboard

### How to Access
1. Log in to CV Adapter with the admin email
2. Navigate to your dashboard at `/dashboard`
3. Look for the red **"Admin"** link in the top navigation (next to "Subscription")
4. Click to access the admin dashboard at `/admin`

**Direct URL**: `http://localhost:3000/admin` (or your production domain)

## Features

### 📊 Overview Statistics
The dashboard displays key metrics at a glance:

1. **Total Users** - Total registered users with weekly growth
2. **Pro Users** - Number of paying customers with conversion rate
3. **Total Generations** - All CV generations with average per user
4. **Total Revenue** - Revenue from Pro users (£5 per user)
5. **Active Users (30d)** - Users who generated at least 1 CV in last 30 days
6. **New Users (30d)** - New signups in the last month
7. **Cover Letters** - Total cover letters created

### 📈 Charts & Analytics

#### Generation Activity Chart
- Shows CV generations over the last 30 days
- Visual bar chart with daily counts
- Helps identify usage patterns and peak times

#### User Signups Chart
- Tracks new user registrations over 30 days
- Visual bar chart showing growth trends
- Identifies marketing campaign effectiveness

### 🏆 Top Users
- Lists top 10 users by generation count
- Shows email, plan type, and total generations
- Helps identify power users and engagement

### 👥 All Users Table
Comprehensive user management with:
- **Email & Full Name** - User identification
- **Plan Type** - Free or Pro (with crown icon for Pro)
- **Total Gens** - Total CV generations per user (all-time)
- **Lifetime** - Lifetime usage tracking (X / 1 for Free, X / 100 for Pro)
- **CVs** - Number of uploaded CVs
- **Letters** - Cover letters created
- **Joined Date** - Account creation date
- **Last Active** - Most recent activity timestamp

#### Filtering & Search
- **Search Bar** - Search by email or full name
- **Plan Filter** - Filter by All, Free, or Pro users
- Real-time filtering with instant results

### 🛠️ Admin Tools

#### Upgrade User Tool
- Access via "Upgrade User" button in header
- Manually upgrade any user to Pro for free
- Useful for testing, support, or promotional purposes
- Navigate to `/admin/upgrade-user`

## API Endpoints

### Analytics API
**Endpoint**: `/api/admin/analytics`
**Method**: GET
**Auth**: Requires admin email authentication

**Returns**:
```json
{
  "overview": {
    "totalUsers": 150,
    "freeUsers": 120,
    "proUsers": 30,
    "totalGenerations": 450,
    "totalCVs": 180,
    "totalCoverLetters": 75,
    "newUsersLast7Days": 12,
    "newUsersLast30Days": 45,
    "activeUsers": 80,
    "totalRevenue": 150,
    "conversionRate": "20.00",
    "avgGenerationsPerUser": "3.00"
  },
  "charts": {
    "generationsByDay": { "2025-01-15": 12, ... },
    "signupsByDay": { "2025-01-15": 3, ... }
  },
  "users": [...],
  "topUsers": [...]
}
```

### Upgrade User API
**Endpoint**: `/api/admin/upgrade-user`
**Method**: POST
**Auth**: Requires admin email authentication

**Body**:
```json
{
  "email": "user@example.com",
  // OR
  "userId": "uuid-here"
}
```

## Security

### Authentication
- Only emails in `ADMIN_EMAILS` array can access admin features
- Currently configured: `['jakedalerourke@gmail.com']`
- Uses Supabase service role key for elevated permissions
- All API calls require valid admin session token

### Adding More Admins
To add additional admin users, update the `ADMIN_EMAILS` constant in:
1. `/src/app/admin/page.tsx` (line 8)
2. `/src/app/admin/upgrade-user/page.tsx` (line 8)
3. `/src/app/api/admin/analytics/route.ts` (line 4)
4. `/src/app/api/admin/upgrade-user/route.ts` (line 4)

Example:
```typescript
const ADMIN_EMAILS = ['jakedalerourke@gmail.com', 'admin2@example.com']
```

### Row Level Security (RLS)
- Admin API uses Supabase service role key to bypass RLS
- Regular users cannot access admin endpoints
- Unauthorized access attempts redirect to dashboard

## Database Queries

The admin dashboard queries the following tables:
- `auth.users` - User accounts
- `profiles` - User profiles and activity
- `purchases` - One-time payment records (lifetime access)
- `subscriptions` - Legacy subscription data (backward compatibility)
- `usage_tracking` - Generation usage tracking with lifetime counts
- `generations` - CV generation history
- `cvs` - Uploaded CVs
- `cover_letters` - Cover letter creations

**Note**: The system supports both the new `purchases` table (lifetime payments) and legacy `subscriptions` table for backward compatibility.

## Key Metrics Explained

### Conversion Rate
Percentage of total users who have upgraded to Pro
```
(Pro Users / Total Users) × 100
```

### Average Generations Per User
Total generations divided by total users
```
Total Generations / Total Users
```

### Active Users
Users who have generated at least 1 CV in the last 30 days

### Total Revenue
Simple calculation based on Pro users
```
Pro Users × £5 (one-time payment)
```

## Navigation Structure

```
/dashboard (User Dashboard)
  └─ Admin Link (visible only to admin)
      └─ /admin (Admin Dashboard)
          ├─ Overview Stats
          ├─ Charts
          ├─ Top Users
          ├─ All Users Table
          └─ Upgrade User Button → /admin/upgrade-user
```

## Future Enhancements

Potential features to add:
- Export user data to CSV
- Email users directly from admin panel
- Bulk user operations
- Revenue charts over time
- Refund/cancellation management
- User activity logs
- System health monitoring
- API usage statistics
- A/B test results tracking

## Troubleshooting

### Admin Link Not Showing
- Ensure you're logged in with `jakedalerourke@gmail.com`
- Check browser console for errors
- Verify user object is loaded in dashboard

### "Unauthorized" Error
- Confirm your email is in the `ADMIN_EMAILS` array
- Check Supabase authentication is working
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`

### Data Not Loading
- Check Supabase connection
- Verify RLS policies are correctly configured
- Check browser console and server logs for errors
- Ensure all database tables exist

### Analytics API Fails
- Verify service role key is valid
- Check database permissions
- Ensure all tables have proper indexes
- Review API route logs

## Support

For admin dashboard issues:
1. Check browser console for errors
2. Review server logs for API failures
3. Verify database connectivity
4. Contact development team if issues persist

---

**Last Updated**: January 2025
**Version**: 1.0.0
