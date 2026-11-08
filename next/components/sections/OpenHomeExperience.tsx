"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MAPS_DIRECTIONS } from "@/lib/contact";
import { contentFor } from "@/lib/open-site-content";
import { audienceLanguageCopy, courseSectionFor } from "@/lib/course-content";
import { audienceGroupsFor, languagesForAudience } from "@/lib/audience-content";
const desktopHero = "/voxbridge/hero-studio-desktop-v2.png";
const mobileHero = "/voxbridge/hero-studio-mobile-v2.png";
const speech = "/voxbridge/home-speech-sculpture.png";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.25, 1] }}>{children}</motion.div>;
}

export default function OpenHomeExperience({ locale }: { locale: string }) {
  const c = contentFor(locale);
  const courseCopy = courseSectionFor(locale);
  const audienceGroups = audienceGroupsFor(locale);
  const audienceCards = audienceGroups.flatMap(group => group.audiences.map(audience => ({ ...audience, categoryTitle: group.title })));
  const audienceLanguages = languagesForAudience(locale);
  const languageCopy = audienceLanguageCopy[locale === "ar" || locale === "fr" ? locale : "en"];
  const audienceCarousel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isAr = locale === "ar";

  return <main className="open-site overflow-hidden bg-[#fffdfa] text-[#242020]">
    <section id="home" className="relative bg-[#fffdfa] px-3 pb-24 pt-[104px] text-white sm:px-5 sm:pt-[112px] lg:px-7 lg:pb-28">
      <div className="relative mx-auto max-w-[1500px]">
        <div className="relative min-h-[780px] overflow-hidden rounded-[2rem] bg-[#c51408] shadow-[0_24px_70px_rgba(82,17,8,.18)] sm:rounded-[2.5rem] lg:min-h-[700px] xl:min-h-[750px]">
          <Image src={desktopHero} alt="Illustrative Voxbridge studio scene with a student, a red notebook and a sculpted ivory ribbon" fill priority sizes="(min-width: 1024px) 94vw, 1px" className="hidden object-cover object-center lg:block" />
          <div className="absolute inset-x-0 bottom-0 top-[265px] lg:hidden">
            <Image src={mobileHero} alt="Illustrative Voxbridge student in a red studio" fill priority sizes="(max-width: 1023px) 100vw, 1px" className="object-cover object-center" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(92,4,0,.18)_0%,rgba(116,6,1,.07)_48%,transparent_72%)] max-lg:bg-[linear-gradient(180deg,#c51408_0%,#c51408_22%,rgba(197,20,8,.96)_35%,rgba(197,20,8,.28)_56%,transparent_76%)]" />
          <div className="relative z-10 flex min-h-[780px] items-start px-7 pb-28 pt-11 sm:px-12 sm:pt-16 lg:min-h-[700px] lg:items-center lg:px-[clamp(3rem,6vw,7rem)] lg:pb-24 lg:pt-16 xl:min-h-[750px]">
            <div className="max-w-[590px]" dir={isAr ? "rtl" : "ltr"}>
              <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-4 py-2 text-xs font-black backdrop-blur-sm sm:text-sm"><span className="h-2 w-2 rounded-full bg-[#fff2df]" />{c.open}</motion.p>
              <motion.h1 initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .72 }} className="mt-6 text-[clamp(2.8rem,5.7vw,6rem)] font-black leading-[1.08] tracking-[-.035em] [text-wrap:balance] sm:mt-8"><span className="block">{c.heroLineOne}</span><span className="mt-2 block text-[#fff0db]">{c.heroLineTwo}</span></motion.h1>
              <motion.p initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .23, duration: .7 }} className="mt-5 max-w-[480px] text-base font-medium leading-relaxed text-white/95 sm:mt-7 sm:text-lg">{c.heroLead}</motion.p>
              <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .32, duration: .65 }} className="mt-7 sm:mt-9"><a className="inline-flex min-h-14 items-center justify-center gap-5 rounded-full bg-[#fff7e9] px-7 py-3 text-base font-black text-[#aa160c] shadow-[0_13px_35px_rgba(64,0,0,.22)] transition hover:-translate-y-1 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#location">{c.visit}<span aria-hidden>↗</span></a></motion.div>
            </div>
          </div>
        </div>
        <motion.a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .7 }} className="absolute -bottom-11 right-3 z-20 flex min-h-[112px] w-[calc(100%-1.5rem)] max-w-[440px] items-center justify-between gap-5 rounded-[1.6rem] bg-[#fff7e9] px-7 py-5 text-[#9f160d] shadow-[0_22px_55px_rgba(80,20,8,.17)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(80,20,8,.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#aa160c] sm:-bottom-14 sm:right-8 sm:min-h-[130px] sm:px-9" dir={isAr ? "rtl" : "ltr"}>
          <span><span className="block text-[2rem] font-black leading-none sm:text-[2.45rem]">{c.city}</span><span className="mt-2 block text-xs font-bold leading-snug text-[#5c4f49] sm:text-sm">{c.address}</span></span><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d8aaa0] text-xl" aria-hidden>↗</span>
        </motion.a>
      </div>
    </section>

    <section id="courses" className="scroll-mt-24 bg-[#fffdfa] px-5 pb-24 pt-8 sm:px-8 lg:pb-32 lg:pt-12" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="mb-10 grid gap-5 lg:mb-14 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
          <div><p className="open-eyebrow">{courseCopy.eyebrow}</p><h2 className="open-heading mt-4 max-w-[15ch]">{courseCopy.title}</h2></div>
          <p className="max-w-[30rem] text-lg font-medium leading-relaxed text-[#625855] sm:text-xl">{courseCopy.lead}</p>
        </Reveal>
        <div className="mb-5 flex justify-end gap-2">
          <button type="button" aria-label={courseCopy.previous} onClick={() => audienceCarousel.current?.scrollBy({ left: (isAr ? 1 : -1) * 320, behavior: "smooth" })} className="grid h-11 w-11 place-items-center rounded-full bg-[#262321] text-xl font-bold text-white transition hover:bg-[#a8170c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b7190d]" dir="ltr">{isAr ? "→" : "←"}</button>
          <button type="button" aria-label={courseCopy.next} onClick={() => audienceCarousel.current?.scrollBy({ left: (isAr ? -1 : 1) * 320, behavior: "smooth" })} className="grid h-11 w-11 place-items-center rounded-full bg-[#262321] text-xl font-bold text-white transition hover:bg-[#a8170c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b7190d]" dir="ltr">{isAr ? "←" : "→"}</button>
        </div>
        <div ref={audienceCarousel} role="region" aria-label={courseCopy.carousel} tabIndex={0} className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:gap-6">
          {audienceCards.map((audience, index) => {
            const cardNumber = String(index + 1).padStart(2, "0");
            return <Reveal key={audience.id} delay={index * .04} className="h-full w-[82vw] max-w-[310px] shrink-0 snap-start sm:w-[300px] xl:w-[290px]">
              <article className="flex h-[520px] flex-col overflow-hidden rounded-[1.75rem] border border-[#eadbd4] bg-white shadow-[0_15px_40px_rgba(57,15,8,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(57,15,8,.13)]">
                <div className="px-5 pb-4 pt-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <span dir="ltr" className="rounded-full border border-[#e4d7d0] px-3 py-1 text-xs font-black tracking-wide text-[#81746f]">{cardNumber} / 07</span>
                    <span aria-hidden className="h-8 w-8 rounded-full border-[5px] border-[#f1e9e4]" />
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[.12em] text-[#a8170c]">{audience.categoryTitle}</p>
                  <h3 className="mt-1 min-h-[3.4rem] text-[1.55rem] font-black leading-tight text-[#282321]">{audience.title}</h3>
                  {audience.ageRange && <span dir="ltr" className="mt-1 inline-flex rounded-full bg-[#fff1e9] px-3 py-1 text-xs font-bold text-[#a8170c]">{audience.ageRange}</span>}
                  <p className="mt-4 text-[11px] font-black uppercase tracking-[.1em] text-[#81746f]">{languageCopy.chooseLanguage}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {audienceLanguages.map(language => language.available ? (
                      <Link key={language.slug} href={`/${locale}/courses/${language.slug}?audience=${audience.id}`} aria-label={`${language.label} — ${audience.title}`} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-[#fff4e8] px-2 py-2 text-[13px] font-black text-[#a8170c] transition hover:bg-[#f8e1d7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7190d]">
                        {language.label}<span aria-hidden className="text-base">↗</span>
                      </Link>
                    ) : (
                      <span key={language.slug} aria-label={`${language.label} — ${language.comingSoon}`} className="inline-flex min-h-10 flex-col items-center justify-center rounded-xl border border-dashed border-[#e1d2cc] px-2 py-1 text-xs font-bold leading-tight text-[#77706c]">
                        <span>{language.label}</span><span className="text-[10px]">{language.comingSoon}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative mt-auto min-h-[220px] flex-1 overflow-hidden bg-[#b7190d]">
                  <Image src={audience.image} alt="" fill sizes="(max-width: 639px) 82vw, 310px" className="object-cover object-[center_34%] transition duration-500 hover:scale-[1.035]" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#4f0804]/35 via-transparent to-[#4f0804]/10" />
                </div>
              </article>
            </Reveal>;
          })}
        </div>
      </div>
    </section>

    <section id="experience" className="relative px-5 py-24 sm:px-8 lg:py-32" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <div><p className="open-eyebrow">{c.differenceEyebrow}</p><h2 className="open-heading mt-4 max-w-[12ch]">{c.differenceTitle}</h2></div>
          <p className="self-end text-xl font-medium leading-relaxed text-[#5a5150] sm:text-2xl">{c.differenceLead}</p>
        </Reveal>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {c.moments.map((item, index) => <Reveal key={item.number} delay={index * .11} className="group relative min-h-[245px] overflow-hidden rounded-[1.75rem] border border-[#ede5e1] bg-white p-7 shadow-[0_18px_45px_rgba(42,14,8,.05)] transition hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(42,14,8,.13)]">
            <span aria-hidden className="open-card-ring absolute -bottom-20 -right-12 h-52 w-52 rounded-full border-[28px] border-[#f3e9e3] transition group-hover:scale-110" />
            <span className="text-sm font-black text-[#bc1408]">{item.number} / 03</span>
            <div className="relative mt-16"><h3 className="text-3xl font-black text-[#a9180f]">{item.title}</h3><p className="mt-3 max-w-[30ch] text-base leading-relaxed text-[#5d5554]">{item.body}</p></div>
          </Reveal>)}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-[#242020] px-5 py-20 text-white sm:px-8 lg:py-28" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative h-[460px] overflow-hidden rounded-[2.1rem] bg-[#ba1208] shadow-[0_25px_65px_rgba(0,0,0,.3)] sm:h-[580px]"><Image src={speech} alt="Illustrative Voxbridge studio artwork: two cream speech forms made from a ribbon" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[center_70%]" /></Reveal>
        <Reveal><p className="open-eyebrow text-[#ff8c7e]">{c.speakingEyebrow}</p><h2 className="open-heading mt-5 text-white">{c.speakingTitle}</h2><p className="mt-7 max-w-[36rem] text-lg leading-relaxed text-white/70 sm:text-xl">{c.speakingBody}</p><div aria-hidden className="mt-10 flex gap-2"><span className="h-3 w-20 rounded-full bg-white" /><span className="h-3 w-10 rounded-full bg-white/60" /><span className="h-3 w-5 rounded-full bg-white/30" /></div></Reveal>
      </div>
    </section>

    <section className="relative overflow-hidden bg-[#f4eee9] px-5 py-24 sm:px-8 lg:py-32" dir={isAr ? "rtl" : "ltr"}>
      <div aria-hidden className="open-travel-arc absolute -right-24 -top-44 h-[500px] w-[500px] rounded-full border-[65px] border-[#dfd1c9]/70 sm:h-[700px] sm:w-[700px]" />
      <div className="relative mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
        <Reveal><p className="open-eyebrow">{c.tripEyebrow}</p><h2 className="open-heading mt-5 max-w-[13ch]">{c.tripTitle}</h2></Reveal>
        <Reveal delay={.12}><p className="max-w-[32rem] text-lg leading-relaxed text-[#5d5554] sm:text-xl">{c.tripBody}</p><Link href={`/${locale}/contact?interest=trips`} className="mt-8 inline-flex min-h-13 items-center gap-3 rounded-full bg-[#c91608] px-7 py-3 font-black text-white transition hover:bg-[#a70c05]">{c.tripCta}<span aria-hidden>↗</span></Link></Reveal>
      </div>
    </section>

    <section id="location" className="bg-white px-5 py-20 sm:px-8 lg:py-28" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <Reveal><p className="open-eyebrow">{c.placeEyebrow}</p><h2 className="open-heading mt-5">{c.placeTitle}</h2><p className="mt-6 max-w-[31rem] text-xl font-medium leading-relaxed text-[#5d5554]">{c.address}</p><a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-13 items-center gap-3 rounded-full border border-[#b5170c] px-7 py-3 font-black text-[#a5160c] transition hover:bg-[#fff1ed]">{c.directions}<span aria-hidden>↗</span></a></Reveal>
        <Reveal delay={.1} className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#c91608] shadow-[0_24px_60px_rgba(92,24,9,.18)] sm:h-[430px]">
          <div aria-hidden className="open-place-ring absolute h-[400px] w-[400px] rounded-full border-[58px] border-[#fff0e6] shadow-[18px_28px_45px_rgba(67,0,0,.28),inset_8px_10px_24px_rgba(112,39,16,.13)] sm:h-[530px] sm:w-[530px]" />
          <span className="relative z-10 rounded-[1.5rem] bg-white px-8 py-5 text-center text-3xl font-black text-[#bc1609] shadow-[0_18px_30px_rgba(77,0,0,.23)] sm:text-4xl">M&apos;Sila<span className="block text-sm tracking-[.2em] text-[#6a5450]">VOXBRIDGE</span></span>
        </Reveal>
      </div>
    </section>
  </main>;
}
