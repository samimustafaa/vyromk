export type Category = string

export type Gender = 'men' | 'women' | 'unisex'

export interface CategoryDef {
  slug: string
  labelEn: string
  labelMk: string
  image: string
}

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { slug: 'sneakers', labelEn: 'Sneakers', labelMk: 'Патики', image: '/products/shoe4.avif' },
  { slug: 'apparel', labelEn: 'Apparel', labelMk: 'Облека', image: '/products/look.avif' },
  { slug: 'accessories', labelEn: 'Accessories', labelMk: 'Додатоци', image: '/products/bag.avif' },
]

export const GENDER_LABELS: Record<Gender, { en: string; mk: string }> = {
  men: { en: 'Men', mk: 'Мажи' },
  women: { en: 'Women', mk: 'Жени' },
  unisex: { en: 'Unisex', mk: 'Унисекс' },
}

export function matchesGender(product: Product, gender: Gender | 'all'): boolean {
  if (gender === 'all') return true
  if (product.gender === 'unisex') return true
  return product.gender === gender
}

export function categoryLabel(categories: CategoryDef[], slug: string, lang: 'en' | 'mk'): string {
  const found = categories.find((c) => c.slug === slug)
  if (found) return lang === 'mk' ? found.labelMk : found.labelEn
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

export interface Product {
  id: string
  slug: string
  name: string
  category: Category
  gender: Gender
  priceMkd: number
  compareAtMkd?: number
  colorway: string
  image: string
  badge?: 'New Drop' | 'Best Seller' | 'Limited'
  sizes: string[]
  description: {
    en: string
    mk: string
  }
  details: {
    en: string[]
    mk: string[]
  }
  featured?: boolean
}

export const FREE_SHIPPING_MKD = 3500
export const SHIPPING_FEE_MKD = 150

export const PRODUCTS: Product[] = [
  {
    id: 'vyro-pulse-90',
    slug: 'vyro-pulse-90',
    name: 'VYRO Pulse 90',
    category: 'sneakers',
    gender: 'unisex',
    priceMkd: 3690,
    compareAtMkd: 4290,
    colorway: 'Solar Orange / Volt / White',
    image: '/products/hero.avif',
    badge: 'New Drop',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    featured: true,
    description: {
      en: 'Sculpted street runner built for all-day comfort with responsive heel cushioning and breathable mesh panels.',
      mk: 'Модерни улични патики за целодневна удобност со мек ѓон и прозрачен горен дел.',
    },
    details: {
      en: ['Breathable mesh & suede overlays', 'Cushioned EVA midsole', 'High-grip rubber outsole', 'True to EU sizing'],
      mk: ['Прозрачна мрежа и велур детали', 'Удобен EVA среден ѓон', 'Гумен ѓон против лизгање', 'Стандардни ЕУ броеви'],
    },
  },
  {
    id: 'vyro-court-high',
    slug: 'vyro-court-high',
    name: 'VYRO Court High',
    category: 'sneakers',
    gender: 'unisex',
    priceMkd: 3990,
    colorway: 'Obsidian / Crimson / White',
    image: '/products/shoe4.avif',
    badge: 'Best Seller',
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    featured: true,
    description: {
      en: 'Classic high-top silhouette with padded ankle support and crisp color-blocking that anchors any fit.',
      mk: 'Класична висока силуета со зајакнат зглоб и чист контраст што одговара на секој аутфит.',
    },
    details: {
      en: ['Smooth synthetic leather upper', 'Padded collar for ankle lockdown', 'Perforated toe box', 'Stitched cupsole'],
      mk: ['Квалитетна еко-кожа', 'Мека подлога околу зглобот', 'Перфорации за вентилација', 'Зашиен ѓон за издржливост'],
    },
  },
  {
    id: 'vyro-air-mono',
    slug: 'vyro-air-mono',
    name: 'VYRO Air Mono',
    category: 'sneakers',
    gender: 'unisex',
    priceMkd: 3290,
    colorway: 'Triple White',
    image: '/products/shoe7.avif',
    badge: 'Best Seller',
    sizes: ['37', '38', '39', '40', '41', '42', '43', '44'],
    featured: true,
    description: {
      en: 'The everyday essential. Clean triple-white low-top that pairs effortlessly with cargos, denim, or shorts.',
      mk: 'Секојдневна класика. Чисти бели патики што лесно се комбинираат со карго, фармерки или шорцеви.',
    },
    details: {
      en: ['Wipe-clean matte upper', 'Lightweight cushioned sole', 'Tonal laces & branding', 'Unisex fit'],
      mk: ['Лесно одржување', 'Лесен и удобен ѓон', 'Минималистички дизајн', 'Унисекс модел'],
    },
  },
  {
    id: 'vyro-stealth-run',
    slug: 'vyro-stealth-run',
    name: 'VYRO Stealth Runner',
    category: 'sneakers',
    gender: 'men',
    priceMkd: 3490,
    colorway: 'Carbon Black',
    image: '/products/shoe9.avif',
    badge: 'Limited',
    sizes: ['40', '41', '42', '43', '44', '45'],
    featured: true,
    description: {
      en: 'Featherweight knit runner engineered in matte carbon black for fast city movement.',
      mk: 'Ултра лесни црни патики со флексибилен ѓон создадени за динамично движење низ град.',
    },
    details: {
      en: ['Sock-like engineered knit', 'Responsive foam cushioning', 'Slip-on pull tab', 'Ultra-lightweight build'],
      mk: ['Еластичен плетен материјал', 'Респонзивна пена во ѓонот', 'Брзо обување', 'Минимална тежина'],
    },
  },
  {
    id: 'vyro-crimson-knit',
    slug: 'vyro-crimson-knit',
    name: 'VYRO Velocity Knit',
    category: 'sneakers',
    gender: 'women',
    priceMkd: 2990,
    compareAtMkd: 3590,
    colorway: 'Crimson / Pure White',
    image: '/products/shoe1.avif',
    sizes: ['39', '40', '41', '42', '43', '44'],
    description: {
      en: 'Bold crimson knit upper over a sculpted white sole—built to stand out without trying too hard.',
      mk: 'Впечатлив црвен плетен дизајн на бел ѓон — создаден да привлече внимание.',
    },
    details: {
      en: ['Flexible fly-knit upper', 'Dual-density foam sole', 'Breathable lining', 'Lightweight everyday wear'],
      mk: ['Флексибилен плетен горен дел', 'Мек двослоен ѓон', 'Прозрачна внатрешност', 'Идеални за секој ден'],
    },
  },
  {
    id: 'vyro-sunset-low',
    slug: 'vyro-sunset-low',
    name: 'VYRO Sunset Low',
    category: 'sneakers',
    gender: 'women',
    priceMkd: 3390,
    colorway: 'Chalk / Tangerine',
    image: '/products/shoe2.avif',
    badge: 'New Drop',
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    description: {
      en: 'Crisp chalk white runner accented with vibrant tangerine hits for warm-weather rotation.',
      mk: 'Чиста бела основа со портокалови детали за свеж дневен стил.',
    },
    details: {
      en: ['Suede & textile upper', 'Visible heel cushion', 'Soft padded tongue', 'True to size'],
      mk: ['Велур и текстил', 'Воздушна перничка на петата', 'Мек јазик', 'Стандарден број'],
    },
  },
  {
    id: 'vyro-sand-force',
    slug: 'vyro-sand-force',
    name: 'VYRO Sand Force',
    category: 'sneakers',
    gender: 'men',
    priceMkd: 3590,
    colorway: 'Wheat / Obsidian',
    image: '/products/shoe5.avif',
    sizes: ['40', '41', '42', '43', '44', '45'],
    description: {
      en: 'Rugged wheat-toned low-top with black collar contrast—made for autumn streets and heavy rotation.',
      mk: 'Издржлив модел во топла окер нијанса со црн контраст за есенски и зимски комбинации.',
    },
    details: {
      en: ['Textured canvas & nubuck feel', 'Contrast black heel tab', 'Thick durable sole', 'Reinforced stitching'],
      mk: ['Текстуриран нубук и платно', 'Црн контраст на петата', 'Цврст ѓон', 'Зајакнати шевови'],
    },
  },
  {
    id: 'vyro-studio-white',
    slug: 'vyro-studio-white',
    name: 'VYRO Studio Clean',
    category: 'sneakers',
    gender: 'women',
    priceMkd: 2790,
    colorway: 'Pure White / Slate',
    image: '/products/shoe8.avif',
    sizes: ['37', '38', '39', '40', '41', '42', '43', '44'],
    description: {
      en: 'Minimalist court sneaker with micro-perforated sides and a low-profile sole.',
      mk: 'Минималистички патики со чиста линија и низок профил за секојдневни комбинации.',
    },
    details: {
      en: ['Minimalist perforated side detail', 'Cushioned insole', 'Clean low-profile sole', 'Easy to pair'],
      mk: ['Суптилни перфорации', 'Удобна влошка', 'Низок профил', 'Лесни за комбинирање'],
    },
  },
  {
    id: 'vyro-heavy-hoodie',
    slug: 'vyro-heavy-hoodie',
    name: 'VYRO Heavyweight Hoodie',
    category: 'apparel',
    gender: 'unisex',
    priceMkd: 2490,
    compareAtMkd: 2890,
    colorway: 'Washed Charcoal',
    image: '/products/hoodie.avif',
    badge: 'Best Seller',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    description: {
      en: '440gsm boxy-fit fleece hoodie with dropped shoulders and structured double-lined hood.',
      mk: 'Дебел дуксер од 440г памук со широк крој, спуштени раменици и двојна качулка.',
    },
    details: {
      en: ['440gsm brushed cotton fleece', 'Relaxed boxy silhouette', 'Ribbed cuffs & hem', 'Pre-shrunk fabric'],
      mk: ['440г квалитетен памук', 'Модерен широк крој', 'Цврсти манжетни', 'Не се собира при перење'],
    },
  },
  {
    id: 'vyro-core-tee',
    slug: 'vyro-core-tee',
    name: 'VYRO Core Oversized Tee',
    category: 'apparel',
    gender: 'unisex',
    priceMkd: 1190,
    colorway: 'Optic White',
    image: '/products/tee.avif',
    badge: 'New Drop',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    description: {
      en: 'Heavy 240gsm cotton tee with a thick ribbed collar that holds its shape wash after wash.',
      mk: 'Дебела памучна маица (240г) со цврста јака што ја задржува формата.',
    },
    details: {
      en: ['100% combed cotton (240gsm)', 'Thick mock-rib neckline', 'Relaxed drop-shoulder cut', 'Unisex sizing'],
      mk: ['100% памук (240г)', 'Цврста ребреста јака', 'Опуштен крој', 'Унисекс големини'],
    },
  },
  {
    id: 'vyro-moto-jacket',
    slug: 'vyro-moto-jacket',
    name: 'VYRO Night Rider Jacket',
    category: 'apparel',
    gender: 'men',
    priceMkd: 3890,
    colorway: 'Matte Black',
    image: '/products/jacket.avif',
    badge: 'Limited',
    sizes: ['S', 'M', 'L', 'XL'],
    description: {
      en: 'Structured matte-black outer layer with clean zip hardware for sharp night-out styling.',
      mk: 'Структурирана црна јакна со метални патенти за остар вечерен и уличен стил.',
    },
    details: {
      en: ['Matte faux-leather finish', 'Smooth satin interior lining', 'Zip chest & side pockets', 'Tailored street cut'],
      mk: ['Мат еко-кожа', 'Мазна внатрешна постава', 'Џебови со патент', 'Модерен уличен крој'],
    },
  },
  {
    id: 'vyro-raw-denim',
    slug: 'vyro-raw-denim',
    name: 'VYRO Straight Denim',
    category: 'apparel',
    gender: 'men',
    priceMkd: 2290,
    colorway: 'Vintage Indigo',
    image: '/products/jeans.avif',
    sizes: ['30', '32', '34', '36'],
    description: {
      en: 'Relaxed straight-leg denim designed to stack cleanly over sneakers.',
      mk: 'Рамни фармерки со опуштен крој што совршено паѓаат врз патики.',
    },
    details: {
      en: ['13oz rigid cotton denim', 'Relaxed straight leg', '5-pocket construction', 'Reinforced seams'],
      mk: ['Квалитетен тексас', 'Рамен широк крој', '5 класични џебови', 'Зајакнати рабови'],
    },
  },
  {
    id: 'vyro-street-cap',
    slug: 'vyro-street-cap',
    name: 'VYRO 6-Panel Cap',
    category: 'accessories',
    gender: 'unisex',
    priceMkd: 890,
    colorway: 'Jet Black',
    image: '/products/cap.avif',
    sizes: ['One Size'],
    description: {
      en: 'Low-crown cotton twill cap with an adjustable metal strap to finish any daily fit.',
      mk: 'Класично памучно капче со прилагодливо ремче за завршен печат на секој аутфит.',
    },
    details: {
      en: ['100% washed cotton twill', 'Curved visor', 'Adjustable metal buckle', 'Breathable eyelets'],
      mk: ['100% памук', 'Закривен визир', 'Метална тока за подесување', 'Отвори за вентилација'],
    },
  },
  {
    id: 'vyro-daypack',
    slug: 'vyro-daypack',
    name: 'VYRO Utility Pack',
    category: 'accessories',
    gender: 'unisex',
    priceMkd: 1890,
    colorway: 'Stealth Black',
    image: '/products/bag.avif',
    badge: 'New Drop',
    sizes: ['One Size'],
    description: {
      en: 'Water-resistant daily backpack with padded laptop sleeve and clean matte hardware.',
      mk: 'Водоотпорен секојдневен ранец со преграда за лаптоп и модерен црн дизајн.',
    },
    details: {
      en: ['Water-resistant nylon shell', 'Fits up to 16" laptop', 'Padded shoulder straps', 'Quick-access front pocket'],
      mk: ['Водоотпорен материјал', 'Преграда за лаптоп до 16"', 'Меки прерамки', 'Преден џеб за брз пристап'],
    },
  },
]

export function formatMkd(amount: number): string {
  return `${amount.toLocaleString('en-US')} MKD`
}
