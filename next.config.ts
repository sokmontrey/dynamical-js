import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "dist",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
