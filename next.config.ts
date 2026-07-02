import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Aktifkan styled-jsx (sudah built-in Next.js)
  compiler: {
    styledJsx: true,
  },
  // API URL untuk server-side requests
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
  // Gambar dari domain eksternal
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
