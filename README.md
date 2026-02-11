# Dish Diary (Cloudflare Pages)

A personal dish review site built as a static project for Cloudflare Pages.

## What it includes

- Dish-focused cards (name, rating, description)
- Base64 image decoding in the browser
- Restaurant/location links for each dish
- Embedded map preview per dish
- Search across dish and location text

## Project files

- `index.html` – page structure and template markup
- `style.css` – responsive styles
- `script.js` – data loading, rendering, image decoding, search
- `dishes.json` – static dish data source

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy on Cloudflare Pages

1. Push this repository to GitHub/GitLab.
2. In Cloudflare Dashboard, create a new **Pages** project.
3. Connect your repo and use these settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. Deploy.

Because this is a static site, no server runtime or database is required.
