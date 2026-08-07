export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllClockRecords } from "@/actions/admin";

export default async function ClockRecordsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role: string }).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") redirect("/admin/dashboard");

  const records = await getAllClockRecords();

  function formatDuration(ms: number | null) {
    if (!ms) return "—";
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  function formatCoords(lat: number | null, lng: number | null) {
    if (lat == null || lng == null) return null;
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  return (
    <div className="px-6 py-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0a1628]">Clock Records</h1>
        <p className="mt-0.5 text-sm text-[#0a1628]/50">
          Operator work hours and location tracking
        </p>
      </div>

      {records.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-[#d1c7b1] text-[#0a1628]/40">
          <svg className="mb-2 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">No clock records yet</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-[#e5e0d5] bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e0d5] bg-[#faf8f4]">
                  <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Operator</th>
                  <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Clock In</th>
                  <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Clock Out</th>
                  <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Duration</th>
                  <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Location In</th>
                  <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Location Out</th>
                  <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const isActive = !record.clockOut;
                  const coordsIn = formatCoords(record.latitudeIn, record.longitudeIn);
                  const coordsOut = formatCoords(record.latitudeOut, record.longitudeOut);
                  return (
                    <tr
                      key={record.id}
                      className="border-b border-[#e5e0d5]/60 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#012340]/10 text-[10px] font-bold text-[#012340]">
                            {record.admin.name[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-[#0a1628]">{record.admin.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#0a1628]/60 text-xs">
                        {new Date(record.clockIn).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        {new Date(record.clockIn).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#0a1628]/60 text-xs">
                        {record.clockOut
                          ? `${new Date(record.clockOut).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })} ${new Date(record.clockOut).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-[#0a1628]/70">
                        {formatDuration(record.durationMs)}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#0a1628]/40">
                        {coordsIn ? (
                          <a
                            href={`https://www.google.com/maps?q=${record.latitudeIn},${record.longitudeIn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {coordsIn}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#0a1628]/40">
                        {coordsOut ? (
                          <a
                            href={`https://www.google.com/maps?q=${record.latitudeOut},${record.longitudeOut}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {coordsOut}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-[#e5e0d5] bg-[#faf8f4] px-2 py-0.5 text-xs font-medium text-[#0a1628]/40">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {records.map((record) => {
              const isActive = !record.clockOut;
              const coordsIn = formatCoords(record.latitudeIn, record.longitudeIn);
              const coordsOut = formatCoords(record.latitudeOut, record.longitudeOut);
              return (
                <div
                  key={record.id}
                  className="rounded-xl border border-[#e5e0d5] bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#012340]/10 text-xs font-bold text-[#012340]">
                        {record.admin.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-[#0a1628]">{record.admin.name}</span>
                    </div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-[#e5e0d5] bg-[#faf8f4] px-2 py-0.5 text-xs font-medium text-[#0a1628]/40">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium text-[#0a1628]/40">Clock In</p>
                      <p className="text-[#0a1628]/70">
                        {new Date(record.clockIn).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{" "}
                        {new Date(record.clockIn).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-[#0a1628]/40">Clock Out</p>
                      <p className="text-[#0a1628]/70">
                        {record.clockOut
                          ? `${new Date(record.clockOut).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${new Date(record.clockOut).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-[#0a1628]/40">Duration</p>
                      <p className="font-medium text-[#0a1628]/70">{formatDuration(record.durationMs)}</p>
                    </div>
                    {coordsIn && (
                      <div>
                        <p className="font-medium text-[#0a1628]/40">Location In</p>
                        <a
                          href={`https://www.google.com/maps?q=${record.latitudeIn},${record.longitudeIn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {coordsIn}
                        </a>
                      </div>
                    )}
                    {coordsOut && (
                      <div>
                        <p className="font-medium text-[#0a1628]/40">Location Out</p>
                        <a
                          href={`https://www.google.com/maps?q=${record.latitudeOut},${record.longitudeOut}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {coordsOut}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
