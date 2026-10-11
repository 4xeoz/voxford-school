"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Clock, CheckCircle, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  WHATSAPP_URL,
  SHOW_PHONE_CONTACT,
  LANGUAGES,
  START_DATES,
} from "@/lib/contact";
import { submitContactForm } from "@/actions/contact";
import {
  trackContactFormSubmit,
  trackPhoneCall,
  trackEmailClick,
  trackWhatsAppClick,
} from "@/lib/gtag";
import Navbar from "@/components/layout/Navbar";
import type { Dictionary } from "@/dictionaries";
import footerLogo from "@/public/voxbridge/icon-detailed-red-on-whiteBackground-v2.png";
import PrivacyLink from "@/components/layout/PrivacyLink";

// ─── Constants ────────────────────────────────────────────────────────────────






// ─── Icons ────────────────────────────────────────────────────────────────────

// ─── Shared field styles (white-bg context) ───────────────────────────────────

const fieldClass =
  "w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all";

const selectClass =
  "w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all appearance-none cursor-pointer";

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  dict: Dictionary;
  locale: string;
}

export default function ContactPageClient({ dict, locale }: Props) {
  const f = dict.footer;

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
    <div className="min-h-screen bg-ink text-white flex flex-col">
      <Navbar locale={locale} dict={dict} />

      {/* ── Hero / main content ── */}
      <main className="flex-1 w-full">

        {/* Top hero section */}
        <div className="relative overflow-hidden px-4 pt-24 pb-12 md:pt-32 md:pb-16">
          {/* Radial glow */}
          <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* ── LEFT: Value proposition ── */}
              <div className="flex flex-col gap-5 order-2 lg:order-1">

                {/* Back link */}
                <Link
                  href={`/${locale}`}
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors w-fit"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {dict.nav.home}
                </Link>

                {/* Urgency badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                    <span className="text-brand text-sm font-semibold">{f.urgencyBadge}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/55 text-sm">{f.advisorsOnline}</span>
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
                    {f.consultationHeadline.split(" ").slice(0, -2).join(" ")}{" "}
                    <span className="text-brand">
                      {f.consultationHeadline.split(" ").slice(-2).join(" ")}
                    </span>
                  </h1>
                  <p className="mt-3 text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">
                    {f.consultationSubhead}
                  </p>
                </div>

                {/* Benefits */}
                <ul className="flex flex-col gap-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15">
                        <svg viewBox="0 0 12 10" fill="none" className="h-3 w-3">
                          <path d="M1 5l3.5 3.5L11 1" stroke="#BC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-white/80 text-sm sm:text-base">{b}</span>
                    </li>
                  ))}
                </ul>


                {/* WhatsApp CTA + phones — hidden until the school has a line
                    to answer. See SHOW_PHONE_CONTACT in lib/contact.ts. */}
                {SHOW_PHONE_CONTACT && (<>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("contact")}
                  className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-whatsapp text-white font-bold text-base hover:bg-whatsapp-dark active:scale-[0.98] transition-all shadow-lg shadow-whatsapp/20"
                >
                  <WhatsAppIcon className="h-6 w-6" />
                  {f.whatsappCta}
                </a>

                {/* Phones */}
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
              <div className="order-1 lg:order-2 flex flex-col gap-4">
                <div className="relative rounded-3xl bg-white shadow-2xl shadow-black/40 overflow-hidden">
                  {/* Gold accent bar */}
                  <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-brand via-brand-bright to-brand-dark" />

                  <div className="p-6 sm:p-8 md:p-10">
                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mb-7">
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

                    <AnimatePresence mode="wait">

                      {/* STEP 1 */}
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
                            <h2 className="text-2xl font-black text-ink">
                              {f.consultationHeadline.split(" ").slice(0, 3).join(" ")}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                              {f.consultationSubhead.split(".")[0]}.
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
                          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 text-center">
                            <Lock className="h-3 w-3" />
                            {f.trustNote}
                          </p>
                        </motion.form>
                      )}

                      {/* STEP 2 */}
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
                            <h2 className="text-2xl font-black text-ink">Almost there! 🚀</h2>
                            <p className="text-gray-500 text-sm mt-1">
                              Two quick questions and we&apos;ll match you with the right advisor.
                            </p>
                          </div>

                          <div className="relative">
                            <select
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              required
                              className={`${selectClass} ${!formData.country ? "text-gray-400" : "text-gray-900"}`}
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

                          <div className="relative">
                            <select
                              value={formData.startDate}
                              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                              required
                              className={`${selectClass} ${!formData.startDate ? "text-gray-400" : "text-gray-900"}`}
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
                            className="w-full rounded-full bg-ink text-white font-bold text-base hover:bg-ink-muted active:scale-[0.98] transition-all shadow-lg py-3.5 disabled:opacity-60"
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

                      {/* DONE */}
                      {step === "done" && (
                        <motion.div
                          key="done"
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex flex-col items-center gap-5 py-6 text-center"
                        >
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                            <CheckCircle className="h-11 w-11 text-green-500" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-ink">{f.thankYouTitle}</h2>
                            <p className="text-gray-500 text-base mt-2 max-w-xs">{f.thankYouDesc}</p>
                          </div>
                          {SHOW_PHONE_CONTACT && (<a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackWhatsAppClick("contact-success")}
                            className="flex w-full items-center justify-center gap-3 h-14 rounded-2xl bg-whatsapp text-white font-bold text-base hover:bg-whatsapp-dark transition-colors shadow-lg shadow-whatsapp/20"
                          >
                            <WhatsAppIcon className="h-6 w-6" />
                            {f.thankYouWhatsapp}
                          </a>)}
                          <button
                            onClick={() => { setStep(1); setFormData({ name: "", phone: "", country: "", startDate: "" }); }}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            Send another request
                          </button>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </div>

                {/* Trust micro-signals */}
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
        </div>

        {/* Location block removed — the school has not opened yet. */}

      </main>

      {/* ── Slim page footer ── */}
      <footer className="">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-white/35">
            &copy; {new Date().getFullYear()} {f.copyright}
          </p>
          <div className="flex items-center gap-5">
            <Link href={`/${locale}`} className="text-white/35 hover:text-white/70 transition-colors">
              {dict.nav.home}
            </Link>
            <PrivacyLink locale={locale} className="text-white/35 hover:text-white/70 transition-colors" />
            <Link href="/admin/login" className="text-white/20 hover:text-white/40 transition-colors text-xs">
              {f.adminLogin}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
