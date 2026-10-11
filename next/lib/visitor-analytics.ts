import { isIP } from "node:net";

export type ScreenDetails = {
  screenWidth?: unknown;
  screenHeight?: unknown;
  viewportWidth?: unknown;
  viewportHeight?: unknown;
};

function version(match: RegExpMatchArray | null): string | null {
  return match?.[1]?.replaceAll("_", ".").slice(0, 24) ?? null;
}

/** Best-effort classification: browsers often omit exact device models. */
export function parseUserAgent(userAgent: string) {
  const ua = userAgent.slice(0, 700);
  const ipad = /iPad/i.test(ua);
  const iphone = /iPhone|iPod/i.test(ua);
  const android = /Android/i.test(ua);
  const androidPhone = android && /Mobile/i.test(ua);
  const deviceType = ipad || (android && !androidPhone) ? "Tablet" : iphone || androidPhone || /Windows Phone/i.test(ua) ? "Phone" : "Desktop";

  let deviceModel: string | null = null;
  if (ipad) deviceModel = "iPad (model unavailable)";
  else if (iphone) deviceModel = "iPhone (model unavailable)";
  else if (android) {
    const raw = ua.match(/Android [^;)]*;\s*([^;)]+)/i)?.[1]
      ?.replace(/\s+Build\/.*$/i, "")
      .trim();
    deviceModel = raw && !/^(k|wv|mobile|[a-z]{2}[-_][a-z]{2})$/i.test(raw)
      ? raw.slice(0, 60)
      : androidPhone ? "Android phone (model unavailable)" : "Android tablet (model unavailable)";
  }

  let osName: string | null = null;
  let osVersion: string | null = null;
  if (android) {
    osName = "Android";
    osVersion = version(ua.match(/Android\s+([\d.]+)/i));
  } else if (iphone || ipad) {
    osName = ipad ? "iPadOS" : "iOS";
    osVersion = version(ua.match(/(?:iPhone|CPU) OS\s+([\d_]+)/i));
  } else if (/Windows NT/i.test(ua)) {
    osName = "Windows";
    // NT 10.0 covers both Windows 10 and 11: do not claim either one.
    osVersion = version(ua.match(/Windows NT\s+([\d.]+)/i));
  } else if (/Mac OS X/i.test(ua)) {
    osName = "macOS";
    osVersion = version(ua.match(/Mac OS X\s+([\d_]+)/i));
  } else if (/Linux/i.test(ua)) {
    osName = "Linux";
  }

  const browsers: Array<[string, RegExp]> = [
    ["Edge", /(?:EdgiOS|EdgA|Edg)\/([\d.]+)/i],
    ["Opera", /OPR\/([\d.]+)/i],
    ["Samsung Internet", /SamsungBrowser\/([\d.]+)/i],
    ["Chrome", /(?:CriOS|Chrome)\/([\d.]+)/i],
    ["Firefox", /(?:FxiOS|Firefox)\/([\d.]+)/i],
    ["Safari", /Version\/([\d.]+).*Safari/i],
  ];
  const browser = browsers.find(([, expression]) => expression.test(ua));
  const browserName = browser?.[0] ?? null;
  const browserVersion = browser ? version(ua.match(browser[1])) : null;

  return { deviceType, deviceModel, osName, osVersion, browserName, browserVersion };
}

function dimension(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 200 && value <= 10000
    ? value : null;
}

export function parseScreenDetails(input: ScreenDetails | null | undefined) {
  return {
    screenWidth: dimension(input?.screenWidth),
    screenHeight: dimension(input?.screenHeight),
    viewportWidth: dimension(input?.viewportWidth),
    viewportHeight: dimension(input?.viewportHeight),
  };
}

export function referrerOrigin(value: unknown): string | null {
  if (typeof value !== "string" || !value || value.length > 2000) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin.slice(0, 300) : null;
  } catch {
    return null;
  }
}

/** Read only platform-set headers, never an IP supplied in the beacon body. */
export function requestGeo(headers: Headers, trustedVercel: boolean) {
  if (!trustedVercel) {
    return { ipAddress: null, countryCode: null, regionCode: null, city: null };
  }

  const possibleIp = (headers.get("x-vercel-forwarded-for") ?? headers.get("x-forwarded-for") ?? "")
    .split(",")[0].trim();
  const ipAddress = isIP(possibleIp) ? possibleIp : null;
  const country = headers.get("x-vercel-ip-country")?.toUpperCase() ?? "";
  const region = headers.get("x-vercel-ip-country-region")?.toUpperCase() ?? "";
  const rawCity = headers.get("x-vercel-ip-city") ?? "";
  let city: string | null = null;
  try {
    city = decodeURIComponent(rawCity).replace(/[\x00-\x1f\x7f]/g, "").slice(0, 80) || null;
  } catch {
    // Malformed location headers are unavailable, not fatal to tracking.
  }

  return {
    ipAddress,
    countryCode: /^[A-Z]{2}$/.test(country) ? country : null,
    regionCode: /^[A-Z0-9-]{1,3}$/.test(region) ? region : null,
    city,
  };
}
