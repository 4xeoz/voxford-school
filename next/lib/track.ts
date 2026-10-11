export type TrafficEventType =
  | "PAGE_VIEW"
  | "WHATSAPP_CLICK"
  | "CALL_CLICK"
  | "LOCATION_CLICK"
  | "EMAIL_CLICK";

/**
 * Fires a first-party tracking beacon. Uses sendBeacon so the request
 * survives the immediate navigation that tel:/mailto:/wa.me links trigger
 * on click — a normal fetch can get cancelled mid-flight in that case.
 */
export function trackEvent(page: string, type: TrafficEventType, locale?: string) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    page,
    type,
    locale,
    ...(type === "PAGE_VIEW" ? {
      referrer: document.referrer,
      screen: {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      },
    } : {}),
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
