"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Phone, CheckCircle, Lock, Clock } from "lucide-react";
import { toast } from "sonner";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  WHATSAPP_URL,
  SHOW_PHONE_CONTACT,
  LANGUAGES,
  START_DATES,
} from "@/lib/contact";
import footerLogo from "@/public/voxbridge/icon-detailed-red-on-whiteBackground-v2.png";
import footerLogoWatermark from "@/public/voxbridge/icon-detailed-white-transparent-v2.png";
import { submitContactForm } from "@/actions/contact";
import type { Dictionary } from "@/dictionaries";
import {
  trackContactFormSubmit,
  trackPhoneCall,
  trackWhatsAppClick,
} from "@/lib/gtag";

// ─── Constants ────────────────────────────────────────────────────────────────


// Roadmap view (5e0), not satellite (5e1)




// ─── Icons ────────────────────────────────────────────────────────────────────

// ─── Field styles for the white card ─────────────────────────────────────────

const fieldClass =
  "w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all";

const selectFieldClass =
  "w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all appearance-none cursor-pointer";

// ─── Main component ───────────────────────────────────────────────────────────

/** Size of the founding intake. The one number to change if the cap moves. */
const FOUNDING_PLACES = 100;

/**
 * Below this many real sign-ups the strip shows the cap instead of the count —
 * "4 of 100 claimed" reads as nobody wants it, which is worse than saying
 * nothing. Above it, the real number does the persuading.
 */
const COUNT_VISIBLE_FROM = 25;

interface FooterSectionProps {
  dict: Dictionary;
  locale?: string;
  /** Real pre-registration count, from getPreRegistrationCount(). */
  claimed?: number;
}

export default function FooterSection({ dict, locale = "en", claimed = 0 }: FooterSectionProps) {
  const f = dict.footer;
  const showCount = claimed >= COUNT_VISIBLE_FROM;

  const [step, setStep] = useState<1 | 2 | "done">(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    startDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitContactForm({
      name: formData.name,
      phone: formData.phone,
      country: formData.country,
      startDate: formData.startDate,
    });
    if (result.success) {
      trackContactFormSubmit("General Inquiry", formData.country);
      setStep("done");
    } else {
      toast.error(f.messageFailed, { description: result.message });
    }
    setIsSubmitting(false);
  }

  const benefits = [f.benefit1, f.benefit2, f.benefit3];

  return (
    <footer id="contact" className="relative w-full bg-ink text-white overflow-hidden">

      {/* ══════════════════════════════════════════════════════════════
          STRIP — scarcity. Shows a real count only once it is genuinely
          persuasive; below that it states the cap, which is true from
          day one and needs no number.
          ══════════════════════════════════════════════════════════════ */}
      <div className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-center sm:gap-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-bright">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-bright" />
            {f.foundingBadge}
          </span>

          {showCount ? (
            <div className="flex w-full max-w-md items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.min(100, (claimed / FOUNDING_PLACES) * 100)}%` }}
                />
              </div>
              <span className="shrink-0 text-sm text-white/70">
                {f.placesClaimed
                  .replace("{n}", String(claimed))
                  .replace("{cap}", String(FOUNDING_PLACES))}
              </span>
            </div>
          ) : (
            <span className="text-sm text-white/70">
              {f.placesLimited.replace("{cap}", String(FOUNDING_PLACES))}
            </span>
          )}
        </div>
      </div>

      {/* Decorative radial glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand/5 blur-3xl" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — CTA hero: value prop (left) + form card (right)
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Value proposition ── */}
          <div className="flex flex-col gap-5 sm:gap-6">

            {/* Anticipation, not readiness: the school has not opened, and
                being early is the thing on offer. */}
            <p className="text-lg font-bold text-white sm:text-xl">
              {f.builtNotOpen}{" "}
              <span className="text-brand-bright">{f.builtNotOpenLine2}</span>
            </p>

            {/* Headline */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
                {f.consultationHeadline.split(" ").slice(0, -2).join(" ")}{" "}
                <span className="text-brand">
                  {f.consultationHeadline.split(" ").slice(-2).join(" ")}
                </span>
              </h2>
              <p className="mt-3 text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">
                {f.consultationSubhead}
              </p>
            </div>

            {/* Benefits list */}
            <ul className="flex flex-col gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <svg viewBox="0 0 12 10" fill="none" className="h-3 w-3">
                      <path d="M1 5l3.5 3.5L11 1" stroke="#BC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-white/80 text-sm sm:text-base">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA + phone numbers — hidden until the school has a
                line to answer. See SHOW_PHONE_CONTACT in lib/contact.ts. */}
            {SHOW_PHONE_CONTACT && (<>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("footer")}
              className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-whatsapp text-white font-bold text-base hover:bg-whatsapp-dark active:scale-[0.98] transition-all shadow-lg shadow-whatsapp/20"
            >
              <WhatsAppIcon className="h-6 w-6" />
              {f.whatsappCta}
            </a>

            {/* Phone numbers */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+213560409193"
                onClick={() => trackPhoneCall("0560409193")}
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/[0.07] border border-white/10 text-sm font-medium hover:bg-white/[0.14] active:scale-[0.98] transition-all"
              >
                <Phone className="h-4 w-4 text-brand shrink-0" />
                0560 409 193
              </a>
              <a
                href="tel:+213560409195"
                onClick={() => trackPhoneCall("0560409195")}
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/[0.07] border border-white/10 text-sm font-medium hover:bg-white/[0.14] active:scale-[0.98] transition-all"
              >
                <Phone className="h-4 w-4 text-brand shrink-0" />
                0560 409 195
              </a>
            </div>
            </>)}
          </div>

          {/* ── RIGHT: White form card ── */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-3xl bg-white shadow-2xl shadow-black/30 overflow-hidden">
              {/* Gold top accent bar */}
              <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-brand via-brand-bright to-brand-dark" />

              <div className="p-6 sm:p-8">
                {/* Step progress indicator */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 flex gap-2">
                    <div className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${step === 1 || step === 2 || step === "done" ? "bg-brand" : "bg-gray-100"}`} />
                    <div className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${step === 2 || step === "done" ? "bg-brand" : "bg-gray-100"}`} />
                  </div>
                  <span className="text-gray-400 text-xs font-medium shrink-0">
                    {step === "done"
                      ? "✓ Done"
                      : `${f.stepStart} · ${step} ${f.stepOf} 2`}
                  </span>
                </div>

                {/* Animated form steps */}
                <AnimatePresence mode="wait">

                  {/* STEP 1: Name + WhatsApp */}
                  {step === 1 && (
                    <motion.form
                      key="step-1"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onSubmit={handleStep1}
                      className="flex flex-col gap-4"
                    >
                      <div>
                        <h3 className="text-xl font-black text-ink">
                          {f.consultationHeadline.split(" ").slice(0, 3).join(" ")}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          Free level test · No commitment
                        </p>
                      </div>

                      <input
                        type="text"
                        placeholder={f.yourName}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className={fieldClass}
                      />
                      <input
                        type="tel"
                        placeholder={f.whatsappPlaceholder}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className={fieldClass}
                      />

                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full rounded-full bg-brand text-ink font-bold text-base hover:bg-brand-dark active:scale-[0.98] transition-all shadow-lg shadow-brand/25 py-3.5"
                      >
                        {f.continueStep}
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                        <Lock className="h-3 w-3" />
                        {f.trustNote}
                      </p>
                    </motion.form>
                  )}

                  {/* STEP 2: Destination + Start date */}
                  {step === 2 && (
                    <motion.form
                      key="step-2"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                    >
                      <div>
                        <h3 className="text-xl font-black text-ink">Almost there! 🚀</h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          Two quick questions, then we&apos;re done.
                        </p>
                      </div>

                      {/* Destination country */}
                      <div className="relative">
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                          className={`${selectFieldClass} ${!formData.country ? "text-gray-400" : "text-gray-900"}`}
                        >
                          <option value="" disabled>{f.destinationPlaceholder}</option>
                          {LANGUAGES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Start date */}
                      <div className="relative">
                        <select
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          required
                          className={`${selectFieldClass} ${!formData.startDate ? "text-gray-400" : "text-gray-900"}`}
                        >
                          <option value="" disabled>{f.startDatePlaceholder}</option>
                          {START_DATES.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className=" w-full rounded-full bg-ink text-white font-bold text-base hover:bg-ink-muted active:scale-[0.98] transition-all shadow-lg py-3.5 disabled:opacity-60"
                      >
                        {isSubmitting ? f.sending : f.primaryCta}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f.backStep}
                      </button>
                    </motion.form>
                  )}

                  {/* DONE: Success state */}
                  {step === "done" && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col items-center gap-4 py-4 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle className="h-9 w-9 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-ink">{f.thankYouTitle}</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs">{f.thankYouDesc}</p>
                      </div>
                      {SHOW_PHONE_CONTACT && (<a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick("footer-success")}
                        className="flex w-full items-center justify-center gap-2.5 h-12 rounded-2xl bg-whatsapp text-white font-bold text-sm hover:bg-whatsapp-dark transition-colors shadow-lg shadow-whatsapp/20"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                        {f.thankYouWhatsapp}
                      </a>)}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

            {/* Trust micro-signals below card */}
            <div className="flex items-center justify-center gap-5 text-white/35 text-xs">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                {f.trustSecure}
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {f.responseTime}
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span>{f.trustNoPayment}</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2 — Map + contact details: hidden until the school opens.
          Restore by re-rendering <LocationBlock /> (kept in git history). */}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — Bottom nav bar
          ══════════════════════════════════════════════════════════════ */}
      <div className="">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src={footerLogo} alt="Voxbridge" width={28} height={28} className="rounded-md opacity-70" />
            <p className="text-white/35 text-sm">&copy; {new Date().getFullYear()} {f.copyright}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link href={`/${locale}`} className="text-white/40 hover:text-white/70 transition-colors">{dict.nav.home}</Link>
            <Link href={`/${locale}/blog`} className="text-white/40 hover:text-white/70 transition-colors">{dict.nav.blog}</Link>
            <Link href="/admin/login" className="text-white/20 hover:text-white/40 transition-colors text-xs">{f.adminLogin}</Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — Logo watermark
          ══════════════════════════════════════════════════════════════ */}
      <div className="w-full px-4 py-8 md:py-12 flex justify-center">
        <Image
          src={footerLogoWatermark}
          alt=""
          aria-hidden
          width={513}
          height={513}
          className="h-32 w-auto md:h-48 opacity-[0.07]"
        />
      </div>

    </footer>
  );
}
