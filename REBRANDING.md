# Rebranding checklist

This site started as a copy of an existing build. Structure and functionality
stay; only the brand changes. Everything you need to touch is listed here.

**Total: 140 brand references across 32 files, 2 logo files, 1 colour block.**

Work top to bottom — the order matters, because the copy in `dictionaries/`
feeds most of the pages.

---

## 1. Central config — do this first

**`next/brand.config.ts`** — created for this purpose, not yet wired in. Fill
in name, URL, contact details, and social links.

The long-term goal: every hardcoded brand string becomes a reference to this
file, so the *next* site is one file plus colours plus images. As you touch the
files below, replace the literal rather than swapping one hardcoded name for
another.

## 2. Colours

**`next/app/globals.css`** — already centralised as CSS variables. This is the
whole palette:

```css
--color-brand-primary:   #012340;   /* Navy */
--color-brand-secondary: #d9b573;   /* Gold */
--color-bg-primary:      #F2F2F3;
--color-bg-secondary:    #F5F5F5;
--color-text-primary:    #444444;
--color-text-muted:      #8195a6;
--color-border-soft:     #d1c7b1;
--color-ink-deep:        #0a1628;   /* plus -0 / -30 alpha variants */
--color-ink-muted:       #27344a;   /* plus -80 alpha variant */
```

Change these values and the whole site follows. Keep the alpha variants
consistent with their base colour or gradients will look wrong.

## 3. Logo and image assets

Replace in `next/public/`:

| Current file | Action |
|---|---|
| `NopecaFooterLogo.png` | replace + rename → `footer-logo.png` |
| `NopecaFooterLogoText.png` | replace + rename → `footer-logo-text.png` |
| `og-image.png` | replace — this is the social share card |
| `singl_logo_colord_white_background@4x.png` | replace |
| `strapi/favicon.png` | replace |
| `next/app/favicon.ico` | replace |

⚠️ Renaming these breaks imports. Grep for the old filename and update every
reference in the same commit.

Also review the photo content, which is school-specific:
`team/`, `universities/`, `university_showcase/`, `arc_gallery/`,
`infinit_scroll/`, `partnership/`, `students-university.png`, `steps-1..3.png`.

## 4. Copy — the biggest chunk

**Translations carry most of the text.** Do these first and many pages come
along for free:

| File | Refs |
|---|---|
| `next/dictionaries/en.json` | 18 |
| `next/dictionaries/fr.json` | 18 |
| `next/dictionaries/ar.json` | 1 |

Locales configured in `next/config.ts` are `en` and `fr`, but an `ar.json`
exists — decide whether Arabic is in scope and either wire it up or delete it.

## 5. Remaining files, by weight

### Heavy
| File | Refs |
|---|---|
| `next/scripts/seed-blog.ts` | 29 |
| `next/app/layout.tsx` | 13 |
| `next/components/layout/FooterSection.tsx` | 8 |
| `next/app/[locale]/blog/page.tsx` | 8 |
| `next/components/seo/JsonLd.tsx` | 6 |

`seed-blog.ts` is sample content, not site code — rewriting it is optional, but
it will seed the wrong brand into a fresh database if you run it.

### Medium
`ContactPageClient.tsx` (5) · `[locale]/contact/page.tsx` (5) ·
`public/manifest.json` (4) · `[locale]/universities/page.tsx` (4) ·
`[locale]/universities/[slug]/page.tsx` (3) · `[locale]/faq/page.tsx` (3)

### Light — 1–2 references each
`scripts/seed-admin.ts` · `ui/LoadingOverlay.tsx` ·
`sections/universities/UniversityDetailClient.tsx` · `layout/Navbar.tsx` ·
`app/admin/login/page.tsx` · `app/admin/components/admin-shell.tsx` ·
`[locale]/events/[slug]/page.tsx` · `[locale]/blog/[slug]/page.tsx` ·
`lib/gtag.ts` · `ui/HeroSectionUI/arc-gallery-hero.tsx` ·
`sections/TeamSection.tsx` · `app/sitemap.ts` · `app/robots.ts` ·
`app/globals.css` · `app/admin/layout.tsx` ·
`app/admin/events/[id]/page.tsx` · `[locale]/layout.tsx`

## 6. Domain and environment

- `next/.env.example` and `next/.env.production.example` — update `WEBSITE_URL`
- `strapi/.env.example` — check for brand references
- **`next/lib/gtag.ts`** — a Google Analytics ID belonging to the other site.
  Replace it or analytics land in the wrong property
- `app/sitemap.ts` and `app/robots.ts` derive from the host; confirm they pick
  up the new domain once `WEBSITE_URL` is set

## 7. Security carried over from the source project

⚠️ **A super-admin password was hardcoded in `next/scripts/seed-admin.ts`**
(`iyad@nopeca.com` / `nopeca@ceo`). It has been changed here to read
`SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` from the environment instead.

**That credential is still in the public `nopeca` repository and its git
history.** If the original site is live and that account exists, rotate the
password there — deleting the line does not remove it from history.

Also review:

- `strapi/scripts/prefillLoginFields.js` — hardcoded `welcomeToStrapi123`. It's
  a local dev convenience that prefills the Strapi login form; harmless
  locally, but make sure it never runs against production
- `next/scripts/seed-blog.ts` — `AUTHOR_EMAIL` is a real address used as sample
  blog-post metadata
- `next/lib/gtag.ts` — an analytics ID belonging to the other property

## 8. Before launch

- [ ] Search the whole repo case-insensitively for the old name — including
      `.md`, `.json`, and comments
- [ ] Check Strapi seed data in `strapi/data/` for branded content
- [ ] Replace `LaunchPad.jpg` at the repo root, or delete it
- [ ] Rewrite `README.md` — it still describes the original project
- [ ] Verify Open Graph tags render correctly with a share-preview tool
- [ ] Confirm `manifest.json` name/short_name/theme_color match the new brand

---

## Verifying you got everything

```bash
# should return nothing when the rebrand is complete
grep -ri "nopeca" . --exclude-dir=node_modules --exclude-dir=.git \
  --exclude=package-lock.json --exclude=yarn.lock
```

Run it before every deploy until it comes back empty.
