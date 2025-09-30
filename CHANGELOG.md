# Changelog

All notable changes to the CV Adapter project.

## [2.0.0] - 2025-09-29

### 🎉 Major Features Added

#### CV Editor System
- **Advanced CV Editor** with live preview and section management
- **Smart Layout System** - 5 positioning options (left, center, right, top-right, inline)
- **Rich Text Formatting** - Bold, italic, underline, bullets, font size, text color
- **AI Populate** - AI-powered content generation for individual sections
- **Theme Customization** - Font selection, colors, sizing with live preview
- **Section Management** - Add, delete, reorder sections with drag & drop
- **Multi-format Export** - DOCX, PDF, TXT with professional formatting
- **Template Support** - Quick templates for common sections
- **Version Control** - Track changes and revert to previous versions

#### Cover Letter System
- **Cover Letter Generator** - AI-powered personalized cover letters
- **Form-based Creation** - Job title, company, hiring manager, job description
- **Customization Options** - Length (short/long), tone (professional/friendly/enthusiastic/formal)
- **Multi-format Export** - TXT, DOCX, PDF with professional business letter formatting
- **CV Integration** - Automatically uses CV content for personalization
- **Copy to Clipboard** - Quick copy functionality
- **Usage Tracking** - Integrated with AI usage limits

#### Enhanced Dashboard
- **Unified Activity Feed** - Real-time feed of all user activities
- **Tabbed Interface** - Overview, CVs, Generations, Cover Letters tabs
- **Enhanced Stats Cards** - 4-card layout with comprehensive metrics
- **Search & Filtering** - Real-time search across all document types
- **Quick Actions** - Prominent buttons for common workflows
- **Usage Analytics** - Visual progress tracking and upgrade prompts
- **Contextual Empty States** - Different messages for search vs. no data

### 🔧 Technical Improvements

#### Authentication & Security
- **Fixed Upload Authentication** - Removed hardcoded user ID, now uses proper auth tokens
- **Authorization Headers** - All API routes now validate user sessions
- **RLS Policies** - Enhanced row-level security on all tables
- **Error Handling** - Comprehensive error handling with user-friendly messages

#### Database Enhancements
- **CV Sections Table** - New table for granular section management
- **CV Versions Table** - Track changes and enable version history
- **AI Usage Tracking** - Enhanced tracking for multiple AI features
- **Cover Letters Table** - Complete schema with backward compatibility
- **Schema Migrations** - Proper migration files for all changes

#### API Improvements
- **CV Section Management** - CRUD operations for sections
- **AI Populate Endpoint** - Generate content for individual sections
- **Cover Letter Generation** - AI-powered cover letter creation
- **Export Endpoints** - Multi-format export for CVs and cover letters
- **Better Error Responses** - Detailed error messages for debugging

#### UI/UX Enhancements
- **Loading States** - Proper loading indicators throughout
- **Toast Notifications** - User feedback for all actions
- **Responsive Design** - Mobile-friendly layouts
- **Drag & Drop** - Intuitive section reordering
- **Color Pickers** - Visual color selection for themes
- **Font Selectors** - Professional font choices
- **Export Dropdowns** - Clean format selection UI

### 🐛 Bug Fixes

- Fixed duplicate sections appearing in CV editor
- Fixed overlapping sections with top-right layout
- Fixed cover letters table schema mismatch (position_title vs job_title)
- Fixed missing authorization in upload endpoint
- Fixed markdown rendering in CV preview
- Fixed export functionality for multiple formats
- Fixed AI usage tracking for free users
- Fixed empty state messages in dashboard

### 📊 Database Schema Changes

#### New Tables
```sql
- cv_sections: Stores individual CV sections with formatting
- cv_versions: Tracks version history for CVs
- ai_usage_tracking: Enhanced AI usage tracking
```

#### Modified Tables
```sql
- cvs: Added last_accessed_at, updated_at columns
- cover_letters: Added job_title column for compatibility
```

#### New Indexes
```sql
- idx_cv_sections_cv_id
- idx_cv_sections_user_id
- idx_cv_versions_cv_id
- idx_ai_usage_tracking_user_date
```

### 🎨 UI Components Added

- CV Section Editor with live preview
- Theme Settings Panel
- AI Populate Options Panel
- Export Format Dropdown
- Section Template Selector
- Activity Feed Component
- Stats Cards with Progress Bars
- Search Bar with Filtering
- Tab Navigation Component

### 📝 Documentation

- Added DEPLOYMENT_CHECKLIST.md
- Added CHANGELOG.md
- Updated README.md with new features
- Added inline code documentation
- Created schema migration files

### ⚡ Performance Improvements

- Client-side filtering for instant search results
- Optimized database queries with proper indexes
- Reduced API calls with local state management
- Lazy loading for large document lists
- Efficient re-rendering with React optimization

### 🔄 Breaking Changes

- Upload API now requires authentication header
- Cover letters table schema updated (use migration script)
- CV sections now stored separately from main CV record

### 📦 Dependencies

No new dependencies added. All features built with existing stack:
- Next.js 15
- React 19
- Supabase
- OpenAI
- docx library
- TailwindCSS

---

## [1.0.0] - 2025-09-20

### Initial Release

- User authentication (email + OAuth)
- CV upload (PDF, DOCX)
- CV parsing and section extraction
- AI-powered CV rewriting
- Diff viewer
- Template selection
- Multiple export formats
- Usage tracking (100 free generations)
- Dashboard
- Subscription management (basic)

---

## Upgrade Guide

### From 1.0.0 to 2.0.0

1. **Run Database Migrations**
   ```sql
   -- Run in Supabase SQL Editor
   -- 1. cv-editor-schema.sql
   -- 2. cover-letters-schema-fix.sql
   ```

2. **Update Environment Variables**
   - No new environment variables required
   - Verify existing variables are set

3. **Update Client Code**
   - Upload functionality now requires authentication
   - Update any custom API calls to include auth headers

4. **Test New Features**
   - Test CV editor functionality
   - Test cover letter generation
   - Verify dashboard displays correctly
   - Check export functionality

5. **Deploy**
   - Follow DEPLOYMENT_CHECKLIST.md
   - Verify all features work in production

---

**Note**: This is a major version upgrade with significant new features and database changes. Please test thoroughly before deploying to production.
