/**
 * Post-build SEO step.
 *
 * Copies the Vite bundle into `dist/` route folders and writes a real HTML head
 * for every page (home, shop, each product, about, saved, track order) plus
 * sitemap.xml and robots.txt. Crawlers and AI assistants that do not run
 * JavaScript still get a title, description, canonical URL and product schema.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  SITE_URL,
  homeMeta,
  productMeta,
  renderMetaTags,
  shopMeta,
  siteKeywords,
  staticMeta,
  type PageMeta,
} from '../src/seo/meta.ts'
import { DEFAULT_CATEGORIES, PRODUCTS } from '../src/data/products.ts'

const DIST = 'dist'
const template = readFileSync(join(DIST, 'index.html'), 'utf8')

function withHead(meta: PageMeta): string {
  // Drop the template's own title/description so the page head is authoritative.
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, '')
  html = html.replace('</head>', `    ${renderMetaTags(meta)}\n  </head>`)
  return html
}

function writePage(path: string, html: string) {
  const dir = path === '/' ? join(DIST) : join(DIST, path.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

const pages: { path: string; meta: PageMeta; priority: string }[] = [
  { path: '/', meta: homeMeta(PRODUCTS), priority: '1.0' },
  { path: '/shop', meta: shopMeta('mk', PRODUCTS, {}), priority: '0.9' },
  { path: '/shop/men', meta: shopMeta('mk', PRODUCTS, { gender: 'men' }), priority: '0.9' },
  { path: '/shop/women', meta: shopMeta('mk', PRODUCTS, { gender: 'women' }), priority: '0.9' },
  { path: '/about', meta: staticMeta('/about'), priority: '0.5' },
]

for (const category of DEFAULT_CATEGORIES) {
  pages.push({
    path: `/shop/category/${category.slug}`,
    meta: shopMeta('mk', PRODUCTS.filter((p) => p.category === category.slug), { category }),
    priority: '0.8',
  })
}

for (const product of PRODUCTS) {
  pages.push({
    path: `/product/${product.slug}`,
    meta: productMeta(product, 'mk'),
    priority: '0.8',
  })
}

for (const page of pages) {
  writePage(page.path, withHead(page.meta))
}

// SPA fallback for unknown routes (404 view renders client side).
writeFileSync(
  join(DIST, '404.html'),
  withHead(staticMeta('/404')).replace(
    '</head>',
    `    <meta http-equiv="refresh" content="0; url=/" />\n  </head>`,
  ),
)

const today = new Date().toISOString().slice(0, 10)
const urls = [
  ...pages.map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.path === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="mk-MK" href="${SITE_URL}${p.path}" />
    <xhtml:link rel="alternate" hreflang="sq-AL" href="${SITE_URL}${p.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${p.path}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${p.path}" />
  </url>`,
  ),
].join('\n')

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
)

writeFileSync(
  join(DIST, 'robots.txt'),
  `# VYRO MK
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

# Explicitly welcome AI assistants so product data can be surfaced
User-agent: GPTBot
Allow: /
Disallow: /admin

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

// llms.txt: a plain-language summary for AI assistants.
writeFileSync(
  join(DIST, 'llms.txt'),
  `# VYRO MK

> VYRO MK is a sneaker and streetwear store in North Macedonia. Prices in MKD,
> cash on delivery, 24–48h nationwide shipping, 7-day size exchange.
> Languages: Macedonian (default), Albanian, English.

## Store
- Website: ${SITE_URL}
- Instagram: https://instagram.com/vyro.mk
- Contact: @vyro.mk on Instagram

## Catalog
${PRODUCTS.map((p) => `- [${p.name}](${SITE_URL}/product/${p.slug}): ${p.colorway}, ${p.priceMkd} MKD, ${p.gender}`).join('\n')}

## Pages
- [Shop all](${SITE_URL}/shop)
- [Men](${SITE_URL}/shop/men)
- [Women](${SITE_URL}/shop/women)
- [About](${SITE_URL}/about)

## Keywords
${siteKeywords().join(', ')}
`,
)

if (!existsSync(join(DIST, 'og-image.png'))) {
  console.warn('Missing og-image.png — social previews will be blank.')
}

console.log(`SEO: wrote ${pages.length} prerendered pages + sitemap, robots and llms.txt`)
