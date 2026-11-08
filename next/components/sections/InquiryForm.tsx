"use client";

import { useState, type FormEvent } from "react";
import { submitContactForm } from "@/actions/contact";
import { trackContactFormSubmit } from "@/lib/gtag";
import { contentFor } from "@/lib/open-site-content";
import { isProgrammeInterest, type ProgrammeInterest } from "@/lib/programme-interests";

export default function InquiryForm({ locale, source = "website", initialLanguage = "", initialProgrammeInterest, audienceContext }: { locale: string; source?: string; initialLanguage?: string; initialProgrammeInterest?: ProgrammeInterest; audienceContext?: string }) {
  const c = contentFor(locale);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState(initialLanguage === "English" || initialLanguage === "French" ? initialLanguage : "");
  const [programmeInterest, setProgrammeInterest] = useState<ProgrammeInterest | "">(initialProgrammeInterest ?? "");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const message = [`Source: ${source}`, audienceContext ? `Audience: ${audienceContext}` : ""].filter(Boolean).join("\n");
      const result = await submitContactForm({ name, phone, studyField: language, programmeInterest: programmeInterest || undefined, message, website });
      if (!result.success) throw new Error(result.message);
      trackContactFormSubmit(source, language);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="open-form-success rounded-[1.75rem] border border-white/20 bg-white p-7 text-[#232122] shadow-2xl sm:p-10">
        <span aria-hidden className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d51b0c] text-2xl text-white">✓</span>
        <h3 className="text-2xl font-black">{c.formSuccess}</h3>
        <p className="mt-2 text-[#5d5554]">{c.formSuccessBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[1.75rem] border border-white/20 bg-white p-6 text-[#232122] shadow-[0_25px_70px_rgba(63,0,0,.23)] sm:p-9" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          <span>{c.formName}</span>
          <input className="mt-2 h-13 w-full rounded-xl border border-[#d9d3d0] bg-[#faf8f6] px-4 py-3 text-base outline-none transition focus:border-[#c50e02] focus:ring-2 focus:ring-[#c50e02]/20" type="text" autoComplete="name" name="name" minLength={2} maxLength={100} required value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label className="block text-sm font-bold">
          <span>{c.formPhone}</span>
          <input className="mt-2 h-13 w-full rounded-xl border border-[#d9d3d0] bg-[#faf8f6] px-4 py-3 text-base outline-none transition focus:border-[#c50e02] focus:ring-2 focus:ring-[#c50e02]/20" type="tel" autoComplete="tel" inputMode="tel" name="phone" minLength={6} maxLength={24} required value={phone} onChange={e => setPhone(e.target.value)} />
        </label>
      </div>
      <label className="mt-4 block text-sm font-bold">
        <span>{c.formLanguage}</span>
        <select className="mt-2 w-full rounded-xl border border-[#d9d3d0] bg-[#faf8f6] px-4 py-3 text-base outline-none transition focus:border-[#c50e02] focus:ring-2 focus:ring-[#c50e02]/20" name="language" required value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="" disabled>{c.formLanguage}</option>
          <option value="English">{c.formEnglish}</option>
          <option value="French">{c.formFrench}</option>
          <option value="Other enquiry">{c.formOther}</option>
        </select>
      </label>
      <label className="mt-4 block text-sm font-bold">
        <span>{c.formProgramme}</span>
        <select className="mt-2 w-full rounded-xl border border-[#d9d3d0] bg-[#faf8f6] px-4 py-3 text-base outline-none transition focus:border-[#c50e02] focus:ring-2 focus:ring-[#c50e02]/20" name="programmeInterest" required value={programmeInterest} onChange={e => { if (isProgrammeInterest(e.target.value)) setProgrammeInterest(e.target.value); }}>
          <option value="" disabled>{c.formProgramme}</option>
          <option value="language-classes">{c.formProgrammeClasses}</option>
          <option value="holiday-study-trip">{c.formProgrammeTrip}</option>
          <option value="study-abroad-enquiry">{c.formProgrammeStudyAbroad}</option>
          <option value="classes-and-trip">{c.formProgrammeBoth}</option>
          <option value="help-me-choose">{c.formProgrammeUnsure}</option>
        </select>
      </label>
      <div className="absolute -left-[10000px]" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label></div>
      <button disabled={status === "sending"} className="mt-5 w-full rounded-xl bg-[#c91608] px-6 py-4 text-base font-black text-white transition hover:bg-[#9f1209] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c91608] disabled:opacity-60" type="submit">{status === "sending" ? c.formSending : c.formSubmit} <span aria-hidden>↗</span></button>
      {status === "error" && <p role="alert" className="mt-3 text-sm font-semibold text-[#b21a0e]">{c.formError}</p>}
      <p className="mt-4 text-center text-xs leading-relaxed text-[#6d6663]">{c.formPrivacy}</p>
    </form>
  );
}
