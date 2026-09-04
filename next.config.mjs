/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статический экспорт: собранный сайт — обычные файлы, поэтому он одинаково
  // едет и на Vercel, и на GitHub Pages (workflow в .github/workflows/pages.yml).
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
