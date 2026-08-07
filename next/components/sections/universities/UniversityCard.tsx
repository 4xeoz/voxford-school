"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, TrendingUp } from "lucide-react";
import type { University } from "@/lib/data/universities";
import { formatFee, getMinFee } from "@/lib/utils/filterUtils";

interface UniversityCardProps {
  university: University;
  locale: string;
  onCardClick?: () => void;
}

export default function UniversityCard({ university, locale, onCardClick }: UniversityCardProps) {
  const minFee = getMinFee(university);
  const topPrograms = university.programs.slice(0, 2);
  const detailHref = `/${locale}/universities/${university.slug}`;

  return (
    <article
      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-[#0a1628]/10 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#d4a84b]/20"
      onClick={onCardClick}
    >
      {/* Image Container - Airbnb style, links to detail page */}
      <Link href={detailHref} className="relative h-56 overflow-hidden bg-gray-100 block">
        <Image
          src={university.image}
          alt={university.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Ranking Badge - Top right */}
        <div className="absolute right-3 top-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 shadow-md flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-[#d4a84b]" />
          <span className="text-xs font-bold text-[#0a1628]">{university.ranking.tier}</span>
        </div>

        {/* Rating Badge - Top left */}
        <div className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 shadow-md flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-[#0a1628]">{university.rating.toFixed(1)}</span>
        </div>

        {/* Tag Pills - Bottom left */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {university.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-[#0a1628] whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-[#0a1628]/50">
          <MapPin className="h-3.5 w-3.5" />
          <span>🇬🇧 {university.location.city}, UK</span>
        </div>

        {/* University Name & Description */}
        <div>
          <Link href={detailHref}>
            <h3 className="text-lg font-bold leading-snug text-[#0a1628] line-clamp-2 hover:text-[#d4a84b] transition-colors">
              {university.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-[#0a1628]/60 line-clamp-2">
            {university.shortDescription}
          </p>
        </div>

        {/* Key Metrics - Row */}
        <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#0a1628]/8">
          <div className="text-center">
            <div className="text-xs text-[#0a1628]/50 mb-0.5">Acceptance</div>
            <div className="text-sm font-bold text-[#0a1628]">{university.acceptanceRate}%</div>
          </div>
          <div className="text-center border-x border-[#0a1628]/8">
            <div className="text-xs text-[#0a1628]/50 mb-0.5">Intl Students</div>
            <div className="text-sm font-bold text-[#0a1628]">{university.internationalStudents}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[#0a1628]/50 mb-0.5">Est.</div>
            <div className="text-sm font-bold text-[#0a1628]">{university.established}</div>
          </div>
        </div>

        {/* Programs Preview */}
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#0a1628]/40">
            Popular Programs
          </p>
          <div className="space-y-1.5">
            {topPrograms.map((prog) => (
              <div key={prog.id} className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[#0a1628]">{prog.name}</span>
                <span className="shrink-0 rounded-full bg-[#f5f0e8] px-2.5 py-1 text-xs font-semibold text-[#d4a84b]">
                  {formatFee(prog.feeFrom)}/yr
                </span>
              </div>
            ))}
          </div>
          {university.programs.length > 2 && (
            <p className="mt-2 text-[10px] text-[#0a1628]/40">
              +{university.programs.length - 2} more programs available
            </p>
          )}
        </div>

        {/* CTA Button */}
        <Link
          href={detailHref}
          className="mt-auto flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0a1628] font-semibold text-white transition-all hover:bg-[#0f1f3c] hover:shadow-md active:scale-95"
        >
          View Details
          <span className="text-[#d4a84b]">→</span>
        </Link>
      </div>
    </article>
  );
}
