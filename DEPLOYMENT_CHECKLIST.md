# CV Adapter - Deployment Checklist

## 🔧 Pre-Deployment Tasks

### Database Migrations
- [ ] Run `cv-editor-schema.sql` in Supabase SQL Editor
- [ ] Run `cover-letters-schema-fix.sql` in Supabase SQL Editor  
- [ ] Verify all tables exist: `cvs`, `cv_sections`, `cv_versions`, `generations`, `cover_letters`, `ai_usage_tracking`
- [ ] Verify RLS policies are enabled on all tables
- [ ] Check indexes are created for performance

### Environment Variables
- [ ] `OPENAI_API_KEY` - **REQUIRED** - OpenAI API key for AI features
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (optional)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (optional)
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (optional)
- [ ] `NODE_ENV=production` - Set to production

### Code Quality Checks
- [ ] Run `npm run build` to verify no build errors
- [ ] Check for TypeScript errors: `npm run type-check` (if available)
- [ ] Test all critical user flows locally
- [ ] Verify authentication works (email + OAuth)
- [ ] Test file upload with PDF and DOCX files
- [ ] Test CV generation and AI rewriting
- [ ] Test CV editor functionality
- [ ] Test cover letter generation
- [ ] Test export functionality (TXT, DOCX, PDF)

## 🚀 Deployment Steps

### 1. Vercel Deployment
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Connect to Vercel
# 1. Go to vercel.com
# 2. Import your GitHub repository
# 3. Add environment variables
# 4. Deploy
```

### 2. Post-Deployment Verification
- [ ] Visit production URL and verify homepage loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Upload a test CV
- [ ] Generate a tailored CV
- [ ] Edit CV in the editor
- [ ] Export CV in multiple formats
- [ ] Create a cover letter
- [ ] Export cover letter
- [ ] Check dashboard shows all documents
- [ ] Test search functionality
- [ ] Verify usage tracking works

### 3. Performance Checks
- [ ] Check Lighthouse scores (aim for >90)
- [ ] Verify page load times (<3s)
- [ ] Test on mobile devices
- [ ] Check API response times
- [ ] Monitor Supabase query performance

## 📊 Monitoring Setup

### Vercel Analytics
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking
- [ ] Configure performance monitoring

### Supabase Monitoring
- [ ] Check database connection limits
- [ ] Monitor RLS policy performance
- [ ] Set up database backups
- [ ] Configure alerts for errors

### OpenAI Usage
- [ ] Monitor API usage and costs
- [ ] Set up usage alerts
- [ ] Configure rate limits if needed

## 🔒 Security Checklist

- [ ] All API routes use proper authentication
- [ ] RLS policies protect user data
- [ ] No sensitive keys in client-side code
- [ ] File upload size limits enforced (10MB)
- [ ] File type validation in place
- [ ] SQL injection protection via Supabase
- [ ] XSS protection via React
- [ ] CORS configured properly

## 🎯 Feature Verification

### Core Features
- [ ] ✅ User authentication (email + OAuth)
- [ ] ✅ CV upload (PDF, DOCX)
- [ ] ✅ CV parsing and section extraction
- [ ] ✅ AI-powered CV rewriting
- [ ] ✅ CV editor with live preview
- [ ] ✅ Multi-format export (TXT, DOCX, PDF)
- [ ] ✅ Cover letter generation
- [ ] ✅ Cover letter export
- [ ] ✅ Dashboard with activity feed
- [ ] ✅ Usage tracking and limits
- [ ] ✅ Search and filtering

### Advanced Features
- [ ] ✅ CV sections management
- [ ] ✅ Rich text formatting
- [ ] ✅ Theme customization
- [ ] ✅ AI populate for sections
- [ ] ✅ Section reordering (drag & drop)
- [ ] ✅ Advanced positioning options
- [ ] ✅ Professional DOCX generation
- [ ] ⚠️ Stripe subscription integration (optional)
- [ ] ⚠️ PDF generation via Puppeteer (may need setup)

## 📝 Known Issues & Limitations

### Current Limitations
1. **PDF Generation**: Uses existing system, may need Puppeteer setup in production
2. **Stripe Integration**: Not fully implemented, payments disabled
3. **OAuth Providers**: Need to configure Google/LinkedIn OAuth in Supabase
4. **Email Templates**: Default Supabase templates, may want to customize

### Future Improvements
- [ ] Add batch operations (delete multiple CVs)
- [ ] Implement CV templates gallery
- [ ] Add more export formats (HTML, LaTeX)
- [ ] Implement version history for CVs
- [ ] Add collaboration features
- [ ] Implement AI suggestions for improvements
- [ ] Add analytics dashboard for users
- [ ] Implement email notifications

## 🐛 Troubleshooting

### Common Issues

**Issue**: OpenAI API errors
- **Solution**: Verify API key is valid and has credits

**Issue**: File upload fails
- **Solution**: Check file size (<10MB) and format (PDF/DOCX)

**Issue**: Database connection errors
- **Solution**: Verify Supabase credentials and RLS policies

**Issue**: Authentication not working
- **Solution**: Check Supabase auth settings and redirect URLs

**Issue**: Export fails
- **Solution**: Verify docx library is installed and working

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## ✅ Final Checklist

Before going live:
- [ ] All database migrations completed
- [ ] All environment variables set
- [ ] Build succeeds without errors
- [ ] All critical features tested
- [ ] Security measures verified
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on features
- [ ] Support process established

---

**Last Updated**: 2025-09-29
**Version**: 2.0.0
**Status**: Ready for Deployment ✅
