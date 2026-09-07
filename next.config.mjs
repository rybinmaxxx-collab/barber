/** @type {import('next').NextConfig} */

// GitHub Pages отдаёт сайт репозитория по подпути (/barber/), Vercel и
// собственный домен — от корня. Подпуть задаётся переменной окружения,
// поэтому одна и та же сборка годится и туда, и туда.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Статический экспорт: собранный сайт — обычные файлы.
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
