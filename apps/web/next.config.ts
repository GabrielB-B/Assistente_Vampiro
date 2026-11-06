import type { NextConfig } from "next";

const additionalDevOrigin = process.env.NEXT_ALLOWED_DEV_ORIGIN?.trim();

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    ...(additionalDevOrigin ? [additionalDevOrigin] : []),
  ],
  reactStrictMode: true,
  async rewrites() {
    const apiOrigin =
      process.env.API_INTERNAL_URL ??
      process.env.API_INTERNAL_ORIGIN ??
      "http://127.0.0.1:3001";
    return [
      {
        destination: `${apiOrigin}/api/v1/:path*`,
        source: "/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
