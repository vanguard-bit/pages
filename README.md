# Dish Diary (Astro + Cloudflare Pages)

Personal dish-review blog with static pages, markdown content, optimized images, and lazy-loaded maps.

## Stack

- Astro (static generation)
- Cloudflare Pages (hosting)
- Astro content collections (dish schema + markdown)
- Sharp image processing in prebuild
- Leaflet + OpenStreetMap (map markers)

## Project structure

- `src/content/dishes/*.md` → one file per dish
- `raw-images/` → raw phone photos
- `public/images/` → generated webp + thumbnails
- `scripts/process-images.js` → image optimizer pipeline
- `src/pages/dish/[slug].astro` → per-dish static page
- `src/pages/add-dish.astro` → instructions for adding dishes

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

`prebuild` runs image processing automatically.

## Add a new dish

1. Create markdown file in `src/content/dishes/`.
2. Add raw photo(s) to `raw-images/`.
3. Set `image: <name>` in frontmatter.
4. Commit + push; Cloudflare Pages rebuilds and deploys.

## Cloudflare Pages settings

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
