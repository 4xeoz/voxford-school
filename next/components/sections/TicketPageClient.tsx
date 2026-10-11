"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Globe2,
  MessageCircle,
  Ticket,
} from "lucide-react";
import { submitContactForm } from "@/actions/contact";
import { WHATSAPP_URL } from "@/lib/contact";
import { trackContactFormSubmit, trackWhatsAppClick } from "@/lib/gtag";
import type { Locale } from "@/i18n.config";

type Copy = {
  open: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  lead: string;
  pointOne: string;
  pointTwo: string;
  cardEyebrow: string;
  cardTitle: string;
  cardLead: string;
  student: string;
  parent: string;
  yourName: string;
  namePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  language: string;
  notSure: string;
  activate: string;
  activating: string;
  reassurance: string;
  whatsapp: string;
  whatsappMessage: string;
  successTitle: string;
  successLead: string;
  invalidPhone: string;
  failure: string;
  home: string;
  location: string;
};

const copy: Record<Locale, Copy> = {
  ar: {
    open: "التسجيل مفتوح الآن",
    eyebrow: "مسحت رمز البروشور. وصلت إلى المكان الصحيح.",
    headline: "فعّل تذكرتك",
    headlineAccent: "من هنا إلى بلد اللغة.",
    lead: "ابدأ بتعلّم اللغة في مواقف حقيقية، واكتشف فرص ممارستها في بلدها خلال العطل. أخبرنا بما يهمك، وسنساعدك على اختيار البداية المناسبة.",
    pointOne: "لغة تستخدمها، لا تحفظها فقط",
    pointTwo: "فرص تجربة اللغة في بلدها",
    cardEyebrow: "تذكرة البداية · فوكس بريدج",
    cardTitle: "هذه التذكرة باسم من؟",
    cardLead: "اترك بياناتك وسيتواصل معك فريقنا لشرح المسارات والخطوة التالية.",
    student: "طالب/ـة",
    parent: "وليّ أمر",
    yourName: "الاسم",
    namePlaceholder: "اسمك الكامل",
    phone: "رقم الهاتف أو واتساب",
    phonePlaceholder: "05 / 06 / 07 ...",
    language: "اللغة التي تهمك",
    notSure: "لم أقرر بعد",
    activate: "فعّل تذكرتي",
    activating: "جارٍ إرسال طلبك...",
    reassurance: "سنستخدم رقمك للتواصل بشأن هذا الطلب. لا يلزمك اختيار برنامج الآن.",
    whatsapp: "تفضّل بالتواصل عبر واتساب",
    whatsappMessage: "مرحبًا، مسحت رمز البروشور وأود معرفة المزيد عن الدراسة في فوكس بريدج.",
    successTitle: "وصلتنا تذكرتك!",
    successLead: "تم استلام طلبك. سيتواصل معك فريق فوكس بريدج لشرح الخيارات والخطوة التالية.",
    invalidPhone: "يرجى إدخال رقم هاتف صحيح.",
    failure: "تعذّر إرسال طلبك الآن. حاول مرة أخرى أو تواصل معنا عبر واتساب.",
    home: "الموقع الرئيسي",
    location: "المسيلة، الجزائر",
  },
  fr: {
    open: "Les inscriptions sont ouvertes",
    eyebrow: "Vous avez scanné la brochure. Vous êtes au bon endroit.",
    headline: "Activez votre billet",
    headlineAccent: "d'ici au pays de la langue.",
    lead: "Apprenez la langue dans des situations concrètes et découvrez les possibilités de la pratiquer dans son pays pendant les vacances. Dites-nous ce qui vous intéresse, nous vous aiderons à choisir votre départ.",
    pointOne: "Une langue que vous utilisez vraiment",
    pointTwo: "Des possibilités de séjour linguistique",
    cardEyebrow: "Votre point de départ · Voxbridge",
    cardTitle: "À quel nom est ce billet ?",
    cardLead: "Laissez vos coordonnées : notre équipe vous expliquera les parcours et la prochaine étape.",
    student: "Élève",
    parent: "Parent",
    yourName: "Nom",
    namePlaceholder: "Votre nom complet",
    phone: "Téléphone ou WhatsApp",
    phonePlaceholder: "05 / 06 / 07 ...",
    language: "Langue qui vous intéresse",
    notSure: "Je ne sais pas encore",
    activate: "Activer mon billet",
    activating: "Envoi en cours...",
    reassurance: "Nous utiliserons votre numéro pour répondre à cette demande. Vous n'avez pas à choisir un programme maintenant.",
    whatsapp: "Parler avec nous sur WhatsApp",
    whatsappMessage: "Bonjour, j'ai scanné la brochure et je voudrais en savoir plus sur Voxbridge.",
    successTitle: "Votre billet est arrivé !",
    successLead: "Nous avons reçu votre demande. L'équipe Voxbridge vous contactera pour expliquer les possibilités et la prochaine étape.",
    invalidPhone: "Veuillez saisir un numéro de téléphone valide.",
    failure: "Votre demande n'a pas pu être envoyée. Réessayez ou contactez-nous sur WhatsApp.",
    home: "Site principal",
    location: "M'Sila, Algérie",
  },
  en: {
    open: "Enrollment is open now",
    eyebrow: "You scanned the brochure. You're in the right place.",
    headline: "Activate your ticket",
    headlineAccent: "from here to where the language lives.",
    lead: "Learn through real situations, then explore opportunities to practise the language in its country during school breaks. Tell us what interests you, and we'll help you choose a starting point.",
    pointOne: "Language you actually use",
    pointTwo: "Opportunities to practise abroad",
    cardEyebrow: "Your starting ticket · Voxbridge",
    cardTitle: "Whose name is on this ticket?",
    cardLead: "Leave your details and our team will explain the pathways and your next step.",
    student: "Student",
    parent: "Parent",
    yourName: "Name",
    namePlaceholder: "Your full name",
    phone: "Phone or WhatsApp number",
    phonePlaceholder: "05 / 06 / 07 ...",
    language: "Language you're interested in",
    notSure: "Not sure yet",
    activate: "Activate my ticket",
    activating: "Sending your request...",
    reassurance: "We'll use your number to respond to this request. You don't need to choose a programme yet.",
    whatsapp: "Talk to us on WhatsApp",
    whatsappMessage: "Hello, I scanned the brochure and would like to know more about Voxbridge.",
    successTitle: "Your ticket reached us!",
    successLead: "We've received your request. The Voxbridge team will contact you to explain the options and next step.",
    invalidPhone: "Please enter a valid phone number.",
    failure: "We couldn't send your request. Please try again or message us on WhatsApp.",
    home: "Main website",
    location: "M'Sila, Algeria",
  },
};

const languages = [
  { value: "English", ar: "الإنجليزية", fr: "Anglais", en: "English" },
  { value: "French", ar: "الفرنسية", fr: "Français", en: "French" },
  { value: "German", ar: "الألمانية", fr: "Allemand", en: "German" },
  { value: "Spanish", ar: "الإسبانية", fr: "Espagnol", en: "Spanish" },
  { value: "Chinese", ar: "الصينية", fr: "Chinois", en: "Chinese" },
] as const;

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-[#E6E0DC] bg-[#FCFBFA] px-4 text-base text-ink outline-none transition placeholder:text-[#A09B97] focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10";

export default function TicketPageClient({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const isArabic = locale === "ar";
  const [visitor, setVisitor] = useState<"student" | "parent">("student");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(t.whatsappMessage)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (phone.replace(/\D/g, "").length < 8) {
      setError(t.invalidPhone);
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const result = await submitContactForm({
        name: name.trim(),
        phone: phone.trim(),
        message: [
          "Source: brochure QR ticket",
          `Visitor: ${visitor}`,
          `Language interest: ${language || "Not sure yet"}`,
        ].join("\n"),
      });

      if (!result.success) {
        setError(t.failure);
        return;
      }
      trackContactFormSubmit("Brochure ticket", language || "Not sure yet");
      setSubmitted(true);
    } catch {
      setError(t.failure);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden bg-[#A90000] text-white"
    >
      <div aria-hidden className="pointer-events-none absolute -start-48 -top-48 h-[34rem] w-[34rem] rounded-full border-[4.5rem] border-white/[0.055]" />
      <div aria-hidden className="pointer-events-none absolute -end-44 top-64 h-[38rem] w-[38rem] rounded-full border-[5rem] border-white/[0.055]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#780000]/70 to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-6 pt-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
          <Link href={`/${locale}`} className="flex items-center gap-3" aria-label="Voxbridge Language School">
            <Image
              src="/voxbridge/icon-detailed-white-transparent-v2.png"
              alt=""
              width={43}
              height={43}
              className="h-10 w-10 object-contain"
              priority
            />
            <span className="text-start font-sans text-[1.05rem] font-black leading-[1.05] tracking-tight sm:text-lg">
              Voxbridge
              <span className="block text-xs font-bold tracking-[0.08em] text-white/75 sm:text-sm">
                Language School
              </span>
            </span>
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("contact")}
            className="hidden items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-bold transition hover:bg-white/10 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </header>

        <div className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:py-16">
          <section className="relative max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold">
              <span className="h-2 w-2 rounded-full bg-[#FBD77C]" />
              {t.open}
            </div>
            <p className="mt-5 text-sm font-medium text-white/70 lg:mt-8">{t.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(2.5rem,7vw,5.8rem)] font-black leading-[1.05] tracking-tight">
              {t.headline}
              <span className="mt-2 block text-[#FFE6B3]">{t.headlineAccent}</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-white/85 sm:text-lg lg:mt-6">
              {t.lead}
            </p>

            <div className="mt-8 hidden max-w-md gap-3 border-t border-white/20 pt-6 text-sm font-semibold lg:grid lg:grid-cols-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-4 w-4" />
                </span>
                {t.pointOne}
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Globe2 className="h-4 w-4" />
                </span>
                {t.pointTwo}
              </div>
            </div>
          </section>

          <section className="relative w-full max-w-xl justify-self-center text-ink lg:justify-self-end" aria-label={t.cardTitle}>
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(38,0,0,0.28)]">
              <div className="bg-[#FFF8F1] px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.17em] text-brand sm:text-xs">
                    {t.cardEyebrow}
                  </p>
                  <Ticket className="h-7 w-7 shrink-0 text-brand" strokeWidth={1.6} />
                </div>
                <h2 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
                  {submitted ? t.successTitle : t.cardTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#655F5B]">
                  {submitted ? t.successLead : t.cardLead}
                </p>
              </div>

              <div className="relative px-6 sm:px-8">
                <div className="border-t-2 border-dashed border-[#E9DDD1]" />
                <span aria-hidden className="absolute -start-4 -top-4 h-8 w-8 rounded-full bg-[#A90000]" />
                <span aria-hidden className="absolute -end-4 -top-4 h-8 w-8 rounded-full bg-[#A90000]" />
              </div>

              {submitted ? (
                <div className="flex flex-col items-center px-6 pb-8 pt-8 text-center sm:px-8">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF8EE] text-[#168342]">
                    <CheckCircle2 className="h-9 w-9" />
                  </span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("contact")}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t.whatsapp}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-7 pt-6 sm:px-8 sm:pb-8">
                  <fieldset className="flex gap-2" aria-label={t.cardTitle}>
                    {(["student", "parent"] as const).map((kind) => (
                      <button
                        key={kind}
                        type="button"
                        aria-pressed={visitor === kind}
                        onClick={() => setVisitor(kind)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                          visitor === kind
                            ? "bg-brand text-white"
                            : "border border-[#E6E0DC] bg-white text-[#706A66] hover:border-brand/50"
                        }`}
                      >
                        {kind === "student" ? t.student : t.parent}
                      </button>
                    ))}
                  </fieldset>

                  <div>
                    <label htmlFor="ticket-name" className="text-sm font-bold">{t.yourName}</label>
                    <input
                      id="ticket-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={t.namePlaceholder}
                      required
                      maxLength={120}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ticket-phone" className="text-sm font-bold">{t.phone}</label>
                    <input
                      id="ticket-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder={t.phonePlaceholder}
                      required
                      maxLength={30}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ticket-language" className="text-sm font-bold">{t.language}</label>
                    <select
                      id="ticket-language"
                      name="language"
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className={inputClass}
                    >
                      <option value="">{t.notSure}</option>
                      {languages.map((item) => (
                        <option key={item.value} value={item.value}>{item[locale]}</option>
                      ))}
                    </select>
                  </div>

                  {error && <p role="alert" className="text-sm font-semibold text-brand">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-4 text-base font-black text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmitting ? t.activating : t.activate}
                    {!isSubmitting && <ArrowUpRight className="h-5 w-5" />}
                  </button>
                  <p className="text-center text-xs leading-5 text-[#77716D]">{t.reassurance}</p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("contact")}
                    className="flex items-center justify-center gap-2 text-center text-sm font-bold text-brand underline-offset-4 hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t.whatsapp}
                  </a>
                </form>
              )}
            </div>
          </section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/65">
          <span>© Voxbridge Language School · {t.location}</span>
          <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 hover:text-white">
            {t.home} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
