import type { Config } from 'tailwindcss';

/**
 * Voxford brand charter — the single source of truth for colour.
 *
 * Registering these here (rather than only as CSS custom properties) is what
 * makes `bg-brand/10` work: Tailwind v3 cannot apply an opacity modifier to an
 * arbitrary `var()` colour, so `bg-brand/10` silently emits
 * no CSS at all. Named theme colours support the whole modifier syntax.
 *
 * Reds are sampled from the logo assets in public/voxford — the crest is
 * #BC0000 and the wordmark #D30000.
 */
const palette = {
  brand: {
    DEFAULT: '#BC0000', // crest red — primary
    dark: '#8F0000', // pressed / gradient end
    bright: '#D30000', // wordmark red — accents, hovers
    soft: '#FBEAEA', // tinted fills
  },
  ink: {
    DEFAULT: '#1A1C1F', // primary text and dark surfaces
    muted: '#3A3D42',
    soft: '#2E3134',
  },
  surface: {
    DEFAULT: '#FFFFFF',
    soft: '#F7F7F8', // sections, cards, hero
    wisp: '#F0F0F1',
  },
  hairline: '#E4E4E7', // dividers, borders
  subtle: '#6B7075', // secondary text
  whatsapp: {
    DEFAULT: '#25D366',
    dark: '#1A9F4B',
  },
} as const;

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        // Snaga Arabic, from the Adobe Fonts kit, loaded only on /ar.
        // NB the kit publishes the family as "snaga-arabic-text" (weights 400
        // and 700) — "snaga-arabic" matches nothing and silently falls back.
        // The rest are system Arabic faces for when the kit can't load.
        arabic: [
          'snaga-arabic-text',
          'Geeza Pro',
          'Segoe UI',
          'Tahoma',
          'sans-serif',
        ],
      },
      spacing: {
        // The navbar is `h-0` and floats over the page, so every top-level
        // section clears it with this instead of re-guessing a number.
        nav: '7rem',
        'nav-lg': '9rem',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
