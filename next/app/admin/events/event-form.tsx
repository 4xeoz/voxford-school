"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/actions/events";
import { toast } from "sonner";

interface EventData {
  id?: string;
  name?: string;
  description?: string;
  location?: string;
  date?: Date | string;
  imageUrl?: string | null;
}

function toDatetimeLocal(date: Date | string | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  // Format: YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({ event }: { event?: EventData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEdit = !!event?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateEvent(event!.id!, formData)
      : await createEvent(formData);

    setSaving(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? "Event updated" : "Event created");

    if (!isEdit && "id" in result) {
      router.push(`/admin/events/${result.id}`);
    } else {
      router.push("/admin/events");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-[#e5e0d5] bg-white px-4 py-2.5 text-sm text-[#0a1628] placeholder:text-[#0a1628]/35 focus:border-[#0a1628] focus:outline-none transition-colors";
  const labelCls = "block mb-1.5 text-sm font-medium text-[#0a1628]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <div>
        <label className={labelCls}>
          Event Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          defaultValue={event?.name ?? ""}
          placeholder="e.g. UK Study Fair Algiers 2026"
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
          defaultValue={event?.description ?? ""}
          placeholder="Describe the event, what attendees can expect, speakers, agenda..."
          required
          rows={5}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Location */}
      <div>
        <label className={labelCls}>
          Location <span className="text-red-500">*</span>
        </label>
        <input
          name="location"
          type="text"
          defaultValue={event?.location ?? ""}
          placeholder="e.g. Algiers Convention Centre, Palais des Expositions"
          required
          className={inputCls}
        />
      </div>

      {/* Date & Time */}
      <div>
        <label className={labelCls}>
          Date &amp; Time <span className="text-red-500">*</span>
        </label>
        <input
          name="date"
          type="datetime-local"
          defaultValue={toDatetimeLocal(event?.date)}
          required
          className={inputCls}
        />
      </div>

      {/* Image URL */}
      <div>
        <label className={labelCls}>
          Image URL <span className="text-[#0a1628]/35 font-normal">(optional)</span>
        </label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={event?.imageUrl ?? ""}
          placeholder="https://example.com/event-image.jpg"
          className={inputCls}
        />
        <p className="mt-1 text-xs text-[#0a1628]/40">
          Link to an image that will be shown on the event page and upcoming events section.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#0a1628] px-5 text-sm font-semibold text-white transition-opacity disabled:opacity-60 hover:opacity-90"
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
            "Create Event"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 items-center rounded-lg border border-[#e5e0d5] bg-white px-5 text-sm font-medium text-[#0a1628]/70 transition-colors hover:text-[#0a1628]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
