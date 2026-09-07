/**
 * Путь к файлу из public/ с учётом подпути деплоя.
 *
 * basePath из next.config.mjs Next подставляет сам только в <Link> и
 * next/image; обычные src и href он не трогает, поэтому шрифты, картинки
 * и манифест прогоняются через эту функцию — иначе на GitHub Pages
 * (сайт живёт по /barber/) они дают 404.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function asset(path: string): string {
  return `${BASE}${path}`;
}
