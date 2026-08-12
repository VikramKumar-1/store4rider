/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 's3.ap-south-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'store4riders.s3.ap-south-2.amazonaws.com',
      }
    ],
  },
};

export default nextConfig;
