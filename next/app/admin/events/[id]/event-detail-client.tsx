"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { toggleEventStatus, markAttended } from "@/actions/events";

interface Registration {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  attended: boolean;
  createdAt: Date | string;
}

interface EventDetailProps {
  event: {
    id: string;
    name: string;
    description: string;
    location: string;
    date: Date | string;
    isActive: boolean;
    slug: string;
    createdBy: { name: string };
    registrations: Registration[];
  };
  qrDataUrl: string;
  registrationUrl: string;
}

export default function EventDetailClient({ event, qrDataUrl, registrationUrl }: EventDetailProps) {
  const [isActive, setIsActive] = useState(event.isActive);
  const [toggling, setToggling] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>(
    Object.fromEntries(event.registrations.map((r) => [r.id, r.attended]))
  );

  async function handleToggleStatus() {
    setToggling(true);
    await toggleEventStatus(event.id, !isActive);
    setIsActive((v) => !v);
    toast.success(isActive ? "Event closed" : "Event opened");
    setToggling(false);
  }

  async function handleAttendance(id: string) {
    const next = !attendanceMap[id];
    setAttendanceMap((m) => ({ ...m, [id]: next }));
    await markAttended(id, next);
  }

  function copyLink() {
    navigator.clipboard.writeText(registrationUrl);
    toast.success("Registration link copied!");
  }

  function exportCSV() {
    const header = "Name,Phone,Email,Message,Registered At,Attended";
    const rows = event.registrations.map((r) =>
      [
        `"${r.name}"`,
        `"${r.phone}"`,
        `"${r.email ?? ""}"`,
        `"${(r.message ?? "").replace(/"/g, '""')}"`,
        `"${format(new Date(r.createdAt), "yyyy-MM-dd HH:mm")}"`,
        attendanceMap[r.id] ? "Yes" : "No",
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadQR() {
    const response = await fetch(qrDataUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}-qr.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const attended = event.registrations.filter((r) => attendanceMap[r.id]).length;

  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0a1628]/50 transition-colors hover:bg-[#0a1628]/8 hover:text-[#0a1628]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0a1628]">{event.name}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isActive ? "bg-emerald-100 text-emerald-700" : "bg-[#0a1628]/8 text-[#0a1628]/50"
                }`}
              >
                {isActive ? "Open" : "Closed"}
              </span>
            </div>
            <p className="text-sm text-[#0a1628]/50">
              Created by {event.createdBy.name} · {format(new Date(event.date), "MMM d, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={toggling}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition-colors disabled:opacity-50 ${
              isActive
                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {isActive ? "Close Registration" : "Open Registration"}
          </button>
          <Link
            href={`/admin/events/${event.id}/edit`}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#e5e0d5] bg-white px-4 text-sm font-medium text-[#0a1628]/70 transition-colors hover:text-[#0a1628]"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT — details + registrations */}
        <div className="flex flex-col gap-6">
          {/* Event info */}
          <div className="rounded-xl border border-[#e5e0d5] bg-white p-5">
            <h2 className="mb-4 font-semibold text-[#0a1628]">Event Details</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="font-medium text-[#0a1628]/50">Location</dt>
              <dd className="text-[#0a1628]">{event.location}</dd>
              <dt className="font-medium text-[#0a1628]/50">Date &amp; Time</dt>
              <dd className="text-[#0a1628]">
                {format(new Date(event.date), "EEEE, MMMM d, yyyy 'at' HH:mm")}
              </dd>
              <dt className="font-medium text-[#0a1628]/50">Description</dt>
              <dd className="whitespace-pre-wrap text-[#0a1628]/80">{event.description}</dd>
            </dl>
          </div>

          {/* Registrations */}
          <div className="rounded-xl border border-[#e5e0d5] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5e0d5] px-5 py-4">
              <div>
                <h2 className="font-semibold text-[#0a1628]">
                  Registrations
                  <span className="ml-2 rounded-full bg-[#0a1628]/8 px-2 py-0.5 text-xs font-bold text-[#0a1628]">
                    {event.registrations.length}
                  </span>
                </h2>
                <p className="mt-0.5 text-xs text-[#0a1628]/45">
                  {attended} attended · {event.registrations.length - attended} pending
                </p>
              </div>
              {event.registrations.length > 0 && (
                <button
                  type="button"
                  onClick={exportCSV}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-[#e5e0d5] bg-white px-3 text-xs font-medium text-[#0a1628]/70 transition-colors hover:text-[#0a1628]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export CSV
                </button>
              )}
            </div>

            {event.registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                <p className="text-sm text-[#0a1628]/50">No registrations yet.</p>
                <p className="text-xs text-[#0a1628]/35">Share the QR code or registration link to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f5f3ee] text-xs text-[#0a1628]/50">
                      <th className="px-4 py-2 text-left font-medium">Name</th>
                      <th className="px-4 py-2 text-left font-medium">Phone</th>
                      <th className="hidden px-4 py-2 text-left font-medium md:table-cell">Email</th>
                      <th className="hidden px-4 py-2 text-left font-medium lg:table-cell">Message</th>
                      <th className="px-4 py-2 text-left font-medium">Date</th>
                      <th className="px-4 py-2 text-center font-medium">Attended</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e0d5]">
                    {event.registrations.map((reg, i) => (
                      <tr key={reg.id} className="hover:bg-[#f5f3ee]/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-[#0a1628]">
                          <span className="mr-1.5 text-xs text-[#0a1628]/30">#{i + 1}</span>
                          {reg.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[#0a1628]/70">{reg.phone}</td>
                        <td className="hidden px-4 py-3 text-[#0a1628]/60 md:table-cell">
                          {reg.email || <span className="text-[#0a1628]/25">—</span>}
                        </td>
                        <td className="hidden max-w-[180px] truncate px-4 py-3 text-[#0a1628]/60 lg:table-cell">
                          {reg.message || <span className="text-[#0a1628]/25">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#0a1628]/50">
                          {format(new Date(reg.createdAt), "MMM d, HH:mm")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleAttendance(reg.id)}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                              attendanceMap[reg.id]
                                ? "border-emerald-400 bg-emerald-400 text-white"
                                : "border-[#e5e0d5] text-transparent hover:border-emerald-300"
                            }`}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — QR code + link */}
        <div className="flex flex-col gap-4">
          {/* Registration link */}
          <div className="rounded-xl border border-[#e5e0d5] bg-white p-5">
            <h2 className="mb-3 font-semibold text-[#0a1628]">Registration Link</h2>
            <div className="flex items-center gap-2 rounded-lg bg-[#f5f3ee] px-3 py-2">
              <p className="flex-1 truncate text-xs font-mono text-[#0a1628]/70">{registrationUrl}</p>
              <button
                type="button"
                onClick={copyLink}
                className="shrink-0 rounded-md bg-[#0a1628] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-xs text-[#0a1628]/40">
              Share this link or the QR code below so attendees can register.
            </p>
          </div>

          {/* QR Code */}
          <div className="rounded-xl border border-[#e5e0d5] bg-white p-5">
            <h2 className="mb-4 font-semibold text-[#0a1628]">QR Code</h2>

            {/* QR image */}
            <div className="flex justify-center rounded-xl bg-white p-4 ring-1 ring-[#e5e0d5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Event QR Code"
                className="h-56 w-56 object-contain"
              />
            </div>

            {/* Download button */}
            <button
              type="button"
              onClick={downloadQR}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a1628] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download QR Code (PNG)
            </button>

            <p className="mt-2 text-center text-xs text-[#0a1628]/35">
              Print and display at your event venue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
