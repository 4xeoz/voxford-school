"use client";

import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "@/dictionaries";

interface PartnershipBarProps {
  dict: Dictionary;
}

const BENEFITS = [
  { key: "benefit1" as const, icon: "✦" },
  { key: "benefit2" as const, icon: "✦" },
  { key: "benefit3" as const, icon: "✦" },
];

export default function PartnershipBar({ dict }: PartnershipBarProps) {
  const t = dict.partnership;

  return (
    <section
      className="w-full bg-white border-b border-[#E8E4DD]"
      aria-label={t.label}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-center gap-4 sm:gap-0">

          {/* Left: label + logo */}
          <div className=" flex flex-col sm:flex-row items-center gap-4 sm:gap-5 ">
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8195a6] whitespace-nowrap leading-none">
              {t.label}
            </span>

            {/* Thin vertical rule between label and logo */}
            <span className="hidden sm:block w-px h-5 bg-[#E8E4DD] flex-shrink-0" />

              <Image
                src="/partnership/adv-path-camp.png"
                alt="Advanced Pathways Campus"
                width={172}
                height={44}
                className="h-full w-auto object-cover"
              />
          </div>

          

        </div>
      </div>
    </section>
  );
}
