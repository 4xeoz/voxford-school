"use client";

import ScrollReveal from "../ui/ScrollReveal";
import type { Dictionary } from "@/dictionaries";

interface SocialProofSectionProps {
  dict: Dictionary;
}

const STATS = [
  { valueKey: "stat1Value" as const, labelKey: "stat1Label" as const },
  { valueKey: "stat2Value" as const, labelKey: "stat2Label" as const },
  { valueKey: "stat3Value" as const, labelKey: "stat3Label" as const },
];

const TESTIMONIALS = [
  {
    nameKey: "t1Name" as const,
    locationKey: "t1Location" as const,
    quoteKey: "t1Quote" as const,
    initials: "YB",
    color: "#d4a84b",
  },
  {
    nameKey: "t2Name" as const,
    locationKey: "t2Location" as const,
    quoteKey: "t2Quote" as const,
    initials: "KM",
    color: "#012340",
  },
  {
    nameKey: "t3Name" as const,
    locationKey: "t3Location" as const,
    quoteKey: "t3Quote" as const,
    initials: "AD",
    color: "#27344a",
  },
];

export default function SocialProofSection({ dict }: SocialProofSectionProps) {
  const t = dict.testimonials;

  return (
    <section id="social-proof" className="w-full bg-[#F3F4F6] px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">

        {/* Badge + heading */}
        <ScrollReveal className="mb-10 md:mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm mb-5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d4a84b]" />
            <span className="text-sm font-medium text-[#0a1628]">{t.badge}</span>
          </div>
          <h2 className="text-balance text-3xl font-black leading-tight text-[#012340] sm:text-4xl md:text-5xl">
            {t.title}
          </h2>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal
          className="mb-12 md:mb-16 grid grid-cols-3 gap-4 rounded-2xl bg-[#012340] px-6 py-8 sm:px-10 sm:py-10"
          duration={0.6}
        >
          {STATS.map(({ valueKey, labelKey }, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl font-black text-[#d4a84b] sm:text-3xl md:text-4xl lg:text-5xl">
                {t[valueKey]}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-white/60 sm:text-xs">
                {t[labelKey]}
              </span>
            </div>
          ))}
        </ScrollReveal>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(({ nameKey, locationKey, quoteKey, initials, color }, i) => (
            <ScrollReveal
              key={i}
              direction="up"
              delay={i * 0.1}
              duration={0.6}
              className="flex flex-col gap-5 rounded-2xl bg-white p-6 sm:p-7"
            >
              {/* Quote mark */}
              <span
                className="block text-4xl font-black leading-none"
                style={{ color }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Quote text */}
              <p className="flex-1 text-[15px] leading-relaxed text-[#444444]">
                {t[quoteKey]}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-[#E8E4DD] pt-5">
                {/* Avatar — initials circle */}
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#012340]">
                    {t[nameKey]}
                  </p>
                  <p className="text-[12px] text-[#8195a6]">
                    {t[locationKey]}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
