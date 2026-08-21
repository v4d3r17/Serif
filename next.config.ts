import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qssuinvkvinmhfqhndww.supabase.co',
      },
    ],
  },
};

export default nextConfig;
