# Language Support - Quick Setup Guide

## Step 1: Install Dependencies

The `franc-min` package should be installing now. If it hasn't completed, run:

```bash
npm install franc-min
```

## Step 2: Run Database Migration

Open your Supabase SQL Editor and run the migration script:

```sql
-- File: add-language-support.sql
-- This adds language columns to your database

ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS detected_language VARCHAR(10) DEFAULT 'en';

ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS output_language VARCHAR(10) DEFAULT 'en';

ALTER TABLE cover_letters 
ADD COLUMN IF NOT EXISTS output_language VARCHAR(10) DEFAULT 'en';

CREATE INDEX IF NOT EXISTS idx_cvs_detected_language ON cvs(detected_language);
CREATE INDEX IF NOT EXISTS idx_generations_output_language ON generations(output_language);
```

## Step 3: Test the Implementation

### Test 1: Upload an English CV
1. Go to `/upload`
2. Upload an English CV
3. Check console logs - should see: `Language detected: en (English) confidence: high`
4. Generate CV - output should be in English

### Test 2: Upload a Non-English CV (if available)
1. Upload a French/Spanish/Arabic CV
2. Check console logs - should detect correct language
3. Generate CV - output should be in the same language
4. Check dashboard - language badge should appear

### Test 3: Cover Letter Generation
1. Create a cover letter from a non-English CV
2. Output should be in the same language as the CV

## Step 4: Verify Dashboard Display

1. Go to `/dashboard`
2. Non-English CVs should show language badges
3. Generations from non-English CVs should show language badges
4. Cover letters should show language badges

## What's Changed

### Files Created
- `src/lib/language-detection.ts` - Language detection utility
- `src/components/LanguageBadge.tsx` - Language badge component
- `add-language-support.sql` - Database migration
- `LANGUAGE-SUPPORT.md` - Full documentation

### Files Modified
- `src/app/api/upload/route.ts` - Added language detection
- `src/app/api/rewrite/route.ts` - Added language-aware prompts
- `src/app/api/cover-letter/generate/route.ts` - Added language support
- `src/app/dashboard/page.tsx` - Added language badges to UI

### Package Added
- `franc-min` - Lightweight language detection library

## Troubleshooting

### Issue: Language detection not working
**Solution**: Ensure `franc-min` is installed:
```bash
npm install franc-min
npm run dev
```

### Issue: Database errors
**Solution**: Run the migration script in Supabase SQL Editor

### Issue: Language badges not showing
**Solution**: 
1. Check that CVs have `detected_language` field
2. Restart dev server
3. Clear browser cache

### Issue: AI still generating in English
**Solution**:
1. Check console logs for language detection
2. Verify CV has `detected_language` stored
3. Check OpenAI API is receiving language instructions

## Next Steps

1. **Test with real non-English CVs** from your user base
2. **Monitor language usage** - add analytics to track which languages are popular
3. **Update marketing** - create landing pages for top languages
4. **SEO optimization** - target keywords like "French CV builder", "Arabic resume generator"
5. **Consider UI translation** - translate buttons/labels for top 3-5 languages

## Expected Behavior

### For English CVs
- `detected_language`: "en"
- No language badge shown (default)
- All output in English

### For French CVs
- `detected_language`: "fr"
- Blue language badge showing "French"
- All output in French

### For Arabic CVs
- `detected_language`: "ar"
- Amber language badge showing "Arabic"
- All output in Arabic
- RTL formatting guidance provided

## Performance Impact

- **Minimal**: Language detection adds ~10-50ms to upload
- **No cost increase**: Same OpenAI token usage
- **Storage**: +2-10 bytes per record (language code)

## Success Metrics to Track

1. **Language Distribution**: Which languages are users uploading?
2. **Conversion Rates**: Do non-English users convert better now?
3. **Generation Quality**: Are non-English generations high quality?
4. **User Feedback**: Are international users satisfied?

## Ready to Deploy?

Once you've:
- ✅ Installed `franc-min`
- ✅ Run database migration
- ✅ Tested with sample CVs
- ✅ Verified dashboard displays correctly

You're ready to deploy! This feature will work automatically for all users without any configuration needed.
