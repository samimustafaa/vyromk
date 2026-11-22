import type { Lang } from '../i18n'

export type Category = string

export type Gender = 'men' | 'women' | 'unisex'

export interface CategoryDef {
  slug: string
  labelEn: string
  labelMk: string
  labelSq?: string
  image: string
}

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { slug: 'sneakers', labelEn: 'Sneakers', labelMk: 'Патики', labelSq: 'Patika', image: '/products/shoe4.avif' },
  { slug: 'apparel', labelEn: 'Apparel', labelMk: 'Облека', labelSq: 'Veshje', image: '/products/look.avif' },
  { slug: 'accessories', labelEn: 'Accessories', labelMk: 'Додатоци', labelSq: 'Aksesorë', image: '/products/bag.avif' },
]

export const GENDER_LABELS: Record<Gender, { en: string; mk: string; sq: string }> = {
  men: { en: 'Men', mk: 'Мажи', sq: 'Meshkuj' },
  women: { en: 'Women', mk: 'Жени', sq: 'Femra' },
  unisex: { en: 'Unisex', mk: 'Унисекс', sq: 'Unisex' },
}

export function matchesGender(product: Product, gender: Gender | 'all'): boolean {
  if (gender === 'all') return true
  if (product.gender === 'unisex') return true
  return product.gender === gender
}

export function categoryLabel(categories: CategoryDef[], slug: string, lang: Lang): string {
  const found = categories.find((c) => c.slug === slug)
  if (found) {
    if (lang === 'mk') return found.labelMk
    if (lang === 'sq') return found.labelSq ?? found.labelEn
    return found.labelEn
  }
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
    sq?: string
  }
  details: {
    en: string[]
    mk: string[]
    sq?: string[]
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
      sq: `Patika rruge të skalitura për rehati gjatë gjithë ditës, me amortizim në thembër dhe panele rrjetë të ajrosura.`,
    },
    details: {
      en: ['Breathable mesh & suede overlays', 'Cushioned EVA midsole', 'High-grip rubber outsole', 'True to EU sizing'],
      mk: ['Прозрачна мрежа и велур детали', 'Удобен EVA среден ѓон', 'Гумен ѓон против лизгање', 'Стандардни ЕУ броеви'],
      sq: ['Rrjetë e ajrosur dhe detaje suede', 'Thembra EVA me amortizim', 'Tabani gome me kapje të lartë', 'Madhësi standarde EU'],
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
      sq: `Siluetë klasike e lartë me mbështetje të mbushur për kyçin dhe blloqe ngjyrash që ngre çdo kombinim.`,
    },
    details: {
      en: ['Smooth synthetic leather upper', 'Padded collar for ankle lockdown', 'Perforated toe box', 'Stitched cupsole'],
      mk: ['Квалитетна еко-кожа', 'Мека подлога околу зглобот', 'Перфорации за вентилација', 'Зашиен ѓон за издржливост'],
      sq: ['Sipërfaqe lëkure sintetike e lëmuar', 'Jakë e mbushur për kyçin', 'Kuti gishtash me perforacione', 'Tabani i qepur'],
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
      sq: `Thelbësorja e përditshme. E bardhë e pastër, e ulët, që kombinohet lehtë me cargo, xhinse ose pantallona të shkurtra.`,
    },
    details: {
      en: ['Wipe-clean matte upper', 'Lightweight cushioned sole', 'Tonal laces & branding', 'Unisex fit'],
      mk: ['Лесно одржување', 'Лесен и удобен ѓон', 'Минималистички дизајн', 'Унисекс модел'],
      sq: ['Sipërfaqe mat që fshihet lehtë', 'Tabani i lehtë me amortizim', 'Lidhëse dhe brendim tonal', 'Prerje unisex'],
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
      sq: `Patika të lehta si pupla, të krijuara në të zezë mat për lëvizje të shpejtë në qytet.`,
    },
    details: {
      en: ['Sock-like engineered knit', 'Responsive foam cushioning', 'Slip-on pull tab', 'Ultra-lightweight build'],
      mk: ['Еластичен плетен материјал', 'Респонзивна пена во ѓонот', 'Брзо обување', 'Минимална тежина'],
      sq: ['Sipërfaqe e thurur elastike', 'Amortizim me shkumë reaguese', 'Lidhëse për t\'i veshur shpejt', 'Ndërtim shumë i lehtë'],
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
      sq: `Sipërfaqe e thurur e kuqe e guximshme mbi taban të bardhë të skalitur — për t'u dalluar pa u munduar.`,
    },
    details: {
      en: ['Flexible fly-knit upper', 'Dual-density foam sole', 'Breathable lining', 'Lightweight everyday wear'],
      mk: ['Флексибилен плетен горен дел', 'Мек двослоен ѓон', 'Прозрачна внатрешност', 'Идеални за секој ден'],
      sq: ['Sipërfaqe fly-knit elastike', 'Taban shkumë me dy densitet', 'Rreshtim i ajrosur', 'E lehtë për çdo ditë'],
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
      sq: `Patikë e bardhë e pastër me detaje portokalli të gjalla për ditët e ngrohta.`,
    },
    details: {
      en: ['Suede & textile upper', 'Visible heel cushion', 'Soft padded tongue', 'True to size'],
      mk: ['Велур и текстил', 'Воздушна перничка на петата', 'Мек јазик', 'Стандарден број'],
      sq: ['Sipërfaqe suede dhe tekstil', 'Amortizim i dukshëm në thembër', 'Gjuhë e butë e mbushur', 'Madhësi standarde'],
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
      sq: `Model i qëndrueshëm në ngjyrë gruri me kontrast të zi në jakë — për rrugët e vjeshtës.`,
    },
    details: {
      en: ['Textured canvas & nubuck feel', 'Contrast black heel tab', 'Thick durable sole', 'Reinforced stitching'],
      mk: ['Текстуриран нубук и платно', 'Црн контраст на петата', 'Цврст ѓон', 'Зајакнати шевови'],
      sq: ['Kanavacë e teksturuar dhe ndjesi nubuk', 'Tabelë e zezë në thembër', 'Taban i trashë dhe i qëndrueshëm', 'Qepje të përforcuara'],
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
      sq: `Patikë minimaliste me anë të perforuara dhe taban të ulët.`,
    },
    details: {
      en: ['Minimalist perforated side detail', 'Cushioned insole', 'Clean low-profile sole', 'Easy to pair'],
      mk: ['Суптилни перфорации', 'Удобна влошка', 'Низок профил', 'Лесни за комбинирање'],
      sq: ['Detaje minimaliste me perforacione', 'Tabani i brendshëm me amortizim', 'Taban i ulët dhe i pastër', 'Kombinohet lehtë'],
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
      sq: `Bluzë e trashë 440gsm me prerje të gjerë, shpatulla të ulura dhe kapuç të dyfishtë.`,
    },
    details: {
      en: ['440gsm brushed cotton fleece', 'Relaxed boxy silhouette', 'Ribbed cuffs & hem', 'Pre-shrunk fabric'],
      mk: ['440г квалитетен памук', 'Модерен широк крој', 'Цврсти манжетни', 'Не се собира при перење'],
      sq: ['Pambuk i krehur 440gsm', 'Siluetë e gjerë dhe e relaksuar', 'Pranga dhe fund elastik', 'Pëlhurë e para-tkurrur'],
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
      sq: `Bluzë pambuku e trashë 240gsm me jakë të fortë që mban formën larje pas larjeje.`,
    },
    details: {
      en: ['100% combed cotton (240gsm)', 'Thick mock-rib neckline', 'Relaxed drop-shoulder cut', 'Unisex sizing'],
      mk: ['100% памук (240г)', 'Цврста ребреста јака', 'Опуштен крој', 'Унисекс големини'],
      sq: ['100% pambuk i krehur (240gsm)', 'Jakë e trashë me shirita', 'Prerje e relaksuar me shpatulla të ulura', 'Madhësi unisex'],
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
      sq: `Shtresë e jashtme mat e zezë me zinxhirë të pastër për stil të mprehtë nate.`,
    },
    details: {
      en: ['Matte faux-leather finish', 'Smooth satin interior lining', 'Zip chest & side pockets', 'Tailored street cut'],
      mk: ['Мат еко-кожа', 'Мазна внатрешна постава', 'Џебови со патент', 'Модерен уличен крој'],
      sq: ['Përfundim lëkure vegjetale mat', 'Rreshtim i brendshëm saten', 'Xhepa me zinxhir', 'Prerje e rregulluar rruge'],
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
      sq: `Xhinse me këmbë të drejtë dhe të relaksuara, që bien pastër mbi patika.`,
    },
    details: {
      en: ['13oz rigid cotton denim', 'Relaxed straight leg', '5-pocket construction', 'Reinforced seams'],
      mk: ['Квалитетен тексас', 'Рамен широк крој', '5 класични џебови', 'Зајакнати рабови'],
      sq: ['Denim pambuku i ngurtë 13oz', 'Këmbë e drejtë dhe e relaksuar', '5 xhepa klasikë', 'Qepje të përforcuara'],
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
      sq: `Kapë pambuku me kurorë të ulët dhe rrip metalik të rregullueshëm.`,
    },
    details: {
      en: ['100% washed cotton twill', 'Curved visor', 'Adjustable metal buckle', 'Breathable eyelets'],
      mk: ['100% памук', 'Закривен визир', 'Метална тока за подесување', 'Отвори за вентилација'],
      sq: ['Pambuk i larë 100%', 'Vizierë e lakuar', 'Tokë metalike e rregullueshme', 'Vrima ajrimi'],
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
      sq: `Çantë shpine e përditshme rezistente ndaj ujit me xhep të mbushur për laptop dhe detaje mat.`,
    },
    details: {
      en: ['Water-resistant nylon shell', 'Fits up to 16" laptop', 'Padded shoulder straps', 'Quick-access front pocket'],
      mk: ['Водоотпорен материјал', 'Преграда за лаптоп до 16"', 'Меки прерамки', 'Преден џеб за брз пристап'],
      sq: ['Sipërfaqe najloni rezistente ndaj ujit', 'Mban laptop deri 16"', 'Rripa shpatullash të mbushur', 'Xhep i përparmë me akses të shpejtë'],
    },
  },
]

export function formatMkd(amount: number): string {
  return `${amount.toLocaleString('en-US')} MKD`
}
