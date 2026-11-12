/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'okiedokie-erp-images.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
};

module.exports = nextConfig;
