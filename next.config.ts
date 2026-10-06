import withPWA from 'next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/weather',
  webpack: (config) => {
    return config;
  },
  turbopack: {}
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(withNextIntl(nextConfig));
