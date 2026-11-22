/**
 * Storefront translations. Macedonian is the default language; Albanian is
 * second, English third. `t(lang, mk, en, sq)` returns the string for the
 * active language and falls back to English when an Albanian string is absent.
 */
export type Lang = 'mk' | 'sq' | 'en'

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'mk', label: 'Македонски', short: 'MK' },
  { code: 'sq', label: 'Shqip', short: 'SQ' },
  { code: 'en', label: 'English', short: 'EN' },
]

export const DEFAULT_LANG: Lang = 'mk'

/** Albanian translations, keyed by the English string. */
export const SQ: Record<string, string> = {
  // Navigation & chrome
  Home: 'Kryefaqja',
  Men: 'Meshkuj',
  Women: 'Femra',
  'Shop All': 'Të gjitha',
  'Shop VYRO MK': 'Dyqani VYRO MK',
  About: 'Rreth nesh',
  Bag: 'Çanta',
  'Shopping bag': 'Çanta e blerjeve',
  'Open shopping bag': 'Hap çantën e blerjeve',
  'Saved': 'Të ruajtura',
  'Wishlist': 'Lista e dëshirave',
  'Your wishlist': 'Lista e dëshirave',
  'Your saved pieces': 'Artikujt e ruajtur',
  'Saved pieces': 'Artikuj të ruajtur',
  'Nothing saved yet': 'Asnjë artikull i ruajtur',
  'Tap the heart on any product to save it here.':
    'Trokit zemrën te çdo produkt për ta ruajtur këtu.',
  'Move to bag': 'Kalo në çantë',
  'Saved to wishlist': 'U ruajt në listën e dëshirave',
  'Removed from saved': 'U hoq nga të ruajturat',
  'Save to wishlist': 'Ruaj në listën e dëshirave',
  'Remove from wishlist': 'Hiq nga lista e dëshirave',
  'Save': 'Ruaj',

  // Product labels
  'Sold out': 'E shitur',
  'Size': 'Madhësia',
  'Size Guide': 'Udhëzues madhësish',
  'VYRO MK Size Guide': 'Udhëzues madhësish VYRO MK',
  'Select Size': 'Zgjidh madhësinë',
  'Add to bag': 'Shto në çantë',
  'Add to Bag': 'Shto në çantë',
  'Size sold out': 'Madhësia e shitur',
  'Fully sold out': 'E shitur plotësisht',
  'This size is sold out — pick another': 'Kjo madhësi është e shitur — zgjidh një tjetër',
  'In stock • Ships within 24h': 'Në stok • Dërgohet brenda 24 orësh',
  'New': 'I ri',
  'New Drop': 'Koleksion i ri',
  'Best Seller': 'Më i shituri',
  'Limited': 'I kufizuar',
  'reviews': 'vlerësime',
  'Read reviews': 'Lexo vlerësimet',
  'Customer Reviews': 'Vlerësimet e klientëve',
  'Write a review': 'Shkruaj një vlerësim',
  'Your name': 'Emri yt',
  'Your review': 'Vlerësimi yt',
  'How do they fit and feel?': 'Si ju rrinë dhe si ndjehen?',
  'Submit review': 'Dërgo vlerësimin',
  'No reviews for this piece yet. Be the first.':
    'Nuk ka vlerësime për këtë artikull. Bëhu i pari.',
  'Complete the Look': 'Plotëso pamjen',
  'You May Also Like': 'Mund të pëlqejnë gjithashtu',
  'Recently Viewed': 'Të shikuara së fundmi',
  'Copy for DM': 'Kopjo për DM',
  'Cash on delivery': 'Pagesë në dorëzim',
  '7-day size swap': 'Ndryshim madhësie 7 ditë',
  'Size guide': 'Udhëzues madhësish',
  'Foot (cm)': 'Këmba (cm)',
  'Free delivery over': 'Dërgim falas mbi',

  // Cart
  'Your Bag': 'Çanta jote',
  'Your bag is empty': 'Çanta është bosh',
  'Explore the latest sneakers and streetwear drops.':
    'Zbulo patikat dhe koleksionet më të reja.',
  'Shop the drop': 'Blej koleksionin',
  'Promo code (e.g. VYRO10)': 'Kod promocional (p.sh. VYRO10)',
  'Apply': 'Apliko',
  'Subtotal': 'Nëntotali',
  'Discount': 'Zbritje',
  'Delivery': 'Dërgim',
  'Free': 'Falas',
  'Total': 'Totali',
  'Checkout — Cash on Delivery': 'Përfundo — pagesë në dorëzim',
  'Copy Order for Instagram DM': 'Kopjo porosinë për Instagram DM',
  'You unlocked free delivery!': 'Fitove dërgim falas!',
  'Order copied! Paste in DM to @vyro.mk':
    'Porosia u kopjua! Ngjite në DM te @vyro.mk',

  // Checkout
  'Order Confirmed': 'Porosia u konfirmua',
  'Need a size swap or update? Message us anytime at @vyro.mk.':
    'Nevojë për ndryshim madhësie? Na shkruaj në @vyro.mk.',
  'Back to store': 'Kthehu në dyqan',
  'Full name': 'Emri dhe mbiemri',
  'Phone number': 'Numri i telefonit',
  'City': 'Qyteti',
  'Street address': 'Adresa',
  'Confirm Order': 'Konfirmo porosinë',
  'Fast Checkout': 'Blerje e shpejtë',

  // Home
  'Your Style. Your Move.': 'Stili yt. Lëvizja jote.',
  'COLLECTION': 'KOLEKSIONI',
  'Shop now': 'Blej tani',
  'Featured Drop': 'Koleksioni i zgjedhur',
  'Pick your size and add straight to your bag.':
    'Zgjidh madhësinë dhe shto direkt në çantë.',
  'Built for the street.': 'Ndërtuar për rrugën.',
  'Shop Apparel': 'Blej veshje',
  'Our Story': 'Historia jonë',
  'Shop Men & Women': 'Blej për të dhe për të',
  'Unisex styles show up in both sections.':
    'Modelet unisex shfaqen në të dyja seksionet.',
  'Shop by Category': 'Blej sipas kategorisë',
  'Prefer ordering in DM?': 'Preferon porosi me mesazh?',
  'Pick Your Pair': 'Zgjidh çiftin tënd',
  'View All': 'Shiko të gjitha',
  'Browse the Collection': 'Shfleto koleksionin',
  'Sneakers and streetwear at accessible prices. Clean silhouettes, fast 24–48h delivery across North Macedonia, pay on delivery.':
    'Patika dhe veshje rruge me çmime të arritshme. Linja të pastra, dërgim 24–48 orë në të gjithë Maqedoninë, pagesë në dorëzim.',
  'Sneakers': 'Patika',
  'Apparel': 'Veshje',
  'Accessories': 'Aksesorë',

  // Trust strip
  '24–48h Delivery': 'Dërgim 24–48 orë',
  'Every city in Macedonia': 'Çdo qytet në Maqedoni',
  'Cash on Delivery': 'Pagesë në dorëzim',
  'Zero risk, pay at your door': 'Pa rrezik, paguaj në derë',
  'Easy Size Exchange': 'Ndryshim i lehtë madhësie',
  '7-day hassle-free swap': 'Ndryshim pa stres brenda 7 ditësh',
  'Fair Street Pricing': 'Çmime të drejta',
  'Sharp looks, no markup': 'Pamje e mprehtë, pa shtesa',

  // About
  'About VYRO MK': 'Rreth VYRO MK',
  'VYRO MK is a modern sneaker and streetwear store built for people who want sharp silhouettes and everyday quality without inflated prices.':
    'VYRO MK është një dyqan modern patikash dhe veshjesh rruge, krijuar për njerëz që duan linja të pastra dhe cilësi të përditshme pa çmime të fryra.',
  'Nationwide Delivery': 'Dërgim në të gjithë vendin',
  'Fast 24–48 hour delivery to Skopje and every city across North Macedonia. Free shipping on orders over 3,500 MKD.':
    'Dërgim i shpejtë 24–48 orë në Shkup dhe çdo qytet të Maqedonisë. Dërgim falas për porositë mbi 3,500 MKD.',
  'Order Online or in DM': 'Porosit online ose me mesazh',
  'Place a Cash-on-Delivery order right here in seconds, or copy your bag and message @vyro.mk on Instagram or Facebook.':
    'Bëj porosi me pagesë në dorëzim në sekonda, ose kopjo çantën dhe shkruaj në @vyro.mk.',
  '7-Day Size Swap': 'Ndryshim madhësie 7 ditë',
  'Need a different size? Reach out within 7 days of delivery and we will arrange a quick size exchange.':
    'Të duhet një madhësi tjetër? Na shkruaj brenda 7 ditësh dhe organizojmë ndryshimin.',

  // Shop
  'Every piece for you, including unisex styles.':
    'Çdo artikull për ty, përfshirë modelet unisex.',
  'All': 'Të gjitha',
  'Search models...': 'Kërko modele...',
  'Featured': 'Të zgjedhura',
  'Newest drops': 'Më të rejat',
  'Top rated': 'Më të vlerësuarat',
  'Price: Low to High': 'Çmimi: nga i ulët',
  'Price: High to Low': 'Çmimi: nga i lartë',
  'Any price': 'Çdo çmim',
  'On sale': 'Me zbritje',
  'In stock': 'Në stok',
  'products': 'produkte',
  'No products match your filters.': 'Asnjë produkt nuk përputhet me filtrat.',
  'Reset filters': 'Rivendos filtrat',
  'Under 1,500 MKD': 'Nën 1,500 MKD',
  '1,500 – 3,000 MKD': '1,500 – 3,000 MKD',
  '3,000 – 4,000 MKD': '3,000 – 4,000 MKD',
  'Over 4,000 MKD': 'Mbi 4,000 MKD',

  // Track order
  'Track Your Order': 'Gjurmo porosinë',
  'Enter your order number (e.g. VYRO-1234) to check its status.':
    'Shkruaj numrin e porosisë (p.sh. VYRO-1234) për të parë statusin.',
  'Track': 'Gjurmo',
  'Latest order: ': 'Porosia e fundit: ',
  'Order not found. Double-check the order number.':
    'Porosia nuk u gjet. Kontrollo numrin.',
  'Back to shop': 'Kthehu në dyqan',
  'Order placed': 'Porosia u vendos',
  'Shipped': 'Dërguar',
  'Delivered': 'Dërguar te klienti',
  'size': 'madhësi',

  // Footer
  'Shop': 'Dyqani',
  'All Products': 'Të gjitha produktet',
  'Brand': 'Brendi',
  'About us': 'Rreth nesh',
  'Track my order': 'Gjurmo porosinë',
  'DM Ordering': 'Porosi me mesazh',
  'Drop Alerts': 'Alarme koleksionesh',
  'Get early access when limited sneakers and restocks land.':
    'Merr akses të hershëm kur vijnë modele të kufizuara.',
  'Your email': 'Email-i yt',
  'Join': 'Bashkohu',

  // Interpolated strings (MQ keys are the English template)
  'Add ${formatMkd(remainingForFree)} more for free delivery':
    'Shto ${formatMkd(remainingForFree)} më shumë për dërgim falas',
  'Add to Bag — ${formatMkd(product.priceMkd)}':
    'Shto në çantë — ${formatMkd(product.priceMkd)}',
  'Added ${product.name} (${size}) to bag':
    'U shtua ${product.name} (${size}) në çantë',
  'Applied ${label} off with ${match.code}!':
    'U aplikua ${label} zbritje me ${match.code}!',
  'Cash on delivery • Total: ${formatMkd(totalMkd)} (${cart.reduce((s, i) => s + i.quantity, 0)} items)':
    'Pagesë në dorëzim • Total: ${formatMkd(totalMkd)} (${cart.reduce((s, i) => s + i.quantity, 0)} artikuj)',
  'Every available piece • Prices from ${formatMkd(cheapest)} • Free delivery over 3,500 MKD':
    'Çdo artikull i disponueshëm • Çmime nga ${formatMkd(cheapest)} • Dërgim falas mbi 3,500 MKD',
  'Free delivery over ${formatMkd(settings.freeShippingMkd)}':
    'Dërgim falas mbi ${formatMkd(settings.freeShippingMkd)}',
  'Only ${available} left in that size.':
    'Vetëm ${available} mbetur në atë madhësi.',
  'Only ${selectedStock} left — order soon':
    'Vetëm ${selectedStock} mbetur — porosit shpejt',
  'Only ${totalStock} left': 'Vetëm ${totalStock} mbetur',
  'Order ${ref} confirmed!': 'Porosia ${ref} u konfirmua!',
  'Thank you, ${name}! Your order will ship within 24–48h to ${city}. Pay directly to the courier on delivery.':
    'Faleminderit, ${name}! Porosia dërgohet brenda 24–48 orësh në ${city}. Paguaj kurierit në dorëzim.',
  'View All (${products.length})': 'Shiko të gjitha (${products.length})',

  // Admin-visible store labels reused on storefront
  'Unisex': 'Unisex',
  'Men’s shop only': 'Vetëm dyqani i meshkujve',
  'Women’s shop only': 'Vetëm dyqani i femrave',
  'Shows in Men + Women': 'Shfaqet te meshkuj dhe femra',
}

/**
 * Pick the string for the active language.
 * Macedonian and English come from the call site; Albanian from the table.
 */
export function t(lang: Lang, mk: string, en: string, sq?: string): string {
  if (lang === 'mk') return mk
  if (lang === 'sq') return sq ?? SQ[en] ?? en
  return en
}
