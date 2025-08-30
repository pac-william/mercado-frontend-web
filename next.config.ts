import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: '/mercado-frontend-web',
  assetPrefix: '/mercado-frontend-web/',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
