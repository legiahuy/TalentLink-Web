// next.config.ts
/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next'

// next-intl plugin (giữ nguyên theo dự án của bạn)
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'talentlink.io.vn',
        pathname: '/storage/**',
      },
    ],
    domains: ['avatar.iran.liara.run'],
  },
}

export default withNextIntl(nextConfig)
