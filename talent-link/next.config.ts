//eslint-disable-next-line @typescript-eslint/no-require-imports
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default withNextIntl(nextConfig)
