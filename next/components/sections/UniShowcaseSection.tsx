"use client";

import { motion } from "motion/react";
import ScrollReveal from "../ui/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import uni12 from "@/public/univeristy_showcase/image-gen (12).png";
import uni13 from "@/public/univeristy_showcase/image-gen (13).png";
import uni14 from "@/public/univeristy_showcase/image-gen (14).png";
import uni15 from "@/public/univeristy_showcase/image-gen (15).png";
import uni16 from "@/public/univeristy_showcase/image-gen (16).png";
import type { Dictionary } from "@/dictionaries";

interface UniShowcaseSectionProps {
  dict: Dictionary;
}

export default function UniShowcaseSection({ dict }: UniShowcaseSectionProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  const universities = [
    { id: 1, name: "Oxford", image: uni12 },
    { id: 2, name: "Brookes", image: uni13 },
    { id: 3, name: "Cambridge", image: uni14 },
    { id: 4, name: "Royal Holloway", image: uni15 },
    { id: 5, name: "UCL", image: uni16 },
  ];

  return (
    <section
      id="universities"
      className="flex w-full items-center overflow-hidden bg-[--color-brand-primary] px-4 py-12 md:py-20 lg:h-[80dvh] lg:max-h-[920px]"
    >
      <div className="mx-auto flex h-auto max-w-6xl flex-col gap-8 md:gap-12 lg:h-1/2 lg:flex-row lg:items-center lg:gap-6">
        {/* LEFT COLUMN - Header Content */}
        <ScrollReveal
          direction="left"
          className="flex w-full shrink-0 flex-col gap-6 md:gap-8 lg:w-[30%] lg:gap-10"
        >
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f5f0e8] px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0a1628]" />
            <span className="text-sm font-medium text-[#0a1628]">
              {dict.universities.badge}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-balance text-3xl font-bold leading-tight text-[#f5f0e8] sm:text-4xl md:text-5xl">
            {dict.universities.title}
          </h2>

          {/* Next Step CTA (moved from DiscoverPathways) */}
          <Link
            href={`/${locale}/universities`}
            className="inline-block w-fit rounded-full bg-[#d4a84b] px-8 py-3 text-center text-base font-medium text-white transition-colors hover:bg-[#c49a3d] sm:py-4 sm:text-lg"
          >
            {dict.discover.cta}
          </Link>
        </ScrollReveal>

        {/* RIGHT COLUMN - University Cards Grid */}
        <div className="w-full flex-1 overflow-x-auto lg:overflow-visible">
          <motion.div
            className="flex gap-3 pb-4 sm:gap-4 lg:gap-4 lg:pb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {universities.map((uni) => (
              <motion.div
                key={uni.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex h-40 w-40 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 text-base font-medium text-white backdrop-blur-sm transition-transform hover:scale-[1.02] sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-[280px] lg:w-[280px] lg:text-lg"
              >
                <Image
                  src={uni.image}
                  alt={uni.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 280px"
                  priority={uni.id <= 3}
                />
                <div className="absolute inset-x-3 bottom-3 rounded-md bg-[#f5f0e8] px-3 py-1 text-center text-sm font-semibold uppercase tracking-wide text-[#0a1628]">
                  {uni.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
