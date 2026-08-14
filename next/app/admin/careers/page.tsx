export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getJobs } from "@/actions/careers";
import JobsListClient from "./jobs-list-client";

export default async function CareersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") redirect("/admin/dashboard");

  const jobs = await getJobs();

  const now = new Date();
  const openCount = jobs.filter(
    (j) => j.isActive && (!j.closesAt || new Date(j.closesAt) >= now)
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Careers</h1>
          <p className="mt-0.5 text-sm text-ink/50">
            Post openings and review the CVs that come in.
          </p>
        </div>
        <Link
          href="/admin/careers/new"
          className="flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Post a Job
        </Link>
      </div>

      {/* Stats strip */}
      {jobs.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-4">
          {[
            { label: "Total Posts", value: jobs.length },
            { label: "Open Now", value: openCount },
            {
              label: "Total Applications",
              value: jobs.reduce((sum, j) => sum + j._count.applications, 0),
            },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-hairline bg-white px-5 py-3">
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="text-xs text-ink/50">{label}</p>
            </div>
          ))}
        </div>
      )}

      <JobsListClient jobs={JSON.parse(JSON.stringify(jobs))} />
    </div>
  );
}
