/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "silly-jeana-dardzair-c1906402.koyeb.app",
        port: "",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
