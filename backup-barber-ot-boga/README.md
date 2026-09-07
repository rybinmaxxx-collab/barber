# Барбер от Бога — резервная копия сайта

Полная копия работающего сайта, снятая с превью-деплоя
`barber-git-claude-improve-visualization-details-3xvatk-drcp.vercel.app`
(репозиторий-оригинал `ivanvalidolski-cloud/barber`, ветка
`claude/improve-visualization-details-3xvatk`).

Это готовый к развёртыванию статический сайт: HTML, CSS, JS, шрифты и
изображения — без сборки и без внешних зависимостей.

## Что внутри

```
index.html        разметка страницы (не минифицирована, с комментариями)
assets/           бандлы Vite: main/base .css и .js, шрифты .woff2, фото .webp
.nojekyll         чтобы GitHub Pages не переваривал файлы через Jekyll
```

20 файлов в `assets/`, ~1,9 МБ целиком. Сайт одностраничный: секции
`hero, services, process, works, about, trust, reviews, booking`.

## Как развернуть

Папка самодостаточна — её нужно положить в корень отдельного репозитория
или отдать хостингу как готовую статику.

**Vercel** — `Add New → Project`, Framework preset `Other`, Build Command
оставить пустым, Output Directory `.`

**Netlify** — перетащить папку в `Sites → Deploy manually`, либо
Build command пустой, Publish directory `.`

**GitHub Pages** — положить содержимое в корень ветки, в настройках
репозитория `Pages → Deploy from a branch`.

**Локально** — `npx http-server .` или `python3 -m http.server 8080`.
Открывать через сервер, а не как `file://`: иначе не подхватятся шрифты.

## Проверено

Страница открыта в Chromium: заголовок, все 8 секций и анимации на месте,
ошибок JS нет, все запросы к `assets/` отвечают 200.

## Отличия от превью-деплоя

- удалён скрипт `vercel.live/_next-live/feedback/feedback.js` — Vercel
  подмешивает его в превью, к проекту он не относится;
- в JSON-LD поле `image` вело на `/src/assets/01-hero-interior.webp` —
  путь из дев-сборки, которого нет в проде (404). Заменён на реальный
  `/assets/01-hero-interior-CraHZXPo.webp`.

## Чего здесь нет

Это собранная версия, а не исходники. CSS и JS минифицированы, sourcemap
на деплое не выложены — восстановить исходное дерево `src/` из этой копии
нельзя. Сайт работает и правится, но правки идут по собранным файлам.
