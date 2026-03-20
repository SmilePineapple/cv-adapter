# Database Schema Reference

**Last Updated:** March 20, 2026  
**Purpose:** Document actual database tables for reference when writing SQL scripts

---

## 📊 **Core Tables (Confirmed to Exist)**

Based on `database-schema.sql` and migration files, these tables exist:

### **1. profiles**
- Extends `auth.users`
- Stores user profile information
- **Columns:** id, email, full_name, avatar_url, created_at, updated_at, last_activity_at, onboarding_completed

### **2. cvs**
- Stores uploaded CV data
- **Columns:** id, user_id, original_text, parsed_sections, file_meta, created_at, updated_at, last_accessed_at

### **3. generations**
- CV rewrite history
- **Columns:** id, user_id, cv_id, job_title, job_description, rewrite_style, tone, output_sections, diff_meta, created_at

### **4. usage_tracking**
- Tracks generation limits and usage
- **Columns:** user_id, current_month, generation_count, last_reset_at, created_at, updated_at, plan_type, current_generations, max_lifetime_generations, last_generation_date, interview_preps_used

### **5. subscriptions**
- Stripe integration
- **Columns:** id, user_id, stripe_customer_id, stripe_subscription_id, status, current_period_start, current_period_end, created_at, updated_at

### **6. cover_letters**
- Optional feature for cover letter generation
- **Columns:** id, user_id, generation_id, content, created_at

### **7. interview_preps**
- Interview preparation data
- **Columns:** id, user_id, cv_id, job_description, company_research, interview_data, created_at
- **Added by:** `migrations/add-interview-prep.sql`

### **8. purchases**
- One-time payment records
- **Columns:** id, user_id, stripe_customer_id, stripe_payment_intent_id, amount, currency, status, created_at, updated_at
- **Added by:** `migrate-to-lifetime-payments-fresh.sql`

---

## ❌ **Tables That DON'T Exist**

These tables were referenced in the original reset script but don't exist:

### **skills_assessments**
- ❌ NOT in production database
- There's a migration file (`migrations/skills-assessment-schema.sql`) but it may not have been run
- Related tables: `skill_assessment_questions`, `skill_assessment_answers`

### **activity_logs**
- ❌ NOT in production database
- No CREATE TABLE statement found in any schema files
- Likely planned but never implemented

---

## 📋 **Tables Added by Migrations**

These tables exist if their migration files were run:

### **ai_improvements**
- Tracks AI improvement usage
- **Migration:** `migrations/add-ai-improvements-tracking.sql`

### **ats_optimization_history**
- Tracks ATS optimization history
- **Migration:** `migrations/add-ats-optimization-tracking.sql`

### **competition_scores**
- Competition system for free Pro access
- **Migration:** `migrations/add-competition-system.sql`

### **competitions**
- Active competitions tracking
- **Migration:** `migrations/add-competition-system.sql`

### **social_media_posts**
- Social media bot posts
- **Migration:** `migrations/social-media-bot-setup.sql`

### **social_media_config**
- Social media API configuration
- **Migration:** `migrations/social-media-bot-setup.sql`

### **social_media_analytics**
- Social media analytics
- **Migration:** `migrations/social-media-bot-setup.sql`

### **email_campaigns**
- Email campaign management
- **Migration:** `email-campaign-queue-setup.sql`

### **campaign_recipients**
- Campaign recipient tracking
- **Migration:** `email-campaign-queue-setup.sql`

---

## 🔍 **How to Verify Tables Exist**

Run this query in Supabase SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Or use the provided script:
```bash
scripts/check-existing-tables.sql
```

---

## ⚠️ **Important Notes for SQL Scripts**

When writing SQL scripts that interact with user data:

1. **Always check table existence first** using:
   ```sql
   SELECT EXISTS (
     SELECT 1 FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_name = 'table_name'
   );
   ```

2. **Use conditional deletes** for tables that may not exist:
   ```sql
   DO $$
   BEGIN
     IF EXISTS (SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'table_name') THEN
       DELETE FROM table_name WHERE user_id = some_user_id;
     END IF;
   END $$;
   ```

3. **Core tables that are safe to reference:**
   - profiles
   - cvs
   - generations
   - usage_tracking
   - subscriptions
   - cover_letters
   - interview_preps
   - purchases

4. **Tables to avoid unless confirmed:**
   - skills_assessments
   - activity_logs
   - Any table from migrations that may not have been run

---

## 📝 **User Data Reset Checklist**

When resetting a test account, delete/reset in this order:

1. ✅ **generations** - CV generation history
2. ✅ **cover_letters** - Generated cover letters
3. ✅ **interview_preps** - Interview prep data
4. ✅ **cvs** - Uploaded CVs
5. ✅ **usage_tracking** - Reset to free tier (UPDATE, not DELETE)
6. ✅ **subscriptions** - Delete subscription records
7. ✅ **purchases** - Delete purchase records
8. ✅ **profiles** - Reset onboarding_completed flag (UPDATE, not DELETE)

**DO NOT DELETE:**
- The user record in `auth.users`
- The profile record (just UPDATE it)
- The usage_tracking record (just UPDATE it)

---

## 🔗 **References**

- Main schema: `database-schema.sql`
- Migrations folder: `migrations/*.sql`
- Supabase setup: `supabase-setup.sql`
- Payment migration: `migrate-to-lifetime-payments-fresh.sql`

---

**Last Verified:** March 20, 2026  
**Status:** ✅ Accurate based on codebase analysis
