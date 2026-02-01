// next.config.ts
/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next'

// next-intl plugin (giữ nguyên theo dự án của bạn)
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/socket.io',
        destination: 'https://talentlink.io.vn/socket.io/', // Ensure trailing slash for destination if backend needs it, or match source
      },
      {
        source: '/socket.io/:path+',
        destination: 'https://talentlink.io.vn/socket.io/:path+',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'talentlink.io.vn',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
