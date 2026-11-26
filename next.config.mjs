/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // Media is served with plain <img>/<video> tags, so no image domain allow-list is required.
  images: { unoptimized: true }
};

export default nextConfig;
