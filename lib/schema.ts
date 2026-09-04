import { contacts, faq, price } from './content';

/**
 * Микроразметка @graph. Все значения — из карточки на Яндекс.Картах
 * (проверено 09.2026). Ничего неподтверждённого в разметке нет.
 */
export const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['HairSalon', 'LocalBusiness'],
      '@id': 'https://barber-ot-boga.ru/#business',
      name: 'Барбер от Бога',
      alternateName: 'Barber from God',
      description:
        'Мужской барбершоп в Ясенево: классические и модельные стрижки, работа с бородой, детские стрижки. Один мастер, приём по предварительной записи. Рейтинг 5,0 на Яндекс.Картах.',
      url: 'https://barber-ot-boga.ru/',
      telephone: '+7-926-584-54-00',
      priceRange: '1000–2000 ₽',
      currenciesAccepted: 'RUB',
      paymentAccepted: 'Наличные, банковская карта',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Тарусская, 14к1',
        addressLocality: 'Москва',
        addressRegion: 'Москва',
        addressCountry: 'RU',
      },
      areaServed: { '@type': 'Place', name: 'Ясенево, Москва' },
      publicAccess: true,
      isAccessibleForFree: false,
      hasMap: contacts.yandexMaps,
      sameAs: [contacts.yandexMaps, 'https://barberfromgod.tilda.ws/'],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '10:00',
          closes: '22:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        bestRating: '5',
        ratingCount: '86',
        reviewCount: '74',
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Парковка', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Оплата картой', value: true },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Доступно для колясок (пандус)',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Можно с животными',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Предварительная запись',
          value: true,
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Услуги барбершопа',
        itemListElement: price.items.map((item) => ({
          '@type': 'Offer',
          priceCurrency: 'RUB',
          price: item.price.replace(/[^\d]/g, ''),
          itemOffered: { '@type': 'Service', name: item.title },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://barber-ot-boga.ru/#website',
      url: 'https://barber-ot-boga.ru/',
      name: 'Барбер от Бога',
      inLanguage: 'ru-RU',
      publisher: { '@id': 'https://barber-ot-boga.ru/#business' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://barber-ot-boga.ru/#faq',
      mainEntity: faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.plain },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: 'https://barber-ot-boga.ru/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Прайс',
          item: 'https://barber-ot-boga.ru/#price',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Контакты',
          item: 'https://barber-ot-boga.ru/#location',
        },
      ],
    },
  ],
};
