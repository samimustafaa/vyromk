import type { CategoryDef, Product } from '../data/products'
import { formatMkd, GENDER_LABELS } from '../data/products'
import type { Lang } from '../i18n'

export const SITE_URL = 'https://vyromk.mk'
export const SITE_NAME = 'VYRO MK'
export const BRAND_TAGLINE = 'Your Style. Your Move.'

const LOCALES: Record<Lang, string> = { mk: 'mk_MK', sq: 'sq_AL', en: 'en_US' }

export interface PageMeta {
  /** Route path, used for the canonical URL. */
  path: string
  title: string
  description: string
  image?: string
  /** Extra keywords specific to the page. */
  keywords?: string[]
  type?: 'website' | 'product' | 'article'
  /** JSON-LD blocks injected into the page head. */
  jsonLd?: Record<string, unknown>[]
  noindex?: boolean
}

const CORE_KEYWORDS = [
  'VYRO MK',
  'патики Скопје',
  'патики Македонија',
  'улична облека Македонија',
  'patika Shkup',
  'patika Maqedoni',
  'veshje rruge Maqedoni',
  'sneakers North Macedonia',
  'streetwear Skopje',
  'buy sneakers Macedonia',
  'cash on delivery Macedonia',
  'дуксер Скопје',
  'маица Скопје',
  'оригинални патики',
]

export function siteKeywords(extra: string[] = []): string[] {
  return Array.from(new Set([...CORE_KEYWORDS, ...extra]))
}

function orgJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${SITE_URL}/#store`,
    name: SITE_NAME,
    url: SITE_URL,
    slogan: BRAND_TAGLINE,
    image: `${SITE_URL}/og-image.png`,
    logo: `${SITE_URL}/favicon.svg`,
    priceRange: '890–3990 MKD',
    currenciesAccepted: 'MKD',
    paymentAccepted: 'Cash on delivery',
    areaServed: { '@type': 'Country', name: 'North Macedonia' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Skopje',
      addressCountry: 'MK',
    },
    sameAs: ['https://instagram.com/vyro.mk'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: ['mk-MK', 'sq-AL', 'en'],
    publisher: { '@id': `${SITE_URL}/#store` },
  }
}

export function productJsonLd(product: Product, lang: Lang): Record<string, unknown> {
  const description = product.description[lang] ?? product.description.en
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/product/${product.slug}#product`,
    name: product.name,
    image: [`${SITE_URL}${product.image}`],
    description,
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE_NAME },
    color: product.colorway,
    category: product.category,
    audience:
      product.gender === 'unisex'
        ? { '@type': 'PeopleAudience', suggestedGender: 'unisex' }
        : {
            '@type': 'PeopleAudience',
            suggestedGender: product.gender === 'men' ? 'male' : 'female',
          },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: 'MKD',
      price: product.priceMkd,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#store` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'MK' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        },
      },
    },
  }
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

function collectionPageJsonLd(
  name: string,
  path: string,
  products: Product[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/product/${p.slug}`,
        name: p.name,
      })),
    },
  }
}

export function homeMeta(products: Product[]): PageMeta {
  return {
    path: '/',
    title: 'VYRO MK — Патики и улична облека во Македонија | Твој стил, твој потег',
    description:
      'VYRO MK: патики, дуксери, маици и додатоци по достапни цени. Достава 24–48ч низ цела Македонија, плаќање при достава и 7 дена замена. Patika dhe veshje rruge në Shkup.',
    keywords: siteKeywords(['VYRO', 'патики онлајн', 'онлајн продавница Македонија']),
    image: '/og-image.png',
    jsonLd: [orgJsonLd(), websiteJsonLd(), collectionPageJsonLd('VYRO MK', '/', products)],
  }
}

export function shopMeta(
  _lang: Lang,
  products: Product[],
  opts: { gender?: 'men' | 'women'; category?: CategoryDef | null; query?: string },
): PageMeta {
  const { gender, category, query } = opts
  let path = '/shop'
  let title = 'Сите производи — патики и улична облека | VYRO MK'
  let heading = 'Сите производи'
  const keywords = siteKeywords()

  if (gender === 'men') {
    path = '/shop?gender=men'
    title = 'Машки патики и облека — Men | VYRO MK'
    heading = 'Мажи'
    keywords.push('машки патики', 'машка облека', 'patika për meshkuj')
  } else if (gender === 'women') {
    path = '/shop?gender=women'
    title = 'Женски патики и облека — Women | VYRO MK'
    heading = 'Жени'
    keywords.push('женски патики', 'женска облека', 'patika për femra')
  }
  if (category) {
    path = `/shop?category=${category.slug}`
    title = `${category.labelMk} — ${category.labelEn} | VYRO MK`
    heading = category.labelMk
    keywords.push(category.labelMk, category.labelEn)
  }

  const description = `${heading} во VYRO MK: ${products.length} модели со цени од ${formatMkd(
    Math.min(...products.map((p) => p.priceMkd)),
  )}. Бесплатна достава над 3,500 MKD, плаќање при достава низ Македонија.`

  return {
    path,
    title,
    description,
    keywords,
    image: products[0]?.image ?? '/og-image.png',
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'VYRO MK', path: '/' },
        { name: heading, path },
      ]),
      collectionPageJsonLd(`${heading} | VYRO MK`, path, products),
      ...(query
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'SearchResultsPage',
              name: `Search: ${query}`,
            },
          ]
        : []),
    ],
  }
}

export function productMeta(product: Product, lang: Lang): PageMeta {
  const description = product.description[lang] ?? product.description.en
  const audience =
    product.gender === 'unisex'
      ? 'мажи и жени'
      : GENDER_LABELS[product.gender].mk.toLowerCase()
  return {
    path: `/product/${product.slug}`,
    title: `${product.name} — ${product.colorway} | ${formatMkd(product.priceMkd)} | VYRO MK`,
    description: `${product.name} (${product.colorway}) за ${audience}. ${description} Достава 24–48ч низ Македонија, плаќање при достава.`,
    keywords: siteKeywords([
      product.name,
      product.colorway,
      product.category,
      'патики Скопје',
      `${product.name} цена`,
    ]),
    image: product.image,
    type: 'product',
    jsonLd: [
      productJsonLd(product, lang),
      breadcrumbJsonLd([
        { name: 'VYRO MK', path: '/' },
        { name: product.category, path: `/shop?category=${product.category}` },
        { name: product.name, path: `/product/${product.slug}` },
      ]),
    ],
  }
}

export function staticMeta(route: string): PageMeta {
  switch (route) {
    case '/about':
      return {
        path: '/about',
        title: 'За нас — VYRO MK, улична облека од Скопје',
        description:
          'VYRO MK е бренд за патики и улична облека од Скопје. Дознај како работиме, како доставуваме низ Македонија и зошто илјадници купуваат од нас.',
        keywords: siteKeywords(['за нас', 'VYRO MK бренд', 'Скопје streetwear']),
        jsonLd: [
          breadcrumbJsonLd([
            { name: 'VYRO MK', path: '/' },
            { name: 'За нас', path: '/about' },
          ]),
        ],
      }
    case '/saved':
      return {
        path: '/saved',
        title: 'Омилени производи | VYRO MK',
        description: 'Твоите зачувани патики и парчиња облека од VYRO MK.',
        keywords: siteKeywords(['омилени', 'wishlist']),
        noindex: true,
      }
    case '/track-order':
      return {
        path: '/track-order',
        title: 'Следи нарачка | VYRO MK',
        description: 'Провери го статусот на твојата VYRO MK нарачка со бројот што го доби при нарачка.',
        keywords: siteKeywords(['следење нарачка', 'статус на достава']),
        noindex: true,
      }
    default:
      return {
        path: route,
        title: 'Страницата не е пронајдена | VYRO MK',
        description: 'Оваа страница не постои. Продолжи кон продавницата VYRO MK.',
        noindex: true,
      }
  }
}

/* ---------- HTML head rendering (used by the prerenderer) ---------- */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderMetaTags(meta: PageMeta, lang: Lang = 'mk'): string {
  const url = `${SITE_URL}${meta.path}`
  const image = meta.image?.startsWith('http') ? meta.image : `${SITE_URL}${meta.image ?? '/og-image.png'}`
  const alt =
    meta.type === 'product'
      ? meta.title.split(' — ')[0]
      : 'VYRO MK — патики и улична облека'

  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="keywords" content="${escapeHtml(siteKeywords(meta.keywords ?? []).join(', '))}" />`,
    `<link rel="canonical" href="${url}" />`,
    meta.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(alt)}" />`,
    `<meta property="og:locale" content="${LOCALES[lang]}" />`,
    `<meta property="og:locale:alternate" content="${lang === 'mk' ? 'sq_AL' : 'mk_MK'}" />`,
    `<meta property="og:locale:alternate" content="${lang === 'en' ? 'mk_MK' : 'en_US'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="theme-color" content="#101010" />`,
    `<link rel="alternate" hreflang="mk-MK" href="${url}" />`,
    `<link rel="alternate" hreflang="sq-AL" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    ...(meta.jsonLd ?? []).map(
      (block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`,
    ),
  ]
  return tags.join('\n    ')
}
