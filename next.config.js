const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  webpack: (config) => {
    config.resolve.alias['@images'] = path.resolve(__dirname, 'assets/images');
    config.resolve.alias['@icons'] = path.resolve(__dirname, 'assets/icons');
    return config;
  }
};

module.exports = nextConfig;
