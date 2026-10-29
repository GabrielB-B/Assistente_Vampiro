import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  reactStrictMode: true,
  async rewrites() {
    const apiOrigin = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001";
    return [
      {
        destination: `${apiOrigin}/api/v1/:path*`,
        source: "/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
