import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Work articles are read from disk at request time; ship them with the functions.
  outputFileTracingIncludes: {
    '/api/json': ['./public/jsons/work/articles/*.json'],
    '/work': ['./public/jsons/work/articles/*.json'],
  },
};

export default nextConfig;
