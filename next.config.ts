import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;