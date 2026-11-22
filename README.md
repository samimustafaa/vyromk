# VYRO MK — Your Style. Your Move.

Streetwear and sneaker storefront for North Macedonia, with a standalone store console.
Prices in MKD, cash on delivery, bilingual English / Macedonian.

## Stack

- Vite + React 19 + TypeScript
- `react-router-dom` for routing
- Plain CSS (`src/index.css` tokens, `src/App.css` layout + admin stylesheet)
- No backend: catalog, stock, orders, discounts, reviews and settings persist in
  `localStorage` (keys prefixed `vyro_mk_`)

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build` (type-check + bundle into `dist/`).

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/shop` | Shop (filters via query: `?gender=men|women`, `?category=<slug>`) |
| `/product/:slug` | Product detail |
| `/about` | About |
| `/track-order` | Order tracking |
| `/admin` | Store console (private, not linked in the nav) |

### Store console

The console lives behind `/admin` with its own shell, sidebar and PIN screen.
Access code: `0061` (unlock state kept in `sessionStorage`).

Sections: Dashboard, Sales & Reports, Products, Categories, Inventory, Orders,
Discounts, Reviews, Customers, Settings.

Products can be added, edited, retagged and deleted. Every product carries an
audience tag — `men`, `women` or `unisex` — and unisex pieces appear in both the
Men and Women shops.

## Project notes

Conventions for future changes are in [`AGENTS.md`](./AGENTS.md): gender helper,
dynamic categories, inline SVG icons, and the separate admin shell.

## Deploying

The build is a static bundle, so any static host works. Two common options:

- **Vercel / Netlify** — build command `npm run build`, output directory `dist`.
  Add a rewrite so client-side routes fall back to `index.html`.
- **GitHub Pages** — publish `dist/`. Since routes are client-side, configure a
  SPA fallback (or set `base` in `vite.config.ts` for a project subpath).

The app is client-only right now: data entered in one browser is not shared with
other visitors. A real multi-user shop needs a database and server-side auth.
