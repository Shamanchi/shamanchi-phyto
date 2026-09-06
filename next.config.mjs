// Статический экспорт для GitHub Pages (project site: /shamanchi-phyto/).
// Локально: next dev обслуживает сайт на http://localhost:3000/shamanchi-phyto
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/shamanchi-phyto";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;