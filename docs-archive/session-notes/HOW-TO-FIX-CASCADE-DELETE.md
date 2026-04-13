# 🚨 URGENT: Fix Generation Deletion Issue

## The Problem

**Generations are being deleted when you delete a CV!**

This is happening because the database has a CASCADE delete constraint that we need to change to SET NULL.

---

## The Solution (5 Minutes)

### Step 1: Open Supabase
1. Go to https://supabase.com
2. Log in to your account
3. Select your CV Adapter project

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button (top right)

### Step 3: Run the Migration
1. Open the file: `RUN-THIS-IN-SUPABASE.sql`
2. Copy the ENTIRE contents
3. Paste into the Supabase SQL Editor
4. Click the **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify Success
You should see two results:

**Result 1: Constraint Info**
```
constraint_name: generations_cv_id_fkey
table_name: generations
column_name: cv_id
current_delete_rule: SET NULL  ← Should say "SET NULL" not "CASCADE"
```

**Result 2: Success Message**
```
✅ Generation CASCADE delete fixed - generations will be preserved when CV is deleted
```

---

## Testing

After running the migration, test it:

1. **Upload a test CV**
2. **Generate a tailored version**
3. **Go to Dashboard → CVs tab**
4. **Delete the original CV**
5. **Go to Dashboard → Generations tab**
6. **Verify the generation still exists** ✅

---

## What Changed

### Before (BAD):
```
User deletes CV
    ↓
Database CASCADE deletes all generations
    ↓
ALL WORK LOST! 😱
```

### After (GOOD):
```
User deletes CV
    ↓
Database sets generation.cv_id to NULL
    ↓
Generation preserved! 😊
```

---

## Why This Happens

The original database schema had:
```sql
cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE NOT NULL
```

This means:
- When a CV is deleted
- All related generations are CASCADE deleted
- No way to recover

We're changing it to:
```sql
cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL
```

This means:
- When a CV is deleted
- Related generations have cv_id set to NULL
- Generations are preserved!

---

## Troubleshooting

### Error: "constraint does not exist"
- This is OK! It means the constraint name might be different
- The `IF EXISTS` clause handles this
- Migration will still work

### Error: "column cannot be null"
- This means the migration didn't run completely
- Try running it again
- Make sure you copied the ENTIRE file

### Still deleting generations?
1. Verify the migration ran successfully
2. Check the verification query result
3. Make sure `delete_rule` says "SET NULL"
4. Try deleting a NEW CV (not one from before the fix)

---

## Need Help?

### Check Current Status
Run this query in Supabase SQL Editor:
```sql
SELECT 
  tc.constraint_name,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.referential_constraints rc 
  ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'generations' 
  AND tc.constraint_name LIKE '%cv_id%';
```

**Expected:** `delete_rule` should be `SET NULL`

**If it says `CASCADE`:** The migration hasn't been run yet!

---

## Files

- **`RUN-THIS-IN-SUPABASE.sql`** - The migration to run
- **`migrations/fix-generation-cascade-delete.sql`** - Original migration file
- **`migrations/README-CASCADE-DELETE-FIX.md`** - Detailed documentation

---

## Summary

1. ✅ Open Supabase SQL Editor
2. ✅ Copy `RUN-THIS-IN-SUPABASE.sql`
3. ✅ Paste and Run
4. ✅ Verify "SET NULL" appears
5. ✅ Test by deleting a CV
6. ✅ Confirm generation still exists

**This is a ONE-TIME fix that takes 5 minutes!**

After this, generations will NEVER be deleted when you delete a CV! 🎉
