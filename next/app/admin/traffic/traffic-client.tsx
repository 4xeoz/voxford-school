"use client";

import { ChevronDown, Eye, Phone, MapPin, Mail } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

type TrafficEvent = {
  id: string;
  page: string;
  type: "PAGE_VIEW" | "WHATSAPP_CLICK" | "CALL_CLICK" | "LOCATION_CLICK" | "EMAIL_CLICK";
  locale: string | null;
  referrer: string | null;
  ipAddress: string | null;
  countryCode: string | null;
  regionCode: string | null;
  city: string | null;
  deviceType: string | null;
  deviceModel: string | null;
  osName: string | null;
  osVersion: string | null;
  browserName: string | null;
  browserVersion: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  viewportWidth: number | null;
  viewportHeight: number | null;
  createdAt: string;
};

type Breakdown = { label: string; count: number }[];

type Stats = {
  views: number;
  whatsappClicks: number;
  callClicks: number;
  locationClicks: number;
  emailClicks: number;
  periodViews: number;
  breakdowns: {
    pages: Breakdown;
    devices: Breakdown;
    systems: Breakdown;
    browsers: Breakdown;
    countries: Breakdown;
  };
  recent: TrafficEvent[];
};

const TYPE_LABELS: Record<TrafficEvent["type"], string> = {
  PAGE_VIEW: "Page view",
  WHATSAPP_CLICK: "WhatsApp click",
  CALL_CLICK: "Call click",
  LOCATION_CLICK: "Directions click",
  EMAIL_CLICK: "Email click",
};

const TYPE_COLORS: Record<TrafficEvent["type"], string> = {
  PAGE_VIEW: "bg-sky-50 text-sky-700 border-sky-200",
  WHATSAPP_CLICK: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CALL_CLICK: "bg-ink/5 text-ink border-ink/10",
  LOCATION_CLICK: "bg-brand-soft text-brand border-brand/20",
  EMAIL_CLICK: "bg-amber-50 text-amber-700 border-amber-200",
};

function BreakdownCard({ title, items, total }: { title: string; items: Breakdown; total: number }) {
  return (
    <section className="rounded-xl border border-hairline bg-white p-4">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      {items.length === 0 ? <p className="mt-4 text-sm text-ink/50">No visits yet</p> : (
        <ul className="mt-4 space-y-3">
          {items.map(({ label, count }) => (
            <li key={label}>
              <div className="mb-1 flex justify-between gap-3 text-xs">
                <span className="min-w-0 truncate text-ink/70" title={label}>{label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-ink">{count.toLocaleString()}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink/5">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.round((count / Math.max(total, 1)) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-ink/50">{label}</dt>
      <dd className="mt-0.5 break-all text-sm text-ink" dir="auto">{value || "Unknown"}</dd>
    </div>
  );
}

export default function TrafficClient({ stats }: { stats: Stats }) {
  const totalClicks =
    stats.whatsappClicks + stats.callClicks + stats.locationClicks + stats.emailClicks;
  const clickRate = stats.views > 0 ? Math.round((totalClicks / stats.views) * 100) : 0;

  const tiles = [
    { label: "Page views", value: stats.views, icon: <Eye className="h-5 w-5" strokeWidth={1.8} />, color: "text-sky-700 bg-sky-50" },
    { label: "WhatsApp clicks", value: stats.whatsappClicks, icon: <WhatsAppIcon className="h-5 w-5" />, color: "text-emerald-700 bg-emerald-50" },
    { label: "Call clicks", value: stats.callClicks, icon: <Phone className="h-5 w-5" strokeWidth={1.8} />, color: "text-ink bg-ink/5" },
    { label: "Directions clicks", value: stats.locationClicks, icon: <MapPin className="h-5 w-5" strokeWidth={1.8} />, color: "text-brand bg-brand-soft" },
    { label: "Email clicks", value: stats.emailClicks, icon: <Mail className="h-5 w-5" strokeWidth={1.8} />, color: "text-amber-700 bg-amber-50" },
  ];

  return (
    <div className="px-6 py-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">Site traffic</h1>
        <p className="mt-0.5 text-sm text-ink/50">
          Public-page views and tracked contact clicks. Device and location details are best effort.
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-hairline bg-white p-4">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${tile.color}`}>
              {tile.icon}
            </div>
            <p className="text-2xl font-bold text-ink">{tile.value.toLocaleString()}</p>
            <p className="text-xs font-medium text-ink/50">{tile.label}</p>
          </div>
        ))}
      </div>

      {/* Click-through rate */}
      <div className="mt-4 rounded-xl border border-hairline bg-white p-4">
        <p className="text-sm text-ink/60">
          <span className="font-semibold text-ink">{clickRate}</span> contact clicks per 100 page views
          ({totalClicks.toLocaleString()} clicks, {stats.views.toLocaleString()} views). One visitor can click more than once.
        </p>
      </div>

      <div className="mt-7">
        <h2 className="mb-3 text-sm font-semibold text-ink/70">Last 30 days · {stats.periodViews.toLocaleString()} page views</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <BreakdownCard title="Top pages" items={stats.breakdowns.pages} total={stats.periodViews} />
          <BreakdownCard title="Devices" items={stats.breakdowns.devices} total={stats.periodViews} />
          <BreakdownCard title="Operating systems" items={stats.breakdowns.systems} total={stats.periodViews} />
          <BreakdownCard title="Browsers" items={stats.breakdowns.browsers} total={stats.periodViews} />
          <BreakdownCard title="Countries (approximate)" items={stats.breakdowns.countries} total={stats.periodViews} />
        </div>
      </div>

      {/* Recent events */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink/70">Recent activity · latest 75 events</h2>

        {stats.recent.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-hairline text-ink/40">
            <Eye className="mb-2 h-8 w-8" strokeWidth={1} />
            <p className="text-sm font-medium">No events yet</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-hairline bg-white">
            {stats.recent.map((ev) => {
              const page = ev.page === "home" ? "/" : `/${ev.page}`;
              const location = [ev.city, ev.regionCode, ev.countryCode].filter(Boolean).join(", ");
              const hasVisitDetails = Boolean(ev.deviceType || ev.ipAddress || ev.screenWidth);
              return (
                <details key={ev.id} className="group border-b border-hairline/60 last:border-0">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[ev.type]}`}>
                      {TYPE_LABELS[ev.type]}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink" title={page}>{page}</span>
                    <span className="hidden shrink-0 text-xs text-ink/50 sm:inline">{ev.deviceType ?? "—"}</span>
                    <time className="shrink-0 text-xs text-ink/40" dateTime={ev.createdAt}>
                      {new Date(ev.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </time>
                    <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-hairline/50 bg-surface-soft/50 px-4 py-4">
                    {hasVisitDetails ? (
                      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Detail label="Device" value={[ev.deviceType, ev.deviceModel].filter(Boolean).join(" · ") || null} />
                        <Detail label="Operating system" value={[ev.osName, ev.osVersion].filter(Boolean).join(" ") || null} />
                        <Detail label="Browser" value={[ev.browserName, ev.browserVersion].filter(Boolean).join(" ") || null} />
                        <Detail label="Screen (CSS px)" value={ev.screenWidth && ev.screenHeight ? `${ev.screenWidth} × ${ev.screenHeight}` : null} />
                        <Detail label="Viewport (CSS px)" value={ev.viewportWidth && ev.viewportHeight ? `${ev.viewportWidth} × ${ev.viewportHeight}` : null} />
                        <Detail label="IP address" value={ev.ipAddress} />
                        <Detail label="Approximate IP location" value={location || null} />
                        <Detail label="Source website" value={ev.referrer || "Direct / unknown"} />
                        <Detail label="Locale" value={ev.locale?.toUpperCase() ?? null} />
                      </dl>
                    ) : <p className="text-sm text-ink/50">Visit details were not recorded for this event.</p>}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
