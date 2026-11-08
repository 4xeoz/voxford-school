"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MAPS_DIRECTIONS } from "@/lib/contact";
import { contentFor } from "@/lib/open-site-content";
import BrandLockup from "@/components/BrandLockup";

const book = "/voxbridge/home-ribbon-book.png";
const speech = "/voxbridge/home-speech-sculpture.png";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.25, 1] }}>{children}</motion.div>;
}

export default function OpenHomeExperience({ locale }: { locale: string }) {
  const c = contentFor(locale);
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 75]);
  const isAr = locale === "ar";

  return <main className="open-site overflow-hidden bg-[#fffdfa] text-[#242020]">
    <section id="home" ref={heroRef} className="open-hero relative isolate min-h-[760px] overflow-hidden bg-[#c91408] text-white lg:min-h-[790px]">
      <div aria-hidden className="open-hero-glow absolute inset-0" />
      <div aria-hidden className="open-mark-pattern absolute inset-0 opacity-[.075]" />
      <div className="relative mx-auto grid min-h-[760px] max-w-[1440px] grid-cols-1 items-center px-5 pb-12 pt-28 sm:px-8 lg:min-h-[790px] lg:grid-cols-[1.06fr_.94fr] lg:gap-8 lg:px-12 lg:pb-10 lg:pt-28">
        <div className={`relative z-20 max-w-[760px] ${isAr ? "lg:order-2" : ""}`} dir={isAr ? "rtl" : "ltr"}>
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <BrandLockup light />
          </motion.div>
          <motion.p initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .65 }} className="mt-11 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.14em] sm:text-sm"><span className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_white]" />{c.open}</motion.p>
          <motion.h1 initial={reduce ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .26, duration: .78 }} className="mt-6 max-w-[11ch] text-[clamp(3.3rem,7vw,7.2rem)] font-black leading-[.98] tracking-[-.045em] [text-wrap:balance]">{c.headline}</motion.h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38, duration: .72 }} className="mt-7 max-w-[570px] text-lg font-medium leading-relaxed text-white/85 sm:text-xl">{c.heroLead}</motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .48, duration: .65 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-base font-black text-[#b6190e] shadow-[0_12px_35px_rgba(61,0,0,.22)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(61,0,0,.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#location">{c.visit}<span aria-hidden>↗</span></a>
            <a className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/50 bg-white/5 px-7 py-3 text-base font-bold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#experience">{c.explore}</a>
          </motion.div>
          <p className="mt-12 text-xs font-bold uppercase tracking-[.18em] text-white/65">{c.location} <span aria-hidden className="mx-2">·</span> {c.scroll} ↓</p>
        </div>
        <motion.div style={reduce ? undefined : { y: imageY }} className={`relative mt-9 h-[440px] w-full overflow-hidden rounded-[2.4rem] border border-white/20 bg-[#bd0f07] shadow-[0_35px_80px_rgba(74,0,0,.45)] sm:h-[600px] lg:mt-0 lg:h-[650px] ${isAr ? "lg:order-1" : ""}`}>
          <Image src={book} alt="Illustrative Voxbridge studio artwork: a cream ribbon rising from an open book" fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover object-[center_62%]" />
          <div aria-hidden className="absolute inset-0 rounded-[2.4rem] ring-1 ring-inset ring-white/25" />
        </motion.div>
      </div>
      <div aria-hidden className="open-hero-bottom absolute inset-x-0 bottom-0 h-4 bg-[#fffdfa]" />
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
