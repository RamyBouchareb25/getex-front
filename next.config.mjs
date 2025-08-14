import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const BACKEND_HOST = process.env.BACKEND_HOST;
const BACKEND_PROTOCOL = process.env.BACKEND_PROTOCOL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: BACKEND_PROTOCOL || 'https',
        hostname: BACKEND_HOST || 'localhost',
        port: "",
        pathname: "/files/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
