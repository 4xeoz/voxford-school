"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { requestCvUploadUrl, submitApplication } from "@/actions/applications";
import type { CareersLabels } from "@/lib/careers-i18n";
import WilayaSelect from "../../wilaya-select";

const MAX_CV_BYTES = 5 * 1024 * 1024;

const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ApplyClient({
  locale,
  labels,
  jobId,
  jobTitle,
  jobSlug,
}: {
  locale: string;
  labels: CareersLabels;
  jobId: string;
  jobTitle: string;
  jobSlug: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<"idle" | "uploading" | "submitting">("idle");
  const [done, setDone] = useState(false);

  const busy = phase !== "idle";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) {
      setFile(null);
      return;
    }

    if (!ACCEPTED.includes(picked.type)) {
      toast.error("Please choose a PDF or Word document.");
      e.target.value = "";
      setFile(null);
      return;
    }

    if (picked.size > MAX_CV_BYTES) {
      toast.error("Your CV must be smaller than 5MB.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(picked);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      toast.error("Please attach your CV.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    // 1. Ask the server where this file may go. It checks the job is still
    //    open and that the claimed type and size are plausible.
    setPhase("uploading");
    const signed = await requestCvUploadUrl(jobId, file.type, file.size);

    if ("error" in signed) {
      setPhase("idle");
      toast.error(signed.error);
      return;
    }

    // 2. PUT the file straight to storage, bypassing the server entirely —
    //    server actions cap request bodies at 1MB and Vercel at 4.5MB.
    try {
      const upload = await fetch(signed.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!upload.ok) throw new Error(`Upload failed (${upload.status})`);
    } catch {
      setPhase("idle");
      toast.error("Your CV failed to upload. Please try again.");
      return;
    }

    // 3. Record the application. The server re-reads the object's real size
    //    and type from storage before accepting it.
    setPhase("submitting");
    formData.set("cvPath", signed.objectPath);
    formData.set("cvFilename", file.name);

    const result = await submitApplication(jobId, formData);
    setPhase("idle");

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-emerald-50/40 px-6 py-10 text-center shadow-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-lg">
          <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink-soft">{labels.applied}</h2>
          <p className="mt-2 text-sm text-ink-soft/60">{labels.appliedNote}</p>
        </div>
        <Link
          href={`/${locale}/careers`}
          className="mt-2 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-bold text-white transition hover:bg-brand/90"
        >
          {labels.backToJobs}
        </Link>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
  const labelCls = "mb-1.5 block text-sm font-medium text-ink";
  const req = <span className="text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Honeypot — hidden from humans, irresistible to naive bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{labels.firstName} {req}</label>
          <input
            name="firstName"
            type="text"
            required
            disabled={busy}
            autoComplete="given-name"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>{labels.lastName} {req}</label>
          <input
            name="lastName"
            type="text"
            required
            disabled={busy}
            autoComplete="family-name"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{labels.email} {req}</label>
          <input
            name="email"
            type="email"
            required
            disabled={busy}
            autoComplete="email"
            placeholder="you@example.com"
            className={`${inputCls} placeholder:text-ink/35`}
          />
        </div>
        <div>
          <label className={labelCls}>{labels.phone} {req}</label>
          <input
            name="phone"
            type="tel"
            required
            disabled={busy}
            autoComplete="tel"
            placeholder="+213 555 123 456"
            className={`${inputCls} placeholder:text-ink/35`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{labels.wilaya} {req}</label>
          <WilayaSelect
            locale={locale}
            placeholder={labels.selectWilaya}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>
            {labels.city}{" "}
            <span className="font-normal text-ink/35">({labels.optional})</span>
          </label>
          <input
            name="city"
            type="text"
            disabled={busy}
            autoComplete="address-level2"
            className={inputCls}
          />
        </div>
      </div>

      {/* CV */}
      <div>
        <label className={labelCls}>{labels.cv} {req}</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFile}
          required
          disabled={busy}
          className="w-full cursor-pointer rounded-xl border border-dashed border-hairline bg-surface-soft/40 px-4 py-4 text-sm text-ink/70 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:border-brand/50"
        />
        <p className="mt-1.5 text-xs text-ink-soft/45">{labels.cvHint}</p>
      </div>

      {/* Cover letter */}
      <div>
        <label className={labelCls}>
          {labels.coverLetter}{" "}
          <span className="font-normal text-ink/35">({labels.optional})</span>
        </label>
        <textarea
          name="coverLetter"
          rows={7}
          disabled={busy}
          placeholder={labels.coverLetterHint}
          className={`${inputCls} resize-y placeholder:text-ink/35`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy || !file}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-8 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand/90 disabled:opacity-50 disabled:shadow-none"
        >
          {busy && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {phase === "uploading"
            ? labels.uploading
            : phase === "submitting"
              ? labels.submitting
              : labels.submitApplication}
        </button>

        <Link
          href={`/${locale}/careers/${jobSlug}`}
          className="text-sm font-medium text-ink-soft/50 transition hover:text-ink-soft"
        >
          {jobTitle}
        </Link>
      </div>
    </form>
  );
}
