"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import InquiryForm from "./InquiryForm";
import { MAPS_DIRECTIONS } from "@/lib/contact";
import { contentFor } from "@/lib/open-site-content";
import type { Dictionary } from "@/dictionaries";
import BrandLockup from "@/components/BrandLockup";

export default function OpenContactPage({ locale, dict, interest }: { locale: string; dict: Dictionary; interest?: string }) {
  const c = contentFor(locale);
  const courseLanguage = interest === "English" || interest === "French" ? interest : undefined;
  const initialProgrammeInterest = courseLanguage ? "language-classes" : interest === "trips" ? "holiday-study-trip" : undefined;
  return <div className="min-h-screen bg-[#fffdfa] text-[#242020]">
    <Navbar locale={locale} dict={dict} />
    <main className="relative isolate overflow-hidden bg-[#c91408] px-5 pb-20 pt-32 text-white sm:px-8 lg:pb-28 lg:pt-40" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div aria-hidden className="open-mark-pattern absolute inset-0 opacity-[.07]" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div>
          <Link href={`/${locale}`} className="text-sm font-semibold text-white/75 hover:text-white">← {dict.nav.home}</Link>
          <p className="mt-12 text-sm font-black uppercase tracking-[.18em] text-white/75">{c.formEyebrow}</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(2.9rem,5vw,5.4rem)] font-black leading-[1.04] [text-wrap:balance]">{c.formTitle}</h1>
          <p className="mt-7 max-w-[35rem] text-lg leading-relaxed text-white/80">{c.formLead}</p>
          <div className="mt-12 rounded-[1.5rem] border border-white/25 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[.18em] text-white/70">{c.placeEyebrow}</p>
            <p className="mt-3 text-xl font-bold">{c.address}</p>
            <a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#b71208] transition hover:-translate-y-1">{c.directions} ↗</a>
          </div>
        </div>
        <InquiryForm locale={locale} initialLanguage={courseLanguage} initialProgrammeInterest={initialProgrammeInterest} source={courseLanguage ? `course-${courseLanguage.toLowerCase()}` : interest === "trips" ? "trip-enquiry" : "contact-page"} />
      </div>
    </main>
    <footer className="flex flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8"><BrandLockup compact /><p className="text-sm text-[#6b625f]">© {new Date().getFullYear()} {dict.footer.copyright}</p></footer>
  </div>;
}
