import {withSentryConfig} from '@sentry/nextjs';
import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    root: path.resolve(__dirname),
  },
  
  // Configure body size limit for API routes (10MB for file uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
  // Disable static optimization for all pages (they all need runtime Supabase client)
  output: 'standalone',
  
  // Webpack configuration to fix pdf-parse issue on Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize packages to prevent bundling issues
      config.externals = config.externals || [];
      config.externals.push('pdf-parse');
      // Don't bundle chromium - it's too large
      config.externals.push('@sparticuz/chromium');
    }
    return config;
  },
  
  // 301 Redirects - Consolidate duplicate content to new comprehensive guides
  async redirects() {
    return [
      // Redirect duplicate USA resume builder page
      {
        source: '/usa-resume-builder',
        destination: '/resume-builder-usa',
        permanent: true,
      },
      // Redirect old blog posts to new comprehensive guides
      {
        source: '/blog/how-to-beat-ats-systems',
        destination: '/ats-optimization-guide',
        permanent: true,
      },
      {
        source: '/blog/cv-writing-tips',
        destination: '/cv-writing-guide',
        permanent: true,
      },
      {
        source: '/blog/ai-powered-cv-optimization-2025',
        destination: '/ats-optimization-guide',
        permanent: true,
      },
      // Redirect non-www to www (handles both http and https at app level)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mycvbuddy.com',
          },
        ],
        destination: 'https://www.mycvbuddy.com/:path*',
        permanent: true,
      },
      // Redirect .co.uk (non-www) to primary .com domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mycvbuddy.co.uk',
          },
        ],
        destination: 'https://www.mycvbuddy.com/:path*',
        permanent: true,
      },
      // Redirect www.mycvbuddy.co.uk to primary .com domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.mycvbuddy.co.uk',
          },
        ],
        destination: 'https://www.mycvbuddy.com/:path*',
        permanent: true,
      },
      // Redirect http://www to https://www (belt-and-braces for GSC crawls)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.mycvbuddy.com',
          },
        ],
        missing: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'https',
          },
        ],
        destination: 'https://www.mycvbuddy.com/:path*',
        permanent: true,
      },
    ];
  },
  
  // Allow cross-origin requests from local network
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  
  // Disable strict ESLint during build (we'll fix errors gradually)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during build (we'll fix them gradually)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "smilepineapple",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});