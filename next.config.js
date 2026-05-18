/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['prep.kidvo.eu', 'localhost:3000'],
    },
  },
}

module.exports = nextConfig
