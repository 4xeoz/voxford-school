"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob, updateJob } from "@/actions/careers";
import { toast } from "sonner";

interface JobData {
  id?: string;
  title?: string;
  department?: string | null;
  location?: string;
  employmentType?: string;
  description?: string;
  requirements?: string | null;
  salaryRange?: string | null;
  closesAt?: Date | string | null;
}

const EMPLOYMENT_OPTIONS = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

function toDateInput(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function JobForm({ job }: { job?: JobData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEdit = !!job?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateJob(job!.id!, formData)
      : await createJob(formData);

    setSaving(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? "Job updated" : "Job posted");

    if (!isEdit && "id" in result) {
      router.push(`/admin/careers/${result.id}`);
    } else {
      router.push("/admin/careers");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-hairline bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none transition-colors";
  const labelCls = "block mb-1.5 text-sm font-medium text-ink";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <label className={labelCls}>
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          type="text"
          defaultValue={job?.title ?? ""}
          placeholder="e.g. English Teacher (IELTS)"
          required
          className={inputCls}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Department */}
        <div>
          <label className={labelCls}>
            Department <span className="text-ink/35 font-normal">(optional)</span>
          </label>
          <input
            name="department"
            type="text"
            defaultValue={job?.department ?? ""}
            placeholder="e.g. Teaching"
            className={inputCls}
          />
        </div>

        {/* Employment type */}
        <div>
          <label className={labelCls}>Employment Type</label>
          <select
            name="employmentType"
            defaultValue={job?.employmentType ?? "FULL_TIME"}
            className={inputCls}
          >
            {EMPLOYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelCls}>
          Location <span className="text-red-500">*</span>
        </label>
        <input
          name="location"
          type="text"
          defaultValue={job?.location ?? ""}
          placeholder="e.g. M'Sila, Algeria"
          required
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          defaultValue={job?.description ?? ""}
          placeholder="What the role involves, who they'll work with, what a typical week looks like..."
          required
          rows={8}
          className={`${inputCls} resize-y`}
        />
        <p className="mt-1 text-xs text-ink/40">
          Blank lines start a new paragraph on the public page.
        </p>
      </div>

      {/* Requirements */}
      <div>
        <label className={labelCls}>
          Requirements <span className="text-ink/35 font-normal">(optional)</span>
        </label>
        <textarea
          name="requirements"
          defaultValue={job?.requirements ?? ""}
          placeholder={"Qualifications, experience, languages...\nOne per line."}
          rows={5}
          className={`${inputCls} resize-y`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Salary */}
        <div>
          <label className={labelCls}>
            Salary Range <span className="text-ink/35 font-normal">(optional)</span>
          </label>
          <input
            name="salaryRange"
            type="text"
            defaultValue={job?.salaryRange ?? ""}
            placeholder="e.g. 60,000 – 80,000 DZD / month"
            className={inputCls}
          />
        </div>

        {/* Closing date */}
        <div>
          <label className={labelCls}>
            Closing Date <span className="text-ink/35 font-normal">(optional)</span>
          </label>
          <input
            name="closesAt"
            type="date"
            defaultValue={toDateInput(job?.closesAt)}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-ink/40">
            After this date the posting stops accepting applications.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition-opacity disabled:opacity-60 hover:opacity-90"
        >
          {saving ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Post Job"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 items-center rounded-lg border border-hairline bg-white px-5 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
