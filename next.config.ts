import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lightcyan-gorilla-655722.hostingersite.com',
      },
      {
        protocol: 'https',
        hostname: '*.hostingersite.com',
      },
    ],
  },
};

export default nextConfig;
