# 🎮 Test Competition Game - Quick Guide

## ✅ Setup Complete!

### Database: ✅ Migration ran successfully
### Code: ✅ Banner added to dashboard
### Server: ✅ Running on http://localhost:3001

---

## 🧪 How to Test

### Step 1: Open Dashboard
```
http://localhost:3001/dashboard
```

### Step 2: Look for Banner
You should see a purple/blue gradient banner at the top:
```
┌─────────────────────────────────────────────────────────┐
│ 🏆 Win 1 Month Pro FREE! 🎉                     [X]    │
│                                                          │
│ Play our CV Clicker game and compete for the top 5     │
│ spots. Winners get 1 month of Pro access FREE!         │
│                                                          │
│                              [✨ Play Now!]             │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Click "Play Now"
A modal should open with game instructions

### Step 4: Click "Start Game"
The 30-second game begins!

### Step 5: Play the Game
- **Click green CV boxes** → +10 points
- **Click yellow stars** → +25 points (bonus!)
- **Avoid red bombs** → -15 points (penalty!)

### Step 6: Submit Score
After 30 seconds, your score is submitted automatically

### Step 7: Check Leaderboard
You should see your rank and the top 5 scores

---

## 🎯 What to Test

### Functionality:
- [ ] Banner appears on dashboard
- [ ] "Play Now" button opens game modal
- [ ] Game instructions are clear
- [ ] "Start Game" button works
- [ ] Targets spawn (CVs, stars, bombs)
- [ ] Clicking targets updates score correctly
- [ ] Timer counts down from 30 seconds
- [ ] Game ends after 30 seconds
- [ ] Score submits automatically
- [ ] Leaderboard displays
- [ ] User rank shows correctly
- [ ] "Play Again" button works
- [ ] Banner can be dismissed (X button)
- [ ] Confetti animation on stars

### Visual:
- [ ] Banner looks good (gradient, colors)
- [ ] Game modal is centered
- [ ] Targets are visible and clickable
- [ ] Score and timer are readable
- [ ] Animations are smooth
- [ ] Mobile responsive (test on phone)

### Edge Cases:
- [ ] What happens with 0 score?
- [ ] What happens with negative score?
- [ ] Can you click targets multiple times?
- [ ] Does it work after playing multiple times?
- [ ] Does banner stay dismissed after refresh?

---

## 🐛 If Something Doesn't Work

### Banner Not Showing?
1. Check browser console for errors
2. Refresh the page (Ctrl+R)
3. Clear cache (Ctrl+Shift+R)
4. Check if user is logged in

### Game Not Opening?
1. Check browser console
2. Look for JavaScript errors
3. Try different browser

### Targets Not Spawning?
1. Check if game actually started
2. Look for console errors
3. Try playing again

### Score Not Submitting?
1. Check browser console
2. Look for API errors
3. Check Supabase connection
4. Verify database migration ran

---

## 📊 Check Database

### View Scores:
```sql
-- In Supabase SQL Editor
SELECT * FROM competition_scores 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Leaderboard:
```sql
SELECT * FROM get_competition_leaderboard('oct_2025', 10);
```

### Your Best Score:
```sql
SELECT * FROM get_user_best_score('your-email@example.com', 'oct_2025');
```

---

## 🎮 Gameplay Tips

### High Score Strategy:
1. **Focus on stars first** (25 pts vs 10 pts)
2. **Avoid bombs at all costs** (-15 pts hurts!)
3. **Click fast** - targets disappear after 2 seconds
4. **Aim for 200+ points** to rank top 5
5. **Play multiple times** - only best score counts

### Target Frequency:
- CVs: Common (60% spawn rate)
- Stars: Rare (30% spawn rate)
- Bombs: Uncommon (10% spawn rate)

---

## 🏆 Expected Behavior

### First Play:
- Score: 50-150 points (learning curve)
- Rank: Depends on other players
- Time: 30 seconds

### After Practice:
- Score: 150-250 points (getting better)
- Rank: Top 10-20
- Strategy: Focus on stars

### Expert Level:
- Score: 250-400+ points (top tier)
- Rank: Top 5
- Strategy: Fast clicking, star priority

---

## ✅ Success Criteria

The game is working if:
1. ✅ Banner shows on dashboard
2. ✅ Game opens and plays smoothly
3. ✅ Score submits to database
4. ✅ Leaderboard updates
5. ✅ Can play multiple times
6. ✅ No console errors
7. ✅ Mobile responsive
8. ✅ Fun to play! 🎮

---

## 🚀 After Testing

### If Everything Works:
1. Note any bugs or improvements
2. Test on mobile device
3. Try different browsers
4. Get feedback from a friend
5. Ready to deploy!

### If Issues Found:
1. Note the exact error
2. Check browser console
3. Check Supabase logs
4. Let me know what's broken

---

## 📱 Mobile Testing

### Test on Phone:
1. Connect to same WiFi
2. Visit: http://192.168.1.109:3001/dashboard
3. Test touch interactions
4. Check if targets are easy to tap
5. Verify layout is responsive

---

## 🎯 Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Adjust difficulty** if too hard/easy
3. **Tweak design** if needed
4. **Test with friends** for feedback
5. **Deploy to production** when ready

---

**Current Status**: 🟢 Ready to test!

**Test URL**: http://localhost:3001/dashboard

**Have fun playing!** 🎮🏆
