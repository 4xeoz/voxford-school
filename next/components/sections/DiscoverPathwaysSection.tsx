"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import studentsImg from "@/public/students-university.png";
import ScrollReveal from "../ui/ScrollReveal";
import type { Dictionary } from "@/dictionaries";

interface DiscoverPathwaysSectionProps {
  dict: Dictionary;
}

export default function DiscoverPathwaysSection({ dict }: DiscoverPathwaysSectionProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <section id="discover" className="relative flex w-full items-stretch justify-center overflow-hidden bg-[#f5f0e8] px-4 py-12 md:py-20 lg:h-dvh lg:max-h-[1120px]">
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {/* Vertical stripes */}
        <div className="absolute inset-0 flex justify-between px-16">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-full w-px bg-[color:var(--color-stripe-wisp-60)]"
            />
          ))}
        </div>

        {/* Decorative arcs - Left */}
        <svg
          className="absolute -left-32 top-0 h-[600px] w-[600px] opacity-40"
          viewBox="0 0 600 600"
          fill="none"
        >
          <path
            d="M-100 600 C 100 400, 300 200, 600 100"
            stroke="var(--color-accent-arc)"
            strokeWidth="120"
            fill="none"
          />
        </svg>

        {/* Decorative arcs - Right */}
        <svg
          className="absolute -right-32 bottom-0 h-[500px] w-[500px] opacity-30"
          viewBox="0 0 500 500"
          fill="none"
        >
          <path
            d="M500 -50 C 400 150, 200 300, -50 400"
            stroke="var(--color-accent-arc)"
            strokeWidth="100"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative mx-auto h-auto w-full max-w-6xl">
        <div className="grid h-full grid-cols-1 items-stretch gap-6 md:gap-8 lg:grid-cols-[40%_1fr]">

          {/* LEFT COLUMN - White Card (slides from left) */}
          <ScrollReveal
            direction="left"
            duration={0.7}
            className="flex h-full flex-col rounded-3xl bg-white p-6 sm:p-8 lg:p-12"
          >
            {/* Badge */}
            <div className="mx-auto mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#f5f0e8] px-4 py-2 md:mb-8">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0a1628]" />
              <span className="text-sm font-medium text-[#0a1628]">
                {dict.discover.badge}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-balance text-center text-3xl font-black leading-tight text-[#0a1628] sm:text-4xl md:text-5xl">
              {dict.discover.title}
            </h2>

            {/* Spacer */}
            <div className="hidden flex-1 lg:block" />

            {/* CTA — navigates to the full UK universities page */}
            <Link
              href={`/${locale}/universities`}
              className="mt-6 block w-full rounded-full bg-[#d4a84b] px-8 py-3 text-center text-base font-medium text-white transition-colors hover:bg-[#c49a3d] sm:py-4 sm:text-lg md:mt-8 lg:mt-0"
            >
              {dict.discover.cta}
            </Link>
          </ScrollReveal>

          {/* RIGHT COLUMN - Image with Overlapping Cards (slides from right) */}
          <ScrollReveal
            direction="right"
            delay={0.15}
            duration={0.7}
            className="relative h-64 sm:h-80 md:h-96 lg:h-auto"
          >
            {/* Main image container */}
            <div className="relative h-full w-full overflow-hidden rounded-3xl">
              <Image
                src={studentsImg}
                alt="Students walking towards historic university building"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* OVERLAPPING CARDS */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-2 sm:bottom-4 sm:right-4 sm:gap-3 md:gap-4">

              {/* Stats card — white */}
              <div className="flex h-24 w-32 flex-col justify-between rounded-xl bg-white p-3 shadow-xl sm:h-28 sm:w-40 sm:p-3.5 md:h-32 md:w-48 lg:h-[160px] lg:w-[280px] lg:rounded-2xl lg:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#0a1628]/50 sm:text-xs">
                  {dict.discover.statCardTitle}
                </p>
                <div className="flex items-end justify-around">
                  <div className="text-center">
                    <p className="text-base font-black text-[#d4a84b] sm:text-xl lg:text-3xl">
                      {dict.discover.stat1Value}
                    </p>
                    <p className="text-[9px] leading-tight text-[#0a1628]/55 sm:text-[10px] lg:text-xs">
                      {dict.discover.stat1Label}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-[#0a1628]/10 lg:h-10" />
                  <div className="text-center">
                    <p className="text-base font-black text-[#d4a84b] sm:text-xl lg:text-3xl">
                      {dict.discover.stat2Value}
                    </p>
                    <p className="text-[9px] leading-tight text-[#0a1628]/55 sm:text-[10px] lg:text-xs">
                      {dict.discover.stat2Label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote card — gold */}
              <div className="flex h-24 w-32 flex-col justify-between rounded-xl bg-[#d4a84b] p-3 shadow-xl sm:h-28 sm:w-40 sm:p-3.5 md:h-32 md:w-48 lg:h-[160px] lg:w-[280px] lg:rounded-2xl lg:p-5">
                <p className="text-[10px] font-semibold leading-snug text-white sm:text-xs lg:text-sm lg:leading-relaxed">
                  {dict.discover.quoteText}
                </p>
                <Link
                  href={`/${locale}/universities`}
                  className="flex items-center gap-1 text-[10px] font-bold text-white/80 transition-colors hover:text-white sm:text-xs lg:text-sm"
                >
                  {dict.discover.quoteCta} →
                </Link>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
