/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Thai_BAR',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Thai_BAR',
  },
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for static hosting
  trailingSlash: true,
};

export default nextConfig;