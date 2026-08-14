export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getJobById } from "@/actions/careers";
import { getApplicationsForJob } from "@/actions/applications";
import ApplicationsClient from "./applications-client";

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") redirect("/admin/dashboard");

  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const applications = await getApplicationsForJob(id);

  const expired = !!job.closesAt && new Date(job.closesAt) < new Date();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/careers"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-ink">{job.title}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  job.isActive && !expired
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-ink/10 text-ink/50"
                }`}
              >
                {!job.isActive ? "Closed" : expired ? "Expired" : "Open"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-ink/50">
              {job.department ? `${job.department} · ` : ""}
              {TYPE_LABELS[job.employmentType] ?? job.employmentType} · {job.location}
              {job.closesAt
                ? ` · closes ${format(new Date(job.closesAt), "MMM d, yyyy")}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/en/careers/${job.slug}`}
            target="_blank"
            className="flex h-10 items-center gap-2 rounded-lg border border-hairline bg-white px-4 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            View public page
          </Link>
          <Link
            href={`/admin/careers/${job.id}/edit`}
            className="flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-4">
        {[
          { label: "Applications", value: applications.length },
          {
            label: "Shortlisted",
            value: applications.filter((a) => a.status === "SHORTLISTED").length,
          },
          {
            label: "Needs Review",
            value: applications.filter((a) => a.status === "NEW").length,
          },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-hairline bg-white px-5 py-3">
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-ink/50">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold text-ink">Applications</h2>
      <ApplicationsClient
        applications={JSON.parse(JSON.stringify(applications))}
      />
    </div>
  );
}
