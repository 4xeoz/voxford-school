import Link from "next/link";
import PrivacyLink from "./PrivacyLink";
import InquiryForm from "@/components/sections/InquiryForm";
import { contentFor } from "@/lib/open-site-content";
import type { Dictionary } from "@/dictionaries";
import BrandLockup from "@/components/BrandLockup";

export default function OpenFooter({ locale, dict }: { locale: string; dict: Dictionary }) {
  const c = contentFor(locale);
  return <footer id="contact" className="relative overflow-hidden bg-[#b71208] text-white" dir={locale === "ar" ? "rtl" : "ltr"}>
    <div aria-hidden className="open-mark-pattern absolute inset-0 opacity-[.065]" />
    <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:py-32">
      <div>
        <p className="text-sm font-black uppercase tracking-[.18em] text-white/70">{c.formEyebrow}</p>
        <h2 className="mt-5 max-w-[11ch] text-[clamp(2.7rem,5vw,5rem)] font-black leading-[1.05] [text-wrap:balance]">{c.formTitle}</h2>
        <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-white/75">{c.formLead}</p>
        <div aria-hidden className="mt-12 flex gap-2"><span className="h-3 w-20 rounded-full bg-white" /><span className="h-3 w-10 rounded-full bg-white/60" /><span className="h-3 w-5 rounded-full bg-white/30" /></div>
      </div>
      <InquiryForm locale={locale} source="home-footer" />
    </div>
    <div className="relative border-t border-white/20 bg-[#8e0d06]/80">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href={`/${locale}`}><BrandLockup light compact /></Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-white/75">
          <Link href={`/${locale}`}>{dict.nav.home}</Link><Link href={`/${locale}/blog`}>{dict.nav.blog}</Link><Link href={`/${locale}/careers`}>{dict.nav.careers}</Link><PrivacyLink locale={locale} className="hover:text-white" />
        </div>
        <p className="text-xs text-white/55">© {new Date().getFullYear()} {dict.footer.copyright}</p>
      </div>
    </div>
  </footer>;
}
