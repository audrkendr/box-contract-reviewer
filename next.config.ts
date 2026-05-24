import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist'],
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;