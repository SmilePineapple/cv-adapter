# Issues to Fix

## 1. Social Bot Not Auto-Posting ⏰
**Status**: Scheduled posts at 2pm not being sent
**Root Cause**: Need to check Vercel cron logs
**Files**: 
- `vercel.json` - Cron configured for 14:00 UTC
- `src/app/api/social-bot/cron/route.ts` - Cron endpoint

**Possible Issues**:
- Cron not triggering
- Posts scheduled with wrong timezone
- Platform credentials missing/expired
- Daily limits reached

**Fix**: Check Vercel dashboard for cron execution logs

## 2. Skills Not Updating ❌
**Status**: Skills show default percentages, not custom levels
**Root Cause**: Skill names have malformed JSON in database
**Example**: `{ name: '["Exceptional communication skills"', level: 65 }`

**Problem**: 
- SkillScoreEditor.tsx line 64: `JSON.stringify(skillsSection.content)`
- This creates: `'["Skill 1","Skill 2"]'` instead of array
- When parsed, each skill name gets brackets: `'["Skill 1"'`

**Fix**: Parse skills array properly, don't stringify

## 3. Preview Not Showing Contact Info 👁️
**Status**: Export shows contact info, preview doesn't
**Root Cause**: Preview uses different data source than export
**Files**:
- `src/app/download/[id]/page.tsx` - Preview generation
- `src/app/api/export/route.ts` - Export generation (works)

**Fix**: Apply same contact normalization to preview

## 4. Sidebar Icon Alignment 🎨
**Status**: Icons don't align with sections
**Root Cause**: Hardcoded static icons
**Files**: `src/lib/stunning-templates.ts` - Teal Sidebar template

**Current**:
```html
<div class="sidebar-icon">👤</div>
<div class="sidebar-icon">💼</div>
<div class="sidebar-icon">🎓</div>
```

**Fix**: Make icons dynamic based on sections present
