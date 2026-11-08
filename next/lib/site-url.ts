const PRODUCTION_SITE_URL = 'https://voxbridge-school.vercel.app';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');

function isLocalSiteUrl(value: string | undefined) {
  if (!value) return true;

  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  } catch {
    return true;
  }
}

// A stale localhost setting must never leak into canonical or share-preview URLs.
export const SITE_URL = !isLocalSiteUrl(configuredSiteUrl)
  ? configuredSiteUrl!
  : PRODUCTION_SITE_URL;
