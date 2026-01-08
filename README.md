# CV Adapter - AI-Powered CV Tailoring Platform

CV Adapter is an AI-powered web application that helps job seekers tailor their CVs to specific job descriptions. Users upload their CV, input job details, and get an optimized version that matches the target role's language and requirements.

## 🚀 Features

### Core Features
- **AI-Powered CV Rewriting**: Uses OpenAI GPT to optimize CVs for specific job descriptions
- **Multiple File Formats**: Supports PDF and Word document uploads
- **Smart Parsing**: Automatically extracts CV sections (name, contact, experience, etc.)
- **Customizable Rewriting**: Choose from different styles (conservative, balanced, bold) and tones
- **Side-by-Side Diff Viewer**: See exactly what changed with highlighted differences
- **10 Professional Templates**: Modern, classic, minimal, and more
- **Multiple Export Formats**: Download as PDF, Word, HTML, or plain text
- **Usage Tracking**: 100 free generations per month with subscription options
- **Secure Authentication**: Email/password + Google/LinkedIn OAuth

### ✨ Advanced Features (v2.0)

#### CV Editor
- **Live Preview Editor**: Edit CV sections with real-time preview
- **Smart Layout System**: 5 positioning options (left, center, right, top-right, inline)
- **Rich Text Formatting**: Bold, italic, underline, bullets, font size, text color
- **AI Populate**: Generate content for individual sections with AI
- **Theme Customization**: Choose fonts, colors, and sizing
- **Drag & Drop**: Reorder sections intuitively
- **Section Templates**: Quick templates for common sections
- **Professional Export**: DOCX with proper Word formatting, PDF, TXT

#### Cover Letter Generator
- **AI-Powered Generation**: Create personalized cover letters from your CV
- **Customization Options**: Choose length (short/long) and tone (professional/friendly/enthusiastic/formal)
- **Job-Specific**: Tailored to job title, company, and job description
- **Multi-Format Export**: Download as TXT, DOCX, or PDF
- **Professional Formatting**: Business letter format with proper headers

#### Enhanced Dashboard
- **Unified Activity Feed**: See all your CV uploads, generations, and cover letters in one place
- **Tabbed Interface**: Organize documents by type (CVs, Generations, Cover Letters)
- **Search & Filtering**: Find documents quickly with real-time search
- **Usage Analytics**: Track your monthly AI usage with visual progress bars
- **Quick Actions**: One-click access to common workflows

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email + OAuth)
- **AI**: OpenAI GPT for CV rewriting
- **Payments**: Stripe subscriptions
- **File Processing**: mammoth (docx), pdf-parse (pdf)
- **PDF Generation**: Puppeteer
- **Document Export**: docx library for Word files

## 📋 Prerequisites

Before running this project, you need:

1. **Node.js 18+** installed
2. **OpenAI API Key** (REQUIRED) - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
3. **Supabase Project** - Already configured (credentials provided)
4. **Stripe Account** (Optional for payments) - Get from [Stripe Dashboard](https://dashboard.stripe.com)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd cv-adapter
npm install
```

### 2. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env.local
```

**IMPORTANT**: Add your OpenAI API key to `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

The Supabase credentials are already configured. For Stripe (optional):
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

### 3. Database Setup

Run the database schema in your Supabase SQL Editor:
```bash
# Copy the contents of database-schema.sql and run in Supabase
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
cv-adapter/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Landing page
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── upload/            # CV upload page
│   │   ├── generate/[id]/     # Job input & generation
│   │   ├── review/[id]/       # Diff viewer & editing
│   │   ├── download/[id]/     # Template selection & export
│   │   └── api/               # API routes
│   │       ├── auth/          # Supabase auth callbacks
│   │       ├── upload/        # File upload & parsing
│   │       ├── rewrite/       # OpenAI CV rewriting
│   │       └── export/        # File export (PDF, DOCX, etc.)
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utility libraries (Supabase client)
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── database-schema.sql        # Supabase database schema
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🔑 Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for CV rewriting | ✅ **YES** |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Configured |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ Configured |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ Configured |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Optional |
| `STRIPE_SECRET_KEY` | Stripe secret key | Optional |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Optional |

## 🗄️ Database Schema

The application uses the following main tables:
- `profiles` - User profile information
- `cvs` - Uploaded CV data and parsed sections
- `generations` - CV rewrite history and results
- `usage_tracking` - Monthly generation limits
- `subscriptions` - Stripe subscription data
- `cover_letters` - Generated cover letters (optional)

## 🔒 Security Features

- **Row Level Security (RLS)** on all Supabase tables
- **Server-side API key management** - OpenAI key never exposed to client
- **Data encryption** at rest and in transit
- **GDPR compliance** with 5-year data retention policy
- **Input validation** and file size limits
- **Rate limiting** on API endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:
- `OPENAI_API_KEY` (required)
- All Supabase variables (already configured)
- Stripe variables (if using payments)
- `NODE_ENV=production`

## 📊 Usage Limits

- **Free Users**: 100 CV generations per month
- **Pro Users**: Unlimited generations (£5/month)
- **File Size Limit**: 10MB per upload
- **Supported Formats**: PDF, DOC, DOCX

## 🎨 Templates

The application includes 10 professional CV templates:
1. Modern - Clean and contemporary
2. Classic - Traditional professional
3. Minimal - Simple and elegant
4. Creative - Bold and eye-catching
5. Technical - Perfect for tech roles
6. Executive - Senior-level professional
7. Academic - Research focused
8. Startup - Dynamic and innovative
9. Corporate - Traditional business
10. Designer - Visually striking

## 🔧 Development

### Key Technologies & Patterns

- **Server Components** for data fetching
- **Client Components** for interactivity
- **API Routes** for backend logic
- **Supabase RLS** for data security
- **TypeScript** for type safety
- **TailwindCSS** for styling

### Adding New Features

1. Create database migrations in Supabase
2. Update TypeScript types in `src/types/`
3. Add API routes in `src/app/api/`
4. Create UI components in `src/components/`
5. Add pages in `src/app/`

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Error**: Ensure your API key is valid and has credits
2. **File Upload Fails**: Check file size (max 10MB) and format (PDF/DOC/DOCX)
3. **Database Connection**: Verify Supabase credentials in environment variables
4. **PDF Generation Fails**: Puppeteer may need additional setup in production

### Debug Mode

Set `NODE_ENV=development` and check browser console for detailed error messages.

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For technical support or questions:
1. Check the troubleshooting section above
2. Review the database schema and API documentation
3. Ensure all environment variables are correctly set

---

**Note**: This application requires an OpenAI API key to function. The CV rewriting feature will not work without it.
