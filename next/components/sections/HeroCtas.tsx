"use client";

import Link from "next/link";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_URL, SHOW_PHONE_CONTACT } from "@/lib/contact";
import { trackWhatsAppClick, trackGetStartedClick } from "@/lib/gtag";
import type { Dictionary } from "@/dictionaries";

interface HeroCtasProps {
  locale: string;
  dict: Dictionary;
}

/** Client island: the hero itself stays a server component, but these two
 *  buttons need click handlers for the GA hits. */
export default function HeroCtas({ locale, dict }: HeroCtasProps) {
  const h = dict.hero;

  return (
    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      {SHOW_PHONE_CONTACT && (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("hero")}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-whatsapp/25 transition hover:-translate-y-0.5 hover:bg-whatsapp-dark sm:w-auto sm:text-base"
      >
        <WhatsAppIcon className="h-5 w-5" />
        {h.ctaWhatsapp}
      </a>
      )}

      <Link
        href={`/${locale}/contact`}
        onClick={() => trackGetStartedClick("hero")}
        className="inline-flex w-full items-center justify-center rounded-full bg-ink-soft px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:text-base"
      >
        {h.ctaPreRegister}
      </Link>
    </div>
  );
}
