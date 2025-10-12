import createMDX from '@next/mdx'
import type { NextConfig } from "next";
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextjs.org",
      },
      {
        protocol: "https",
        hostname: "*vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  }
}

export default withMDX(nextConfig)
