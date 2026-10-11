"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Phone } from "lucide-react";
import { submitContactForm } from "@/actions/contact";
import { CONNECT_PHONE, MAPS_DIRECTIONS } from "@/lib/contact";
import { trackContactFormSubmit, trackPhoneCall } from "@/lib/gtag";
import type { Locale } from "@/i18n.config";

type Step = "welcome" | "form" | "success";

type Copy = {
  open: string;
  headline: string;
  intro: string;
  start: string;
  simple: string;
  formTitle: string;
  formIntro: string;
  name: string;
  namePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  send: string;
  sending: string;
  back: string;
  privacy: string;
  invalidName: string;
  invalidPhone: string;
  failure: string;
  successTitle: string;
  successIntro: string;
  otherWays: string;
  call: string;
  map: string;
  location: string;
};

const copy: Record<Locale, Copy> = {
  ar: {
    open: "التسجيل مفتوح الآن",
    headline: "فعّل تذكرتك",
    intro: "اترك اسمك ورقمك. سنتواصل معك لشرح الدراسة ورحلات العطل.",
    start: "سجّل اهتمامك",
    simple: "الاسم ورقم الهاتف فقط",
    formTitle: "كيف نتواصل معك؟",
    formIntro: "نحتاج اسمك ورقم هاتفك فقط.",
    name: "اسمك",
    namePlaceholder: "اكتب اسمك هنا",
    phone: "رقم هاتفك",
    phonePlaceholder: "مثال: 05 12 34 56 78",
    send: "أرسل اهتمامي",
    sending: "جارٍ الإرسال...",
    back: "رجوع",
    privacy: "سنستخدم رقمك للرد على طلبك.",
    invalidName: "يرجى كتابة اسمك.",
    invalidPhone: "يرجى إدخال رقم هاتف صحيح.",
    failure: "تعذّر الإرسال الآن. حاول مرة أخرى أو اتصل بنا.",
    successTitle: "وصلنا طلبك",
    successIntro: "سيتواصل معك فريق فوكس بريدج لشرح الخطوة التالية.",
    otherWays: "أو تواصل معنا مباشرة",
    call: "اتصل بنا",
    map: "افتح الموقع على خرائط Google",
    location: "المسيلة، الجزائر",
  },
  fr: {
    open: "Inscriptions ouvertes",
    headline: "Activez votre billet",
    intro: "Laissez votre nom et votre numéro. Nous vous expliquerons les cours et les voyages linguistiques pendant les vacances.",
    start: "Je suis intéressé(e)",
    simple: "Nom et téléphone uniquement",
    formTitle: "Comment vous joindre ?",
    formIntro: "Il nous faut seulement votre nom et votre numéro.",
    name: "Votre nom",
    namePlaceholder: "Écrivez votre nom",
    phone: "Votre téléphone",
    phonePlaceholder: "Exemple : 05 12 34 56 78",
    send: "Envoyer ma demande",
    sending: "Envoi en cours...",
    back: "Retour",
    privacy: "Nous utiliserons votre numéro pour répondre à cette demande.",
    invalidName: "Veuillez saisir votre nom.",
    invalidPhone: "Veuillez saisir un numéro valide.",
    failure: "Envoi impossible pour le moment. Réessayez ou appelez-nous.",
    successTitle: "Demande reçue",
    successIntro: "L'équipe Voxbridge vous contactera pour expliquer la prochaine étape.",
    otherWays: "Ou contactez-nous directement",
    call: "Appelez-nous",
    map: "Ouvrir dans Google Maps",
    location: "M'Sila, Algérie",
  },
  en: {
    open: "Enrollment is open",
    headline: "Activate your ticket",
    intro: "Leave your name and number. We'll explain the courses and holiday language trips.",
    start: "Register interest",
    simple: "Just your name and phone number",
    formTitle: "How can we reach you?",
    formIntro: "We only need your name and phone number.",
    name: "Your name",
    namePlaceholder: "Enter your name",
    phone: "Your phone number",
    phonePlaceholder: "For example: 05 12 34 56 78",
    send: "Send my interest",
    sending: "Sending...",
    back: "Back",
    privacy: "We'll use your number to respond to this request.",
    invalidName: "Please enter your name.",
    invalidPhone: "Please enter a valid phone number.",
    failure: "We couldn't send this now. Please retry or call us.",
    successTitle: "Request received",
    successIntro: "The Voxbridge team will contact you about the next step.",
    otherWays: "Or contact us directly",
    call: "Call us",
    map: "Open in Google Maps",
    location: "M'Sila, Algeria",
  },
};

const inputClass =
  "mt-2 min-h-[58px] w-full rounded-2xl border-2 border-[#D8D2CE] bg-white px-4 text-[18px] text-[#1E1B1A] placeholder:text-[#77716D] outline-none transition focus:border-[#BC0000] focus:ring-4 focus:ring-[#BC0000]/15";

const contactClass =
  "flex min-h-[68px] w-full items-center gap-4 rounded-2xl border border-[#E5DEDA] bg-[#FCFAF8] px-4 py-3 text-start text-[#201C1A] shadow-[0_3px_12px_rgba(55,23,17,0.06)] transition-colors hover:border-[#BC0000]/40 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BC0000]/30 active:bg-[#FFF3EF]";

export default function TicketPageClient({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const isArabic = locale === "ar";
  const reduceMotion = useReducedMotion() === true;
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => headingRef.current?.focus(), reduceMotion ? 0 : 260);
    return () => window.clearTimeout(timer);
  }, [step, reduceMotion]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setError(t.invalidName);
      nameRef.current?.focus();
      return;
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setError(t.invalidPhone);
      phoneRef.current?.focus();
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const result = await submitContactForm({
        name: name.trim(),
        phone: phone.trim(),
        message: "Source: brochure QR ticket",
      });
      if (!result.success) {
        setError(t.failure);
        return;
      }
      trackContactFormSubmit("Brochure ticket", "Not specified");
      setStep("success");
    } catch {
      setError(t.failure);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="relative min-h-[100svh] overflow-hidden bg-[#F7F3F0] text-[#201C1A]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-gradient-to-br from-[#C90000] to-[#970000]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 end-[-8rem] h-80 w-80 rounded-full border-[3.5rem] border-white/[0.08]" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[540px] flex-col px-4 pb-6 pt-4 sm:px-6 sm:pt-6">
        <header className="flex min-h-12 items-center justify-between">
          <Link
            href={"/" + locale}
            aria-label="Voxbridge Language School"
            className="inline-flex items-center gap-3 rounded-lg text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          >
            <Image src="/voxbridge/icon-detailed-white-transparent-v2.png" alt="" width={43} height={43} className="h-10 w-10 object-contain" priority />
            <span className="font-sans text-lg font-black leading-[1.05]">
              Voxbridge
              <span className="block text-[11px] font-bold tracking-wide text-white/85">Language School</span>
            </span>
          </Link>
        </header>

        <div className="mt-5 overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_22px_65px_rgba(78,23,16,0.18)]">
          <div className={"relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#FFFFFF_0%,#FFF5F0_72%,#FFE8E0_100%)] transition-[height] duration-300 motion-reduce:transition-none " + (step === "welcome" ? "h-[170px] sm:h-[190px]" : "h-0")}>
            <div aria-hidden="true" className="absolute h-[220px] w-[220px] rounded-full border-[28px] border-[#C80000]/[0.055]" />
            <Image
              src="/voxbridge/ticket/globe-only.png"
              alt=""
              width={160}
              height={160}
              sizes="160px"
              className="relative h-[152px] w-[152px] object-contain drop-shadow-[0_15px_15px_rgba(87,23,20,0.12)] sm:h-[170px] sm:w-[170px]"
              priority
            />
            <Image
              src="/voxbridge/ticket/algerian-passport-top-view.png"
              alt=""
              width={88}
              height={125}
              sizes="88px"
              className="absolute bottom-[-29px] end-[11%] h-[125px] w-auto rotate-[13deg] object-contain drop-shadow-[0_12px_10px_rgba(20,22,20,0.25)]"
              priority
            />
          </div>

          <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={step}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
                aria-live="polite"
              >
                {step === "welcome" && (
                  <>
                    <span className="inline-flex min-h-9 items-center rounded-full bg-[#FFF0E9] px-4 text-sm font-bold text-[#9B0000]">
                      <span aria-hidden="true" className="me-2 h-2 w-2 rounded-full bg-[#BC0000]" />
                      {t.open}
                    </span>
                    <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-[clamp(2rem,9vw,2.7rem)] font-black leading-tight tracking-tight focus:outline-none">
                      {t.headline}
                    </h1>
                    <p className="mt-3 text-[17px] leading-7 text-[#4D4642]">{t.intro}</p>
                    <button
                      type="button"
                      onClick={() => { setError(""); setStep("form"); }}
                      className="mt-6 flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-[#BC0000] px-5 text-[18px] font-black text-white shadow-[0_12px_24px_rgba(188,0,0,0.22)] transition-colors hover:bg-[#A50000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BC0000]/30 active:bg-[#8F0000]"
                    >
                      {t.start}
                    </button>
                    <p className="mt-3 text-center text-sm font-semibold text-[#665D58]">{t.simple}</p>
                  </>
                )}

                {step === "form" && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setError(""); setStep("welcome"); }}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg text-base font-bold text-[#8B0000] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BC0000]/25"
                    >
                      {isArabic ? <ArrowRight aria-hidden="true" className="h-5 w-5" /> : <ArrowLeft aria-hidden="true" className="h-5 w-5" />}
                      {t.back}
                    </button>
                    <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-[clamp(1.9rem,8vw,2.5rem)] font-black leading-tight focus:outline-none">
                      {t.formTitle}
                    </h1>
                    <p className="mt-2 text-[17px] leading-7 text-[#4D4642]">{t.formIntro}</p>
                    <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
                      <div>
                        <label htmlFor="ticket-name" className="text-[17px] font-bold">{t.name}</label>
                        <input
                          ref={nameRef}
                          id="ticket-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(event) => { setName(event.target.value); setError(""); }}
                          placeholder={t.namePlaceholder}
                          required
                          maxLength={120}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="ticket-phone" className="text-[17px] font-bold">{t.phone}</label>
                        <input
                          ref={phoneRef}
                          id="ticket-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          dir="ltr"
                          value={phone}
                          onChange={(event) => { setPhone(event.target.value); setError(""); }}
                          placeholder={t.phonePlaceholder}
                          required
                          maxLength={30}
                          className={inputClass}
                        />
                      </div>
                      {error && <p role="alert" className="rounded-xl bg-[#FFF0ED] px-4 py-3 text-base font-semibold text-[#920000]">{error}</p>}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-[#BC0000] px-5 text-[18px] font-black text-white shadow-[0_12px_24px_rgba(188,0,0,0.22)] transition-colors hover:bg-[#A50000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BC0000]/30 disabled:cursor-wait disabled:opacity-60"
                      >
                        {isSubmitting ? t.sending : t.send}
                      </button>
                      <p className="text-center text-sm leading-6 text-[#625A55]">{t.privacy}</p>
                    </form>
                  </>
                )}

                {step === "success" && (
                  <div className="py-3 text-center">
                    <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E9F7EE] text-[#176A3B]">
                      <CheckCircle2 aria-hidden="true" className="h-11 w-11" />
                    </span>
                    <h1 ref={headingRef} tabIndex={-1} className="mt-5 text-[clamp(2rem,9vw,2.7rem)] font-black leading-tight focus:outline-none">
                      {t.successTitle}
                    </h1>
                    <p className="mt-3 text-[17px] leading-7 text-[#4D4642]">{t.successIntro}</p>
                  </div>
                )}
              </motion.section>
            </AnimatePresence>

            <div className="mt-6 border-t border-[#E8E1DD] pt-5">
              <p className="mb-3 text-center text-sm font-semibold text-[#5C534E]">{t.otherWays}</p>
              <div className="grid gap-3">
                <a
                  href={"tel:" + CONNECT_PHONE.tel}
                  onClick={() => trackPhoneCall(CONNECT_PHONE.tel)}
                  className={contactClass}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EB] text-[#A50000]">
                    <Phone aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-bold">{t.call}</span>
                    <span dir="ltr" className="block text-base font-semibold tabular-nums text-[#554B46]">{CONNECT_PHONE.display}</span>
                  </span>
                </a>
                <a
                  href={MAPS_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactClass}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EB] text-[#A50000]">
                    <MapPin aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-bold">{t.map}</span>
                    <span className="block text-sm font-medium text-[#554B46]">{t.location}</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-sm font-medium text-[#6A605B]">Voxbridge Language School</p>
      </div>
    </main>
  );
}
