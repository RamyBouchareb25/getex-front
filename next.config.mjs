import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // Broad patterns that will work across environments
      {
        protocol: "https",
        hostname: "**", // Wildcard - allows any HTTPS hostname
      },
      {
        protocol: "http",
        hostname: "**", // Wildcard - allows any HTTP hostname
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "**", // Any port for localhost
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
