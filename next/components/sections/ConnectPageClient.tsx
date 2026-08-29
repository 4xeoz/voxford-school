"use client";

import { useEffect } from "react";
import Image from "next/image";
import { MapPin, Mail } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_URL, CONNECT_PHONE, CONTACT_EMAIL, MAPS_DIRECTIONS } from "@/lib/contact";
import { trackWhatsAppClick, trackPhoneCall, trackEmailClick } from "@/lib/gtag";
import { trackEvent } from "@/lib/track";
import type { Dictionary } from "@/dictionaries";
import logo from "@/public/voxbridge/icon-detailed-red-on-whiteBackground-v2.png";

const PAGE = "connect";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.187.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 00.417-1.187L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

export default function ConnectPageClient({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: string;
}) {
  const t = dict.connect;

  useEffect(() => {
    trackEvent(PAGE, "PAGE_VIEW", locale);
  }, [locale]);

  function handleWhatsApp() {
    trackEvent(PAGE, "WHATSAPP_CLICK", locale);
    trackWhatsAppClick("connect");
  }

  function handleCall() {
    trackEvent(PAGE, "CALL_CLICK", locale);
    trackPhoneCall(CONNECT_PHONE.tel);
  }

  function handleDirections() {
    trackEvent(PAGE, "LOCATION_CLICK", locale);
  }

  function handleEmail() {
    trackEvent(PAGE, "EMAIL_CLICK", locale);
    trackEmailClick();
  }

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex min-h-dvh flex-col items-center bg-surface-soft px-5 pb-10 pt-12 sm:justify-center sm:py-16"
    >
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src={logo}
            alt="Voxbridge Language School"
            width={64}
            height={64}
            className="mb-4 h-16 w-16 rounded-2xl shadow-sm"
            priority
          />
          <h1 className="text-2xl font-bold text-ink">{t.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-subtle">{t.subtitle}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsApp}
            className="flex items-center gap-4 rounded-2xl bg-whatsapp px-5 py-4 text-white shadow-lg shadow-whatsapp/25 transition active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1 text-start">
              <span className="block text-base font-semibold">{t.whatsapp}</span>
              <span className="block text-xs text-white/80">{t.whatsappHint}</span>
            </span>
          </a>

          <a
            href={`tel:${CONNECT_PHONE.tel}`}
            onClick={handleCall}
            className="flex items-center gap-4 rounded-2xl bg-ink px-5 py-4 text-white shadow-lg shadow-ink/20 transition active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
              <PhoneIcon className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1 text-start">
              <span className="block text-base font-semibold">{t.call}</span>
              <span className="block text-xs text-white/70" dir="ltr">
                {CONNECT_PHONE.display} · {t.callHint}
              </span>
            </span>
          </a>

          <a
            href={MAPS_DIRECTIONS}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDirections}
            className="flex items-center gap-4 rounded-2xl border border-hairline bg-white px-5 py-4 text-ink shadow-sm transition active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <MapPin className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1 text-start">
              <span className="block text-base font-semibold">{t.directions}</span>
              <span className="block text-xs text-subtle">{t.directionsHint}</span>
            </span>
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={handleEmail}
            className="flex items-center gap-4 rounded-2xl border border-hairline bg-white px-5 py-4 text-ink shadow-sm transition active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-wisp text-ink">
              <Mail className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1 text-start">
              <span className="block text-base font-semibold">{t.email}</span>
              <span className="block truncate text-xs text-subtle" dir="ltr">
                {CONTACT_EMAIL} · {t.emailHint}
              </span>
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
