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
        destination: 'https://satyabhama-admin.vercel.app',
      },
      {
        source: '/admin/:path*',
        destination: 'https://satyabhama-admin.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
