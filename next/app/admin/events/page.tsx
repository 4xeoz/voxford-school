export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEvents } from "@/actions/events";
import EventsListClient from "./events-list-client";

export default async function EventsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role: string }).role;
  if (role === "OPERATOR") redirect("/admin/dashboard");

  const events = await getEvents();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0a1628]">Events</h1>
          <p className="mt-0.5 text-sm text-[#0a1628]/50">
            Create events and share registration links with attendees.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex h-10 items-center gap-2 rounded-lg bg-[#0a1628] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Event
        </Link>
      </div>

      {/* Stats strip */}
      {events.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-4">
          {[
            { label: "Total Events", value: events.length },
            { label: "Open Now", value: events.filter((e) => e.isActive).length },
            {
              label: "Total Registrations",
              value: events.reduce((sum, e) => sum + e._count.registrations, 0),
            },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-[#e5e0d5] bg-white px-5 py-3">
              <p className="text-2xl font-bold text-[#0a1628]">{value}</p>
              <p className="text-xs text-[#0a1628]/50">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Events list */}
      <EventsListClient events={JSON.parse(JSON.stringify(events))} />
    </div>
  );
}
