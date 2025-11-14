// next.config.ts
/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next'

// next-intl plugin (giữ nguyên theo dự án của bạn)
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    // Cách khuyến nghị: khai báo remotePatterns cho CDN/domain ảnh
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'talentlink.io.vn',
        pathname: '/storage/**', // ảnh của bạn đang nằm dưới /storage/...
      },
    ],

    // Hoặc dùng cách đơn giản (bật 1 trong 2, KHÔNG cần cả hai):
    // domains: ['talentlink.io.vn'],
  },
}

export default withNextIntl(nextConfig)
