/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'vimeo.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
