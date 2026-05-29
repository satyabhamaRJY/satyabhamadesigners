/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: process.env.ADMIN_URL || 'https://satyabhamadesigners-admin-dashboard.vercel.app',
      },
      {
        source: '/admin/:path*',
        destination: `${process.env.ADMIN_URL || 'https://satyabhamadesigners-admin-dashboard.vercel.app'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
