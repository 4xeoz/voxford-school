"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { wilayaLabel } from "@/lib/wilayas";
import {
  addApplicationNote,
  deleteApplication,
  getCvUrl,
  updateApplicationStatus,
} from "@/actions/applications";

type Status =
  | "NEW"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEWED"
  | "REJECTED"
  | "HIRED";

interface Note {
  id: string;
  content: string;
  createdAt: string | Date;
  author: { name: string };
}

interface ApplicationRow {
  id: string;
  status: Status;
  coverLetter: string | null;
  cvFilename: string | null;
  createdAt: string | Date;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wilayaCode: number;
  city: string | null;
  notes: Note[];
}

const STATUSES: Status[] = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEWED",
  "REJECTED",
  "HIRED",
];

const STATUS_STYLES: Record<Status, string> = {
  NEW: "bg-sky-100 text-sky-700",
  REVIEWING: "bg-amber-100 text-amber-700",
  SHORTLISTED: "bg-violet-100 text-violet-700",
  INTERVIEWED: "bg-indigo-100 text-indigo-700",
  REJECTED: "bg-ink/10 text-ink/50",
  HIRED: "bg-emerald-100 text-emerald-700",
};

const STATUS_LABELS: Record<Status, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  INTERVIEWED: "Interviewed",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

export default function ApplicationsClient({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  const [rows, setRows] = useState(applications);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [noteDraft, setNoteDraft] = useState("");
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);

  async function handleStatus(id: string, status: Status) {
    setBusy(id);
    const result = await updateApplicationStatus(id, status);
    setBusy(null);

    if ("error" in result) {
      toast.error(result.error as string);
      return;
    }

    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Marked ${STATUS_LABELS[status].toLowerCase()}`);
  }

  async function handleView(id: string, name: string, filename: string | null) {
    // Browsers render PDFs but not Word documents — for those, a "preview"
    // pane would just show a download prompt, so go straight to saving.
    if (filename && !/\.pdf$/i.test(filename)) return handleDownload(id);

    setBusy(id);
    const result = await getCvUrl(id, "view");
    setBusy(null);

    if ("error" in result) {
      toast.error(result.error as string);
      return;
    }

    setPreview({ url: result.url, name });
  }

  async function handleDownload(id: string) {
    setBusy(id);
    const result = await getCvUrl(id, "download");
    setBusy(null);

    if ("error" in result) {
      toast.error(result.error as string);
      return;
    }

    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  async function handleAddNote(id: string) {
    const content = noteDraft.trim();
    if (!content) return;

    setBusy(id);
    const result = await addApplicationNote(id, content);
    setBusy(null);

    if ("error" in result) {
      toast.error(result.error as string);
      return;
    }

    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              notes: [
                {
                  id: `temp-${Date.now()}`,
                  content,
                  createdAt: new Date(),
                  author: { name: "You" },
                },
                ...r.notes,
              ],
            }
          : r
      )
    );
    setNoteDraft("");
    toast.success("Note added");
  }

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Delete ${name}'s application? This also permanently deletes their CV from storage.`
      )
    )
      return;

    setBusy(id);
    const result = await deleteApplication(id);
    setBusy(null);

    if ("error" in result) {
      toast.error(result.error as string);
      return;
    }

    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Application deleted");
  }

  const visible = filter === "ALL" ? rows : rows.filter((r) => r.status === filter);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-hairline py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5">
          <svg className="h-7 w-7 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H8.25m6.75-3H8.25m0-9v.375c0 .621-.504 1.125-1.125 1.125H6.75m.375 6.375h.008" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-ink">No applications yet</p>
          <p className="mt-1 text-sm text-ink/50">
            Share the job link — applications will appear here as they arrive.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* CV preview — a full-screen pane rather than a new tab, so reviewing
          twenty CVs doesn't leave twenty orphaned tabs open. */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/70 p-4 sm:p-8"
          onClick={() => setPreview(null)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline px-4 py-3">
              <p className="truncate text-sm font-semibold text-ink">
                {preview.name} — CV
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 items-center rounded-lg border border-hairline px-3 text-xs font-semibold text-ink/70 transition-colors hover:text-ink"
                >
                  Open in new tab
                </a>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <iframe
              src={preview.url}
              title={`${preview.name} CV`}
              className="h-full w-full flex-1 border-0 bg-surface-soft"
            />
          </div>
        </div>
      )}

      {/* Status filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["ALL", ...STATUSES] as const).map((s) => {
          const count = s === "ALL" ? rows.length : rows.filter((r) => r.status === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === s
                  ? "bg-ink text-white"
                  : "bg-white text-ink/60 border border-hairline hover:text-ink"
              }`}
            >
              {s === "ALL" ? "All" : STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((app) => {
          const isOpen = expanded === app.id;
          const fullName = `${app.firstName} ${app.lastName}`;

          return (
            <div
              key={app.id}
              className="overflow-hidden rounded-xl border border-hairline bg-white"
            >
              {/* Summary row */}
              <div className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 text-sm font-semibold text-ink">
                  {app.firstName[0]?.toUpperCase()}
                  {app.lastName[0]?.toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{fullName}</p>
                  <p className="truncate text-xs text-ink/50">
                    {wilayaLabel(app.wilayaCode)}
                    {app.city ? ` · ${app.city}` : ""} ·{" "}
                    {format(new Date(app.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[app.status]}`}
                >
                  {STATUS_LABELS[app.status]}
                </span>

                <button
                  type="button"
                  title="Preview CV in the browser"
                  onClick={() => handleView(app.id, fullName, app.cvFilename)}
                  disabled={busy === app.id}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-hairline px-3 text-xs font-semibold text-ink/70 transition-colors hover:text-ink disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View CV
                </button>

                <button
                  type="button"
                  title="Download CV"
                  onClick={() => handleDownload(app.id)}
                  disabled={busy === app.id}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink disabled:opacity-40"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>

                <button
                  type="button"
                  title="Delete application"
                  onClick={() => handleDelete(app.id, fullName)}
                  disabled={busy === app.id}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExpanded(isOpen ? null : app.id);
                    setNoteDraft("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>

              {/* Detail */}
              {isOpen && (
                <div className="border-t border-hairline bg-surface-soft/40 p-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Contact + cover letter */}
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Contact
                      </h4>
                      <dl className="mb-5 flex flex-col gap-1.5 text-sm">
                        <div className="flex gap-2">
                          <dt className="w-16 shrink-0 text-ink/50">Email</dt>
                          <dd>
                            <a
                              href={`mailto:${app.email}`}
                              className="text-ink hover:text-brand"
                            >
                              {app.email}
                            </a>
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-16 shrink-0 text-ink/50">Phone</dt>
                          <dd>
                            <a
                              href={`tel:${app.phone}`}
                              className="text-ink hover:text-brand"
                            >
                              {app.phone}
                            </a>
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-16 shrink-0 text-ink/50">CV</dt>
                          <dd className="truncate text-ink/70">
                            {app.cvFilename ?? "Attached"}
                          </dd>
                        </div>
                      </dl>

                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Cover Letter
                      </h4>
                      {app.coverLetter ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
                          {app.coverLetter}
                        </p>
                      ) : (
                        <p className="text-sm italic text-ink/35">None provided</p>
                      )}
                    </div>

                    {/* Status + notes */}
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Status
                      </h4>
                      <div className="mb-5 flex flex-wrap gap-1.5">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatus(app.id, s)}
                            disabled={busy === app.id || app.status === s}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-default ${
                              app.status === s
                                ? STATUS_STYLES[s]
                                : "border border-hairline bg-white text-ink/50 hover:text-ink"
                            }`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>

                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Notes
                      </h4>
                      <div className="mb-2 flex gap-2">
                        <input
                          type="text"
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddNote(app.id);
                            }
                          }}
                          placeholder="Add a note…"
                          className="h-9 flex-1 rounded-lg border border-hairline bg-white px-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddNote(app.id)}
                          disabled={busy === app.id || !noteDraft.trim()}
                          className="h-9 rounded-lg bg-ink px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                        >
                          Add
                        </button>
                      </div>

                      {app.notes.length === 0 ? (
                        <p className="text-sm italic text-ink/35">No notes yet</p>
                      ) : (
                        <ul className="flex flex-col gap-2">
                          {app.notes.map((note) => (
                            <li
                              key={note.id}
                              className="rounded-lg border border-hairline bg-white p-2.5"
                            >
                              <p className="text-sm text-ink/80">{note.content}</p>
                              <p className="mt-1 text-xs text-ink/40">
                                {note.author.name} ·{" "}
                                {format(new Date(note.createdAt), "MMM d, HH:mm")}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
