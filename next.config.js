/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https', // Allows HTTPS images
          hostname: '**',    // This will allow all hostnames
        },
      ],
    },
  };
