# 🎯 Competition Feature - Quick Integration

## Add to Dashboard (5 minutes)

### Step 1: Import Component

Edit `src/app/dashboard/page.tsx`:

```tsx
// Add this import at the top
import CompetitionBanner from '@/components/CompetitionBanner'
```

### Step 2: Add Banner

Place this right after the header, before the stats cards:

```tsx
export default async function DashboardPage() {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      <header>
        {/* ... existing header ... */}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🎯 ADD THIS - Competition Banner */}
        <CompetitionBanner userEmail={user.email} />

        {/* Existing stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... stats cards ... */}
        </div>

        {/* Rest of dashboard */}
      </main>
    </div>
  )
}
```

### Step 3: Run Database Migration

In Supabase SQL Editor:
```sql
-- Copy and paste the entire contents of:
migrations/add-competition-system.sql
```

### Step 4: Deploy

```bash
git add .
git commit -m "Add competition feature"
git push origin main
```

---

## 🎮 What Users Will See

### Dashboard Banner:
```
┌─────────────────────────────────────────────────────────┐
│ 🏆 Win 1 Month Pro FREE! 🎉                     [X]    │
│                                                          │
│ Play our CV Clicker game and compete for the top 5     │
│ spots. Winners get 1 month of Pro access FREE!         │
│                                                          │
│ Your Best: 250 pts (Rank #3 of 47)                     │
│                                                          │
│                              [✨ Play Now!]             │
│                                                          │
│ 🏆 Current Top 5:  #1 320 pts  #2 285 pts  #3 250 pts │
└─────────────────────────────────────────────────────────┘
```

### Game Modal:
```
┌─────────────────────────────────────────────┐
│ 🏆 Win 1 Month Pro FREE!              [X]  │
├─────────────────────────────────────────────┤
│                                             │
│     CV Clicker Challenge! 🎯               │
│                                             │
│  Click as many CVs and stars as you can    │
│  in 30 seconds!                             │
│                                             │
│  ┌────┐  ┌────┐  ┌────┐                   │
│  │ CV │  │ ⭐ │  │ 💣 │                   │
│  │+10 │  │+25 │  │-15 │                   │
│  └────┘  └────┘  └────┘                   │
│                                             │
│         [⚡ Start Game!]                    │
│                                             │
│  🏆 Prize: Top 5 players win 1 month Pro   │
└─────────────────────────────────────────────┘
```

---

## 🏆 After Competition Ends (7 days)

### Select Winners:
```sql
-- In Supabase SQL Editor
SELECT mark_competition_winners('oct_2025');
```

### Grant Pro Access:
```sql
-- Give winners Pro access
UPDATE usage_tracking
SET 
  plan_type = 'pro',
  max_lifetime_generations = 100,
  upgraded_at = NOW()
WHERE user_id IN (
  SELECT user_id 
  FROM competition_scores 
  WHERE competition_id = 'oct_2025' 
  AND is_winner = true
);
```

### Send Winner Emails:
```
Subject: 🎉 You Won 1 Month Pro FREE!

Hi [Name],

Congratulations! You're one of the top 5 players in our 
CV Clicker competition!

Your score: 285 points
Your rank: #2

Your prize: 1 Month Pro Access
- 100 CV generations
- All premium features
- Priority support

Your Pro access has been activated. Log in now to start 
using your prize!

Best regards,
CV Adapter Team
```

---

## 📊 Monitor Performance

### Check Participation:
```sql
-- Total players
SELECT COUNT(DISTINCT email) as total_players
FROM competition_scores
WHERE competition_id = 'oct_2025';

-- Average score
SELECT AVG(score) as avg_score
FROM competition_scores
WHERE competition_id = 'oct_2025';

-- Games per user
SELECT 
  email,
  COUNT(*) as games_played,
  MAX(score) as best_score
FROM competition_scores
WHERE competition_id = 'oct_2025'
GROUP BY email
ORDER BY best_score DESC
LIMIT 10;
```

---

## 🎯 Expected Results

### Week 1:
- **50-100 players** (63-127% of active users)
- **3-5 games per player** (high engagement)
- **200+ total games played**
- **+40% time on site**

### Conversion Impact:
- **10-15 new Pro users** from competition exposure
- **5 winners** get free Pro (£25 value)
- **Net revenue**: £50-75 (10-15 users × £5)
- **ROI**: 2-3x

---

## ✅ Quick Checklist

- [ ] Run database migration in Supabase
- [ ] Add `CompetitionBanner` to dashboard
- [ ] Test game locally
- [ ] Deploy to production
- [ ] Send announcement email
- [ ] Post on social media
- [ ] Monitor participation daily
- [ ] Select winners after 7 days
- [ ] Grant Pro access to winners
- [ ] Send winner notification emails

---

**Time to implement**: 10 minutes  
**Time to manage**: 5 minutes/day  
**Expected impact**: +40% engagement, +30% conversions

**Ready to launch!** 🚀
