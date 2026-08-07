"use client";

import { useState } from "react";
import { registerForEvent } from "@/actions/events";
import { toast } from "sonner";

interface Props {
  eventId: string;
}

export default function RegisterClient({ eventId }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerForEvent(eventId, formData);

    setLoading(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 px-5 py-8 text-center shadow-md border border-emerald-200/50">
        {/* Checkmark */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-lg">
          <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0a1628]">✓ You&apos;re Registered!</h3>
          <p className="mt-2 text-[#0a1628]/70 text-xs">
            We've sent you a confirmation. See you at the event!
          </p>
        </div>

        {/* Quick contact links */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <a
            href="https://wa.me/447879003218"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-[#1a9f4b] font-medium text-xs hover:text-[#0d7d3a] transition-colors"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-[#e5e0d5] bg-[#f5f0e8]/40 px-4 py-3 text-sm text-[#0a1628] placeholder:text-[#0a1628]/35 focus:border-[#0a1628] focus:bg-white focus:outline-none transition-colors";
  const labelCls = "block mb-1.5 text-sm font-medium text-[#0a1628]";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#d4a84b]/15 to-[#d4a84b]/5 border-2 border-[#d4a84b]/50 p-5 shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-black text-[#0a1628]">Join Us! 🎓</h2>
        <p className="text-xs text-[#0a1628]/60 mt-1">
          Register now to secure your spot
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Full name */}
        <div>
          <label className="block mb-1 text-xs font-medium text-[#0a1628]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-lg border border-[#e5e0d5] bg-[#f5f0e8]/40 px-3 py-2 text-xs text-[#0a1628] placeholder:text-[#0a1628]/35 focus:border-[#0a1628] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-xs font-medium text-[#0a1628]">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="+213 555 123 456"
            className="w-full rounded-lg border border-[#e5e0d5] bg-[#f5f0e8]/40 px-3 py-2 text-xs text-[#0a1628] placeholder:text-[#0a1628]/35 focus:border-[#0a1628] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-xs font-medium text-[#0a1628]">Email <span className="text-[#0a1628]/35">(optional)</span></label>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-lg border border-[#e5e0d5] bg-[#f5f0e8]/40 px-3 py-2 text-xs text-[#0a1628] placeholder:text-[#0a1628]/35 focus:border-[#0a1628] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#d4a84b] to-[#c49a3d] text-xs font-bold text-white hover:from-[#c49a3d] hover:to-[#b8883d] active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-[#d4a84b]/30 mt-2"
        >
          {loading ? (
            <>
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Registering…
            </>
          ) : (
            "Register Now"
          )}
        </button>
      </form>
    </div>
  );
}
