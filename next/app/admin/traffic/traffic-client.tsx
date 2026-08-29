"use client";

import { Eye, Phone, MapPin, Mail } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

type TrafficEvent = {
  id: string;
  type: "PAGE_VIEW" | "WHATSAPP_CLICK" | "CALL_CLICK" | "LOCATION_CLICK" | "EMAIL_CLICK";
  locale: string | null;
  referrer: string | null;
  createdAt: string;
};

type Stats = {
  views: number;
  whatsappClicks: number;
  callClicks: number;
  locationClicks: number;
  emailClicks: number;
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
        <h1 className="text-xl font-bold text-ink">Traffic — /connect</h1>
        <p className="mt-0.5 text-sm text-ink/50">
          Page views and contact clicks on the social-media landing page
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
          <span className="font-semibold text-ink">{clickRate}%</span> of visitors clicked a
          contact button ({totalClicks.toLocaleString()} of {stats.views.toLocaleString()} views)
        </p>
      </div>

      {/* Recent events */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink/70">Recent activity</h2>

        {stats.recent.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-hairline text-ink/40">
            <Eye className="mb-2 h-8 w-8" strokeWidth={1} />
            <p className="text-sm font-medium">No events yet</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-hairline bg-white">
            <table className="w-full text-start text-sm">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-hairline bg-surface-soft">
                  <th className="px-4 py-3 font-semibold text-ink/70">Event</th>
                  <th className="px-4 py-3 font-semibold text-ink/70">Locale</th>
                  <th className="px-4 py-3 font-semibold text-ink/70">Referrer</th>
                  <th className="px-4 py-3 font-semibold text-ink/70">When</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((ev) => (
                  <tr key={ev.id} className="block border-b border-hairline/60 last:border-0 md:table-row">
                    <td className="block px-4 pt-3 md:table-cell md:py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[ev.type]}`}
                      >
                        {TYPE_LABELS[ev.type]}
                      </span>
                    </td>
                    <td className="block px-4 pt-1 text-xs text-ink/50 md:table-cell md:py-3">
                      {ev.locale?.toUpperCase() ?? "—"}
                    </td>
                    <td className="block truncate px-4 pt-1 text-xs text-ink/50 md:table-cell md:py-3 md:max-w-[220px]">
                      {ev.referrer ?? "Direct"}
                    </td>
                    <td className="block px-4 pb-3 pt-1 text-xs text-ink/40 md:table-cell md:py-3">
                      {new Date(ev.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
