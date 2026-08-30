"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { MapPin, Mail, ArrowLeft, ArrowRight, Share2, CheckCircle2, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_URL, CONNECT_PHONE, CONTACT_EMAIL, MAPS_DIRECTIONS } from "@/lib/contact";
import { trackWhatsAppClick, trackPhoneCall, trackEmailClick, trackFunnelStep, trackFunnelSubmit, trackShareClick } from "@/lib/gtag";
import { trackEvent } from "@/lib/track";
import { submitContactForm } from "@/actions/contact";
import type { Dictionary } from "@/dictionaries";
import logo from "@/public/voxbridge/icon-detailed-red-on-whiteBackground-v2.png";

const PAGE = "connect";

type Step = "gate" | "role" | "details" | "timing" | "success" | "all";
type Role = "English" | "French" | "German" | "Spanish";
type Timing = "Today" | "Tomorrow" | "This week";

const ROLES: Role[] = ["English", "French", "German", "Spanish"];
const ROLE_FLAGS: Record<Role, string> = { English: "🇬🇧", French: "🇫🇷", German: "🇩🇪", Spanish: "🇪🇸" };

const fieldClass =
  "w-full h-12 rounded-xl border border-hairline bg-surface-wisp px-4 text-sm text-ink placeholder:text-subtle focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all";

function interpolate(str: string, vars: Record<string, string>) {
  return str.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.187.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 00.417-1.187L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function ProgressDots({ index }: { index: 1 | 2 | 3 }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={{ width: "0%" }}
            animate={{ width: i <= index ? "100%" : "0%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      ))}
    </div>
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
  const isRtl = locale === "ar";

  const [step, setStep] = useState<Step>("gate");
  const [role, setRole] = useState<Role | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    trackEvent(PAGE, "PAGE_VIEW", locale);
  }, [locale]);

  useEffect(() => {
    trackFunnelStep(step);
  }, [step]);

  const roleLabels: Record<Role, string> = useMemo(
    () => ({ English: t.roleEnglish, French: t.roleFrench, German: t.roleGerman, Spanish: t.roleSpanish }),
    [t]
  );

  const timingOptions: { value: Timing; label: string }[] = [
    { value: "Today", label: t.timingToday },
    { value: "Tomorrow", label: t.timingTomorrow },
    { value: "This week", label: t.timingWeek },
  ];

  const whatsappHref = useMemo(() => {
    if (!name && !role) return WHATSAPP_URL;
    const msg = `Hi! I'm ${name}${role ? `, I'd like to apply to teach ${roleLabels[role]}` : ""} at Voxbridge.`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`;
  }, [name, role, roleLabels]);

  function goSkip() {
    trackFunnelStep("skip");
    setStep("all");
  }

  function handleBack() {
    if (step === "role") setStep("gate");
    else if (step === "details") setStep("role");
    else if (step === "timing") setStep("details");
  }

  function handleGate(yes: boolean) {
    setStep(yes ? "role" : "all");
  }

  function handleRole(r: Role) {
    setRole(r);
    setStep("details");
  }

  function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault();
    setStep("timing");
  }

  async function handleTiming(value: Timing) {
    if (isSubmitting || !role) return;
    setIsSubmitting(true);
    const result = await submitContactForm({
      name,
      phone,
      studyField: `Teaching position — ${roleLabels[role]}`,
      startDate: value,
      message: "Applied via the /connect careers funnel.",
    });
    setIsSubmitting(false);
    if (result.success) {
      trackFunnelSubmit(role, value);
      setStep("success");
    } else {
      toast.error(result.message);
    }
  }

  function handleRestart() {
    setStep("gate");
    setRole("");
    setName("");
    setPhone("");
    setShowMore(false);
  }

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

  async function handleShare() {
    const shareData = {
      title: t.title,
      text: t.shareText,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        trackShareClick("native");
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      trackShareClick("clipboard");
      toast.success(t.linkCopied);
    }
  }

  const slideVariants = {
    initial: { opacity: 0, x: isRtl ? -24 : 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRtl ? 24 : -24 },
  };

  const isQuizStep = step === "gate" || step === "role" || step === "details" || step === "timing";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-surface-soft px-5 pb-10 pt-10 sm:justify-center sm:py-16"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {isQuizStep && (
          <div className="mb-5 flex items-center justify-center gap-2">
            <Image src={logo} alt="Voxbridge Language School" width={24} height={24} className="h-6 w-6 rounded-lg" />
            <span className="text-xs font-bold uppercase tracking-wide text-subtle">Voxbridge</span>
          </div>
        )}

        {isQuizStep && (
          <div className="mb-3 flex h-6 items-center justify-between">
            {step !== "gate" ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-medium text-subtle transition-colors hover:text-ink"
              >
                <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
                {t.back}
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={goSkip}
              className="text-xs font-medium text-subtle transition-colors hover:text-brand"
            >
              {t.skip}
            </button>
          </div>
        )}

        <motion.div
          layout
          transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
          className="relative overflow-hidden rounded-3xl border border-hairline bg-white shadow-xl shadow-ink/5"
        >
          <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-brand-bright to-brand-dark" />

          <div className="p-6 sm:p-7">
            <AnimatePresence mode="wait">
              {/* ── GATE ── */}
              {step === "gate" && (
                <motion.div
                  key="gate"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col items-center gap-5 py-1 text-center"
                >
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {t.gateEyebrow}
                  </motion.span>
                  <h1 className="text-2xl font-black leading-snug text-ink">{t.gateQuestion}</h1>
                  <div className="mt-1 flex w-full flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => handleGate(true)}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark"
                    >
                      {t.gateYes}
                      <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleGate(false)}
                      className="rounded-2xl border border-hairline bg-white px-5 py-3.5 text-sm font-semibold text-subtle transition-colors hover:bg-surface-wisp"
                    >
                      {t.gateNo}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── ROLE ── */}
              {step === "role" && (
                <motion.div
                  key="role"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col gap-1"
                >
                  <ProgressDots index={1} />
                  <div className="mb-4 text-center">
                    <h2 className="text-xl font-black text-ink">{t.roleTitle}</h2>
                    <p className="mt-1 text-sm text-subtle">{t.roleSubtitle}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((r, i) => (
                      <motion.button
                        key={r}
                        type="button"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleRole(r)}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-hairline bg-white px-4 py-6 text-center shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-soft"
                      >
                        <span className="text-3xl">{ROLE_FLAGS[r]}</span>
                        <span className="text-sm font-semibold text-ink">{roleLabels[r]}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── DETAILS ── */}
              {step === "details" && (
                <motion.form
                  key="details"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onSubmit={handleDetailsSubmit}
                  className="flex flex-col gap-4"
                >
                  <ProgressDots index={2} />
                  <div className="mb-1 text-center">
                    <h2 className="text-xl font-black text-ink">{t.detailsTitle}</h2>
                    <p className="mt-1 text-sm text-subtle">{t.detailsSubtitle}</p>
                  </div>
                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={fieldClass}
                  />
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={fieldClass}
                  />
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-base font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark"
                  >
                    {t.continueButton}
                    <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                  </motion.button>
                </motion.form>
              )}

              {/* ── TIMING ── */}
              {step === "timing" && (
                <motion.div
                  key="timing"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col gap-1"
                >
                  <ProgressDots index={3} />
                  <div className="mb-4 text-center">
                    <h2 className="text-xl font-black text-ink">{t.timingTitle}</h2>
                    <p className="mt-1 text-sm text-subtle">{t.timingSubtitle}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {timingOptions.map((opt, i) => (
                      <motion.button
                        key={opt.value}
                        type="button"
                        disabled={isSubmitting}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleTiming(opt.value)}
                        className="flex items-center justify-between rounded-2xl border border-hairline bg-white px-5 py-4 text-start text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-soft disabled:opacity-60"
                      >
                        {opt.label}
                        {isSubmitting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                        ) : (
                          <ArrowRight className={`h-4 w-4 text-subtle ${isRtl ? "rotate-180" : ""}`} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  {isSubmitting && <p className="mt-2 text-center text-xs text-subtle">{t.sending}</p>}
                </motion.div>
              )}

              {/* ── SUCCESS ── */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center gap-5 py-1 text-center"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50"
                    >
                      <CheckCircle2 className="h-9 w-9 text-green-500" />
                    </motion.div>
                    {["✨", "🎉", "✨"].map((emoji, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-lg"
                        style={{ left: `${10 + i * 35}%`, top: "-8%" }}
                        initial={{ opacity: 0, y: 0, scale: 0.6 }}
                        animate={{ opacity: [0, 1, 0], y: -28, scale: 1 }}
                        transition={{ duration: 1.1, delay: 0.25 + i * 0.15, ease: "easeOut" }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">{t.successEyebrow}</p>
                    <h2 className="mt-1 text-2xl font-black text-ink">
                      {interpolate(t.successTitle, { name: name.trim().split(" ")[0] || name })}
                    </h2>
                    <p className="mt-2 max-w-xs text-sm text-subtle">
                      {interpolate(t.successSubtitle, { role: role ? roleLabels[role] : "" })}
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-3">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsApp}
                      className="flex items-center gap-4 rounded-2xl bg-whatsapp px-5 py-4 text-white shadow-lg shadow-whatsapp/25 transition active:scale-[0.98]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <WhatsAppIcon className="h-6 w-6" />
                      </span>
                      <span className="min-w-0 flex-1 text-start">
                        <span className="block text-base font-semibold">{t.successWhatsapp}</span>
                        <span className="block text-xs text-white/80">{t.successWhatsappHint}</span>
                      </span>
                    </a>

                    <a
                      href={`tel:${CONNECT_PHONE.tel}`}
                      onClick={handleCall}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-white px-5 py-3.5 text-sm font-semibold text-ink shadow-sm transition active:scale-[0.98]"
                    >
                      <PhoneIcon className="h-4 w-4 text-brand" />
                      {t.successCall}
                    </a>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ink-muted"
                    >
                      <Share2 className="h-4 w-4" />
                      {t.successShare}
                    </motion.button>
                    <p className="-mt-1 text-xs text-subtle">{t.successShareHint}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMore((s) => !s)}
                    className="text-xs font-medium text-subtle underline-offset-2 hover:text-brand hover:underline"
                  >
                    {t.seeAllContact}
                  </button>

                  <AnimatePresence>
                    {showMore && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="w-full overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 pt-1">
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="text-xs text-subtle/70 transition-colors hover:text-subtle"
                  >
                    {t.restart}
                  </button>
                </motion.div>
              )}

              {/* ── ALL CONTACT DETAILS (skip / gate-no) ── */}
              {step === "all" && (
                <motion.div
                  key="all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src={logo}
                      alt="Voxbridge Language School"
                      width={56}
                      height={56}
                      className="mb-3 h-14 w-14 rounded-2xl shadow-sm"
                      priority
                    />
                    <h1 className="text-xl font-bold text-ink">{t.title}</h1>
                    <p className="mt-2 text-sm leading-relaxed text-subtle">{t.subtitle}</p>
                  </div>

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

                  <button
                    type="button"
                    onClick={() => setStep("gate")}
                    className="flex items-center justify-center gap-1.5 text-xs font-medium text-subtle transition-colors hover:text-brand"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {t.gateEyebrow}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
