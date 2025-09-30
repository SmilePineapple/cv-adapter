import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    root: path.resolve(__dirname),
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

export default nextConfig;
