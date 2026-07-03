import type { NextConfig } from "next";

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
} as unknown as NextConfig;

export default nextConfig;
