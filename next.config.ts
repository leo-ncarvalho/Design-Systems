import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allows a second build (e.g. for audits) without touching the running one.
  distDir: process.env.DIST_DIR ?? ".next",
};

export default nextConfig;
