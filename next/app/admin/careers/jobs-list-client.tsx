"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { deleteJob, toggleJobStatus } from "@/actions/careers";

interface JobRow {
  id: string;
  title: string;
  department: string | null;
  location: string;
  employmentType: string;
  isActive: boolean;
  closesAt: Date | string | null;
  slug: string;
  createdBy: { name: string };
  _count: { applications: number };
}

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export default function JobsListClient({ jobs }: { jobs: JobRow[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleDelete(id: string, title: string, count: number) {
    const warning =
      count > 0
        ? `Delete "${title}"? This permanently deletes ${count} application${count === 1 ? "" : "s"} and their CVs.`
        : `Delete "${title}"?`;
    if (!confirm(warning)) return;
    setDeleting(id);
    await deleteJob(id);
    toast.success("Job deleted");
    setDeleting(null);
  }

  async function handleToggle(id: string, current: boolean) {
    setToggling(id);
    await toggleJobStatus(id, !current);
    toast.success(current ? "Applications closed" : "Applications open");
    setToggling(null);
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(
      `${window.location.origin}/en/careers/${slug}`
    );
    toast.success("Job link copied!");
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-hairline py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5">
          <svg className="h-7 w-7 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-ink">No job posts yet</p>
          <p className="mt-1 text-sm text-ink/50">
            Post your first opening to start collecting applications and CVs.
          </p>
        </div>
        <Link
          href="/admin/careers/new"
          className="mt-1 flex h-10 items-center rounded-lg bg-ink px-5 text-sm font-semibold text-white hover:opacity-90"
        >
          Post a Job
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hairline bg-surface-soft">
            <th className="px-4 py-3 text-start font-medium text-ink/60">Position</th>
            <th className="hidden px-4 py-3 text-start font-medium text-ink/60 md:table-cell">Type</th>
            <th className="hidden px-4 py-3 text-start font-medium text-ink/60 lg:table-cell">Location</th>
            <th className="hidden px-4 py-3 text-start font-medium text-ink/60 lg:table-cell">Closes</th>
            <th className="px-4 py-3 text-start font-medium text-ink/60">Applications</th>
            <th className="px-4 py-3 text-start font-medium text-ink/60">Status</th>
            <th className="px-4 py-3 text-end font-medium text-ink/60">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {jobs.map((job) => {
            const expired = !!job.closesAt && new Date(job.closesAt) < new Date();
            return (
              <tr key={job.id} className="transition-colors hover:bg-surface-soft/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/careers/${job.id}`}
                    className="font-semibold text-ink transition-colors hover:text-brand"
                  >
                    {job.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink/40">
                    {job.department ? `${job.department} · ` : ""}by {job.createdBy.name}
                  </p>
                </td>

                <td className="hidden px-4 py-3 text-ink/70 md:table-cell">
                  {TYPE_LABELS[job.employmentType] ?? job.employmentType}
                </td>

                <td className="hidden max-w-[200px] truncate px-4 py-3 text-ink/70 lg:table-cell">
                  {job.location}
                </td>

                <td className="hidden px-4 py-3 text-ink/70 lg:table-cell">
                  {job.closesAt ? (
                    <span className={expired ? "text-red-500" : ""}>
                      {format(new Date(job.closesAt), "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span className="text-ink/30">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span className="font-bold text-ink">{job._count.applications}</span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      job.isActive && !expired
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {!job.isActive ? "Closed" : expired ? "Expired" : "Open"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      title="Copy public link"
                      onClick={() => copyLink(job.slug)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                    </button>

                    <Link
                      href={`/admin/careers/${job.id}`}
                      title="View applications"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Link>

                    <Link
                      href={`/admin/careers/${job.id}/edit`}
                      title="Edit job"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </Link>

                    <button
                      type="button"
                      title={job.isActive ? "Close applications" : "Open applications"}
                      onClick={() => handleToggle(job.id, job.isActive)}
                      disabled={toggling === job.id}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                        job.isActive
                          ? "text-amber-500 hover:bg-amber-50"
                          : "text-emerald-500 hover:bg-emerald-50"
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      title="Delete job"
                      onClick={() => handleDelete(job.id, job.title, job._count.applications)}
                      disabled={deleting === job.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
