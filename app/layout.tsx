import type { Metadata, Viewport } from 'next';
import './globals.css';
import { schema } from '@/lib/schema';
import { asset } from '@/lib/asset';

export const metadata: Metadata = {
  metadataBase: new URL('https://barber-ot-boga.ru'),
  title:
    'Барбер от Бога — барбершоп в Ясенево, ул. Тарусская 14к1 | мужские и детские стрижки',
  description:
    'Барбершоп «Барбер от Бога», Москва, Ясенево, ул. Тарусская 14к1, 200 м от метро. Один мастер, одно кресло, запись заранее. Стрижка 1300 ₽, ножницами 1500 ₽, с бородой 2000 ₽, детская от 1000 ₽. 5,0 на Яндекс.Картах, 74 отзыва, «Хорошее место 2026». Ежедневно 10:00–22:00.',
  alternates: { canonical: 'https://barber-ot-boga.ru/' },
  manifest: asset('/manifest.webmanifest'),
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Барбер от Бога',
    title: 'Барбер от Бога — сюда ходят годами и приводят сыновей',
    description:
      'Барбершоп на Тарусской, Ясенево. Один мастер, одно кресло, цена названа до того, как вы сели. 5,0 · 74 отзыва.',
    url: 'https://barber-ot-boga.ru/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Барбер от Бога — барбершоп на Тарусской, Ясенево',
    description:
      'Один мастер, одно кресло, прайс без звёздочек. 5,0 на Яндекс.Картах, 74 отзыва.',
  },
  other: {
    'geo.region': 'RU-MOW',
    'geo.placename': 'Москва, Ясенево',
    'geo.position': '55.606;37.532',
    ICBM: '55.606, 37.532',
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%2307080a'/%3E%3Cpath d='M8 4h16v24H8z' fill='%23f4efe6'/%3E%3Cpath d='M8 4l16 8v6L8 10zM8 16l16 8v4L8 20z' fill='%23c9a227'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: '#07080a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/* Микроразметка: значения — из карточки Яндекс.Карт (проверено 09.2026). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
