import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: process.env.NEXT_PUBLIC_SERVER_URL + "/graphql",
      },
      {
        source: "/access_token",
        destination: process.env.NEXT_PUBLIC_SERVER_URL + "/access_token",
      },
      {
        source: "/upload",
        destination: process.env.NEXT_PUBLIC_SERVER_URL + "/upload",
      },
    ];
  },
};

export default nextConfig;
