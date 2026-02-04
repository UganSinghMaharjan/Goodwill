import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore
    allowedDevOrigins: ["192.168.1.92", "localhost:3001"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/static/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001",
        pathname: "/static/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.92",
        port: "8001",
        pathname: "/static/uploads/**",
      },
    ],
  },
};

export default nextConfig;
