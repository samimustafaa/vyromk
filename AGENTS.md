# Project notes

freecode reads this file before every change. Add anything it should always remember about this project.

## VYRO MK storefront

- Brand: VYRO MK — "Your Style. Your Move." / "Твој стил. Твој потег." Black `#101010`, white `#FFFFFF`, lime `#C7FF00`. Display font Oswald, body Manrope. Bilingual EN/MK via `useStore().lang`.
- Stack: Vite + React + TypeScript, react-router-dom, plain CSS in `src/App.css` + tokens in `src/index.css`. No UI library.
- State lives in `src/context/StoreContext.tsx` and persists to localStorage keys prefixed `vyro_mk_`. Products, stock, discounts, orders, reviews, wishlist, subscribers, settings are all client-side only — no backend.
- Routes: `/` home, `/shop`, `/product/:slug`, `/about`, `/track-order`, `/admin` (PIN `0061`, stored in sessionStorage key `vyro_admin_unlocked`). Admin in not linked in the nav on purpose.
- Icons are inline SVG components (`src/components/Icons.tsx`, `src/components/StarRating.tsx`). Do not use ★ ♥ ✕ ☰ glyphs — they render as tofu in this font stack.
- Product images: `/public/products/*.avif` (Unsplash downloads). Seed stock and default reviews live in StoreContext.
- Gender taxonomy: every `Product` must have `gender: 'men' | 'women' | 'unisex'`. Use `matchesGender(product, gender)` from `src/data/products.ts` — Unisex matches both Men and Women views. Keep that rule in one helper, don't re-implement `||` checks inline.
- Categories are dynamic: `Category` is a `string` slug; definitions live in `categories` (persisted under `vyro_mk_categories_v1`, defaults in `DEFAULT_CATEGORIES`). Header, shop filters, home tiles and admin all read from the store — never hardcode the three starting categories. Use `categoryLabel(categories, slug, lang)` for display.
- Products stored in localStorage are normalized on load (`normalizeProducts`) so older saves without `gender` default to Unisex. Keep that normalization when changing the Product shape.
- Shop URLs: `/shop?gender=men|women`, `/shop?category=<slug>`, both combinable. ShopPage syncs state from the URL in an effect so header links work while already on /shop.

## Admin console (standalone app)

- `/admin` is a separate app shell, not a page inside the storefront shell. `src/App.tsx` routes `/admin` to `AdminLayout` with nested section routes; the storefront lives under `/*` in `StorefrontShell`. Never render `Header`, `Footer`, `CartDrawer` or `CheckoutModal` inside the admin branch.
- Admin sections: `index` (dashboard), `sales`, `products`, `categories`, `inventory`, `orders`, `discounts`, `reviews`, `customers`, `settings` → one component per file in `src/admin/`. Nav items are defined once in `AdminLayout.tsx` (`NAV` array) — add the route and the nav entry together.
- Admin styling is the `adm-*` namespace at the end of `src/App.css`, scoped under `.adm-shell` (its own dark tokens, not the storefront tokens). Don't reuse storefront classes (`btn`, `card`) inside admin pages.
- Shared admin helpers (`PRESET_IMAGES`, `shortMkd`, `linePath`, `daysAgo`, `dayLabel`) live in `src/admin/adminData.ts`.
- `src/pages/AdminPage.tsx` was removed in the split; don't reintroduce a monolithic admin page.
- Local persistence only: admin and storefront data is per-browser localStorage. A real deployment needs a backend + server-side auth before this is multi-user.

## Shipping

- Remote: `origin` → https://github.com/samimustafaa/vyromk.git, branch `main`.
- The owner wants every change pushed. After a change builds and is verified, commit it and `git push origin main` in the same turn. Conventional-ish messages are fine; keep each push scoped to the change just made.
- Credentials live in `~/.git-credentials` (git credential helper `store`, local config). Never print, commit or copy that file. If a push fails with an auth error, ask for a fresh GitHub device-login approval instead of trying to read the token.
