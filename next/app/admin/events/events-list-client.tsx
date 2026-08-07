"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { deleteEvent, toggleEventStatus } from "@/actions/events";

interface EventRow {
  id: string;
  name: string;
  location: string;
  date: Date | string;
  isActive: boolean;
  slug: string;
  createdBy: { name: string };
  _count: { registrations: number };
}


export default function EventsListClient({ events }: { events: EventRow[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will also delete all registrations.`)) return;
    setDeleting(id);
    await deleteEvent(id);
    toast.success("Event deleted");
    setDeleting(null);
  }

  async function handleToggle(id: string, current: boolean) {
    setToggling(id);
    await toggleEventStatus(id, !current);
    toast.success(current ? "Event closed" : "Event opened");
    setToggling(null);
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/en/events/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Registration link copied!");
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#e5e0d5] py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0a1628]/5">
          <svg className="h-7 w-7 text-[#0a1628]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-[#0a1628]">No events yet</p>
          <p className="mt-1 text-sm text-[#0a1628]/50">Create your first event to generate a registration link and QR code.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="mt-1 flex h-10 items-center rounded-lg bg-[#0a1628] px-5 text-sm font-semibold text-white hover:opacity-90"
        >
          Create Event
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e0d5] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e5e0d5] bg-[#f5f3ee]">
            <th className="px-4 py-3 text-left font-medium text-[#0a1628]/60">Event</th>
            <th className="hidden px-4 py-3 text-left font-medium text-[#0a1628]/60 md:table-cell">Date</th>
            <th className="hidden px-4 py-3 text-left font-medium text-[#0a1628]/60 lg:table-cell">Location</th>
            <th className="px-4 py-3 text-left font-medium text-[#0a1628]/60">Registrations</th>
            <th className="px-4 py-3 text-left font-medium text-[#0a1628]/60">Status</th>
            <th className="px-4 py-3 text-right font-medium text-[#0a1628]/60">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e0d5]">
          {events.map((ev) => (
            <tr key={ev.id} className="hover:bg-[#f5f3ee]/50 transition-colors">
              {/* Name */}
              <td className="px-4 py-3">
                <Link
                  href={`/admin/events/${ev.id}`}
                  className="font-semibold text-[#0a1628] hover:text-[#d4a84b] transition-colors"
                >
                  {ev.name}
                </Link>
                <p className="text-xs text-[#0a1628]/40 mt-0.5">by {ev.createdBy.name}</p>
              </td>

              {/* Date */}
              <td className="hidden px-4 py-3 text-[#0a1628]/70 md:table-cell">
                {format(new Date(ev.date), "MMM d, yyyy")}
                <span className="block text-xs text-[#0a1628]/40">
                  {format(new Date(ev.date), "HH:mm")}
                </span>
              </td>

              {/* Location */}
              <td className="hidden max-w-[200px] truncate px-4 py-3 text-[#0a1628]/70 lg:table-cell">
                {ev.location}
              </td>

              {/* Count */}
              <td className="px-4 py-3">
                <span className="font-bold text-[#0a1628]">{ev._count.registrations}</span>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    ev.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[#0a1628]/8 text-[#0a1628]/50"
                  }`}
                >
                  {ev.isActive ? "Open" : "Closed"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  {/* Copy link */}
                  <button
                    type="button"
                    title="Copy registration link"
                    onClick={() => copyLink(ev.slug)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0a1628]/50 transition-colors hover:bg-[#0a1628]/8 hover:text-[#0a1628]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </button>

                  {/* View detail */}
                  <Link
                    href={`/admin/events/${ev.id}`}
                    title="View event"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0a1628]/50 transition-colors hover:bg-[#0a1628]/8 hover:text-[#0a1628]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>

                  {/* Toggle status */}
                  <button
                    type="button"
                    title={ev.isActive ? "Close registration" : "Open registration"}
                    onClick={() => handleToggle(ev.id, ev.isActive)}
                    disabled={toggling === ev.id}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                      ev.isActive
                        ? "text-amber-500 hover:bg-amber-50"
                        : "text-emerald-500 hover:bg-emerald-50"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {ev.isActive ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                      )}
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    title="Delete event"
                    onClick={() => handleDelete(ev.id, ev.name)}
                    disabled={deleting === ev.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors disabled:opacity-40 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
