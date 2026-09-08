# OriginDB — marketing site

Landing page + docs for OriginDB, built with Next.js 16 (App Router).

## Stack

- **Next.js 16** (App Router, Turbopack) — server components by default;
  the only client-side islands are the mobile nav, the interactive ANN
  radius demo on the homepage, and the docs table-of-contents scroll
  tracking. Everything else — including every docs page — is rendered on
  the server and shipped as static HTML.
- **Tailwind CSS v4** for styling, driven by CSS variables defined in
  `app/globals.css` (colors, type, radii).
- **Markdown docs pipeline**: the four write-ups in `content/docs/*.md`
  are parsed at build time with `remark`/`rehype` (GFM tables, heading
  slugs + anchor links, code highlighting) and statically generated —
  see `lib/docs.ts` and `app/docs/[slug]/page.tsx`.
- **SEO**: per-page metadata, OpenGraph/Twitter cards, a dynamic OG image
  (`app/opengraph-image.tsx`), `sitemap.xml`, `robots.txt`, and
  JSON-LD (`SoftwareSourceCode`) in the root layout.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **Note:** `app/layout.tsx` loads Fraunces, Inter, and JetBrains Mono via
> `next/font/google`, which fetches font files from Google Fonts at build
> time. This requires outbound network access to `fonts.googleapis.com`
> and `fonts.gstatic.com` — most dev machines and hosts (Vercel, etc.) have
> this by default. If you're building somewhere without that access,
> either allow those two domains, or swap the three `next/font/google`
> calls in `app/layout.tsx` for `next/font/local` with self-hosted font
> files.

## Editing content

- **Docs**: edit the markdown files in `content/docs/`. Each file needs a
  frontmatter block (`title`, `description`, `order`) — order controls
  sidebar position. Adding a new `.md` file there automatically creates a
  new route at `/docs/<filename>` and adds it to the sidebar and docs
  index — no route file changes needed.
- **Landing page copy**: `app/page.tsx` — feature list, load-test numbers,
  and "good fit / poor fit" copy are plain arrays near the top of the file.
- **Brand color / type**: `app/globals.css`, under `:root`.
- **Site URL**: update `SITE_URL` in `app/layout.tsx` and `app/sitemap.ts`
  / `app/robots.ts` to your real domain before deploying.

## Build

```bash
npm run build
npm run start
```

## Deploying

Any Next.js host works (Vercel, a VPS with `next start`, etc.) — this is
a standard App Router project with no custom server code.
