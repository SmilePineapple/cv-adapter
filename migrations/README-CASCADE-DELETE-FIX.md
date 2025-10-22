# Critical Fix: Generation CASCADE Delete Issue

## Problem

When a user deleted a CV from the dashboard, ALL associated generations (tailored CVs) were being deleted due to CASCADE delete constraint.

**Impact:**
- Users lost all their generated CVs when deleting the original
- Hours of work creating tailored CVs was lost
- No way to recover deleted generations
- Major data loss issue

## Root Cause

In `supabase-setup.sql`, the `generations` table had:

```sql
cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE NOT NULL,
```

This means:
- When a CV is deleted → All generations CASCADE delete
- Generations are valuable user work and should be preserved
- The original CV is just the source, generations are the output

## Solution

Changed the foreign key constraint from `CASCADE` to `SET NULL`:

```sql
-- Before:
cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE NOT NULL

-- After:
cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL
-- (cv_id is now nullable)
```

**What this does:**
- When a CV is deleted → Generations are preserved
- The `cv_id` field is set to NULL (orphaned but kept)
- Users keep all their generated CVs
- No data loss

## Migration Steps

1. **Run the migration SQL:**
   ```bash
   # In Supabase SQL Editor, run:
   migrations/fix-generation-cascade-delete.sql
   ```

2. **Verify the fix:**
   ```sql
   SELECT 
     tc.constraint_name,
     tc.table_name,
     kcu.column_name,
     rc.delete_rule
   FROM information_schema.table_constraints tc
   JOIN information_schema.key_column_usage kcu 
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.referential_constraints rc 
     ON tc.constraint_name = rc.constraint_name
   WHERE tc.table_name = 'generations' 
     AND kcu.column_name = 'cv_id';
   ```

   **Expected result:**
   - `delete_rule` should be `SET NULL` (not `CASCADE`)

3. **Test the fix:**
   - Upload a CV
   - Generate a tailored version
   - Delete the original CV
   - Verify the generation still exists
   - Check that `cv_id` is NULL for the generation

## User Experience

### Before Fix
```
User: *Deletes original CV*
System: *Deletes CV + ALL 10 generated versions*
User: "Where did all my work go?!" 😱
```

### After Fix
```
User: *Deletes original CV*
System: *Deletes CV only, preserves all 10 generated versions*
User: "Great! I can still access my tailored CVs!" 😊
```

## Updated Confirmation Message

Dashboard delete confirmation now says:
```
"Are you sure you want to delete this CV? 
Your generated versions will be preserved, but the 
original uploaded CV will be permanently deleted."
```

## Technical Details

### Database Changes
- `generations.cv_id` is now nullable
- Foreign key uses `ON DELETE SET NULL`
- Generations with NULL `cv_id` are orphaned but functional
- All generation data (job_title, output_sections, etc.) is preserved

### Application Logic
- No changes needed in application code
- Dashboard already handles NULL cv_id gracefully
- Generations can be viewed/downloaded even without original CV
- Edit functionality may be limited for orphaned generations

## Why This Matters

### Data Preservation
- Generations represent hours of user work
- Each generation is tailored to a specific job
- Losing generations means losing job applications
- Users may have already sent CVs to employers

### User Trust
- Users expect their work to be safe
- Deleting source shouldn't delete output
- Similar to: deleting a photo shouldn't delete edits

### Business Impact
- Prevents user frustration and churn
- Reduces support requests
- Builds trust in the platform
- Protects user data

## Future Considerations

### Orphaned Generations
- Generations with NULL cv_id can still be used
- May want to add UI indicator for orphaned generations
- Could add "restore original CV" feature
- Consider cleanup policy for very old orphaned generations

### Alternative Approaches Considered

1. **Soft Delete (Rejected)**
   - Would require adding `deleted_at` column
   - More complex queries
   - Still risk of accidental permanent delete

2. **Block Delete if Generations Exist (Rejected)**
   - Forces user to delete generations first
   - Poor UX
   - Users may want to clean up originals

3. **SET NULL (Chosen)**
   - Simple and effective
   - Preserves user work
   - No breaking changes
   - Best UX

## Rollback Plan

If needed, revert with:

```sql
-- WARNING: This will re-enable CASCADE delete!
ALTER TABLE generations DROP CONSTRAINT generations_cv_id_fkey;
ALTER TABLE generations ALTER COLUMN cv_id SET NOT NULL;
ALTER TABLE generations 
ADD CONSTRAINT generations_cv_id_fkey 
FOREIGN KEY (cv_id) 
REFERENCES cvs(id) 
ON DELETE CASCADE;
```

**DO NOT rollback unless absolutely necessary - this will cause data loss!**

## Status

✅ Migration created
✅ Dashboard message updated
✅ Documentation complete
⏳ Awaiting deployment to production

## Testing Checklist

- [ ] Run migration in Supabase
- [ ] Verify constraint changed to SET NULL
- [ ] Upload test CV
- [ ] Generate tailored version
- [ ] Delete original CV
- [ ] Verify generation still exists
- [ ] Verify cv_id is NULL
- [ ] Verify generation can be viewed
- [ ] Verify generation can be downloaded
- [ ] Check dashboard shows correct message

## Related Files

- `migrations/fix-generation-cascade-delete.sql` - Migration script
- `src/app/dashboard/page.tsx` - Updated delete confirmation
- `supabase-setup.sql` - Original schema (needs updating for new installs)
