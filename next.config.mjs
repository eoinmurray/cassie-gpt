/** @type {import('next').NextConfig} */

// const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  transpilePackages: [],
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.plugins = [...config.plugins, new PrismaPlugin()]
  //   }
  //   return config
  // },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: process.env.NODE_ENV === "development" ? "http://localhost:3001/:path*" : "https://notebooks.e01n.dev/:path*"
        },
      ]
    }
  },
}

export default nextConfig;