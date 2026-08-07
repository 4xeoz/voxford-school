"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import ScrollReveal from "../ui/ScrollReveal";
import type { Dictionary } from "@/dictionaries";

const VIDEO_URL =
  "https://ugmzfzkyvnajamtfmzpk.supabase.co/storage/v1/object/public/public%20assets/ecole.mp4";
// 36°45'34.5"N 3°28'02.3"E
const MAPS_URL = "https://maps.google.com/?q=36.759583,3.467306";

const TRUST_ICONS = [
  <svg key="cap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>,
  <svg key="cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>,
  <svg key="bld" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" />
  </svg>,
];

interface VisitInstituteSectionProps {
  dict: Dictionary;
}

export default function VisitInstituteSection({ dict }: VisitInstituteSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  const thumbRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: thumbRef,
    offset: ["start end", "end start"],
  });
  const thumbY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const trustItems = [dict.visit.trust1, dict.visit.trust2, dict.visit.trust3];

  return (
    // No overflow-hidden on the outer section so the floating card isn't clipped.
    // The decorative blobs are wrapped in their own overflow-hidden container.
    <section
      id="visit"
      className="relative w-full bg-[#F8F5F0] px-4 py-16 md:py-24"
    >
      {/* Decorative blobs — isolated overflow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-64 -top-64 h-[600px] w-[600px] rounded-full bg-[#d9b573]/8 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#012340]/6 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">

        {/* ─── LEFT: Text content ─── */}
        <div className="flex flex-col gap-5 sm:gap-6">

          <ScrollReveal duration={0.5}>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#d4a84b]" />
              <span className="text-sm font-semibold tracking-wide text-[#0a1628]">
                {dict.visit.badge}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} duration={0.6}>
            <h2 className="text-balance text-3xl font-black leading-tight text-[--color-brand-primary] sm:text-4xl md:text-5xl lg:text-5xl">
              {dict.visit.title}{" "}
              <span className="relative inline-block text-[#d4a84b]">
                {dict.visit.titleHighlight}
                <svg
                  aria-hidden
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M2 6 C50 2, 100 7, 198 4" stroke="#d4a84b" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                </svg>
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2} duration={0.6}>
            <p className="max-w-md text-base leading-relaxed text-[--color-text-muted] sm:text-lg">
              {dict.visit.subtitle}
            </p>
          </ScrollReveal>

          {/* Trust badges — wraps on small screens */}
          <ScrollReveal delay={0.3} duration={0.6}>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {trustItems.map((label, i) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#012340] shadow-sm ring-1 ring-[#012340]/8 sm:px-3.5 sm:py-2.5 sm:text-sm"
                >
                  <span className="text-[#d4a84b]">{TRUST_ICONS[i]}</span>
                  {label}
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Office hours */}
          <ScrollReveal delay={0.35} duration={0.6}>
            <div className="flex w-fit items-center gap-2 rounded-xl bg-white/70 px-3.5 py-2 text-xs font-medium text-[#012340] ring-1 ring-[#012340]/8 sm:px-4 sm:py-2.5 sm:text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-[#d4a84b]">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {dict.visit.hours}
            </div>
          </ScrollReveal>

          {/* CTAs — stack on xs, row on sm+ */}
          <ScrollReveal delay={0.4} duration={0.6}>
            <div className="flex flex-col gap-3 pt-1 xs:flex-row xs:flex-wrap sm:flex-row sm:items-center">
              <button
                onClick={() => setVideoOpen(true)}
                className="group flex items-center justify-center gap-2.5 rounded-xl bg-[#012340] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#012340]/85 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 sm:px-6 sm:py-3.5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d4a84b]/20 transition-colors group-hover:bg-[#d4a84b]/30 sm:h-7 sm:w-7">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 translate-x-0.5 text-[#d4a84b] sm:h-3.5 sm:w-3.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                {dict.visit.primaryCta}
              </button>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#012340]/15 bg-white px-5 py-3 text-sm font-semibold text-[#012340] shadow-sm transition-all duration-200 hover:border-[#012340]/30 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 sm:px-6 sm:py-3.5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#d4a84b]">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {dict.visit.secondaryCta}
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* ─── RIGHT: Vertical video card ─── */}
        {/*
          On mobile (< lg): full width but capped at 300px, centered.
          The floating stats card is hidden on xs to avoid overflow,
          visible from sm+ with safe positioning.
          pb-10 sm:pb-14 gives vertical room for the overflowing floating card.
        */}
        <ScrollReveal
          direction="up"
          delay={0.15}
          duration={0.7}
          className="relative mx-auto w-full max-w-[280px] pb-10 sm:max-w-[300px] sm:pb-14 lg:mx-0 lg:max-w-none lg:pb-10"
        >
          {/* Video card */}
          <div
            ref={thumbRef}
            className="relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-3xl shadow-2xl"
            onClick={() => setVideoOpen(true)}
          >
            {/* Parallax video preview */}
            <motion.div style={{ y: thumbY }} className="absolute inset-[-12%]">
              <video
                src={VIDEO_URL}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Bottom gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                onClick={() => setVideoOpen(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-2 ring-white/30 transition-all duration-300 hover:bg-white/25 hover:ring-white/50 sm:h-20 sm:w-20"
                aria-label="Play video"
              >
                <span className="absolute -inset-3 animate-ping rounded-full bg-white/10" />
                <span className="absolute -inset-1.5 animate-pulse rounded-full bg-white/10" />
                <svg viewBox="0 0 24 24" fill="white" className="relative h-6 w-6 translate-x-0.5 sm:h-8 sm:w-8">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </motion.button>
            </div>

            {/* Location tag */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-white/20 sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-2.5"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d4a84b] sm:h-7 sm:w-7">
                <svg viewBox="0 0 24 24" fill="white" className="h-3 w-3 sm:h-3.5 sm:w-3.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" fill="#012340" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] font-semibold leading-none text-white sm:text-xs">{dict.visit.locationLabel}</p>
                <p className="mt-0.5 text-[9px] leading-none text-white/70 sm:text-[10px]">{dict.visit.locationSub}</p>
              </div>
            </a>

            {/* Label top-right */}
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#d4a84b] px-2.5 py-1 sm:right-4 sm:top-4 sm:px-3 sm:py-1.5">
              <span className="text-[10px] font-bold text-[#012340] sm:text-xs">▶ Notre Institut</span>
            </div>
          </div>

          {/* Floating stats card — hidden on xs, shown sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="absolute -bottom-2 right-0 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 sm:-bottom-4 sm:right-0 sm:flex md:-bottom-5 md:-right-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#012340]/8">
              <svg viewBox="0 0 24 24" fill="none" stroke="#012340" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-black text-[#012340]">500+ Students</p>
              <p className="text-xs text-[--color-text-muted]">Successfully placed</p>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* ─── Video Lightbox ─── */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative"
              style={{ maxHeight: "85vh", aspectRatio: "9/16" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -right-2 -top-12 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors hover:bg-white/25"
                aria-label="Close video"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <video
                key={videoOpen ? "open" : "closed"}
                src={VIDEO_URL}
                controls
                autoPlay
                playsInline
                className="h-full w-full rounded-2xl bg-black shadow-2xl"
                style={{ maxHeight: "85vh" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
