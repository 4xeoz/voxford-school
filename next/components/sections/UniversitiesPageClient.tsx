"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Phone, GraduationCap, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import type { Dictionary } from "@/dictionaries";
import UniversityCard from "@/components/sections/universities/UniversityCard";
import SmartFilters from "@/components/sections/universities/SmartFilters";
import UniversitySearch from "@/components/sections/universities/UniversitySearch";
import type { FilterState } from "@/lib/types/filters";
import { DEFAULT_FILTER_STATE } from "@/lib/types/filters";
import { filterUniversities } from "@/lib/utils/filterUtils";
import { UK_UNIVERSITIES_DATA } from "@/lib/data/universities";

const WHATSAPP_URL = "https://wa.me/447879003218";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface Props {
  dict: Dictionary;
  locale: string;
}

export default function UniversitiesPageClient({ dict, locale }: Props) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // Apply filters to universities
  const filteredUniversities = useMemo(() => {
    return filterUniversities(UK_UNIVERSITIES_DATA, filters);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (search: string) => {
    handleFilterChange({ ...filters, search });
  };

  const handleSortChange = (sortBy: FilterState["sortBy"]) => {
    handleFilterChange({ ...filters, sortBy });
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Navbar locale={locale} dict={dict} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0a1628] px-4 pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-3xl flex flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4a84b]/40 bg-[#d4a84b]/10 px-4 py-2">
            <GraduationCap className="h-4 w-4 text-[#d4a84b]" />
            <span className="text-sm font-medium text-[#d4a84b]">🇬🇧 UK Universities</span>
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight text-[#f5f0e8] sm:text-5xl md:text-6xl">
            {dict.universities.pageTitle}
          </h1>
          <p className="max-w-xl text-base text-white/55 sm:text-lg">
            {dict.universities.pageSubtitle}
          </p>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────── */}
      <div className="border-b border-[#0a1628]/10 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            ["500+", "Students placed"],
            ["98%", "Visa approval rate"],
            [UK_UNIVERSITIES_DATA.length.toString(), "Partner universities"],
            ["Free", "Expert consultation"],
          ].map(([num, label]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xl font-black text-[#d4a84b]">{num}</span>
              <span className="text-sm text-[#0a1628]/60">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <section className="px-4 py-12 pb-32 md:py-16 md:pb-36">
        <div className="mx-auto max-w-7xl">
          {/* Search + Sort */}
          <div className="mb-8">
            <UniversitySearch
              search={filters.search}
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              sortBy={filters.sortBy}
              universities={UK_UNIVERSITIES_DATA}
              resultCount={filteredUniversities.length}
            />
          </div>

          {/* Filters + Grid Layout */}
          <div className="flex gap-6">
            {/* Smart Filters Sidebar (or Mobile Drawer) */}
            <SmartFilters
              universities={UK_UNIVERSITIES_DATA}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Universities Grid */}
            <div className="flex-1 min-w-0">
              {filteredUniversities.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-24 text-center">
                  <p className="text-lg text-[#0a1628]/60">{dict.universities.noResults}</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white hover:bg-[#22c55e] transition-colors"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {dict.universities.ctaWhatsApp}
                  </a>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUniversities.map((uni, index) => (
                      <>
                        {/* Soft nudge banner every 6 cards */}
                        {index > 0 && index % 6 === 0 && (
                          <div
                            key={`nudge-${index}`}
                            className="col-span-full flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#d4a84b]/30 bg-[#d4a84b]/8 px-6 py-5 sm:flex-row sm:items-center"
                          >
                            <div className="flex items-start gap-3">
                              <Star className="mt-0.5 h-5 w-5 shrink-0 text-[#d4a84b]" />
                              <div>
                                <p className="font-bold text-[#0a1628]">
                                  {dict.universities.nudgeTitle}
                                </p>
                                <p className="mt-1 text-sm text-[#0a1628]/65">
                                  {dict.universities.nudgeText}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`/${locale}/contact`}
                              className="shrink-0 rounded-full bg-[#d4a84b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c49a3f]"
                            >
                              {dict.universities.nudgeCta}
                            </Link>
                          </div>
                        )}

                        {/* University Card */}
                        <UniversityCard
                          key={uni.id}
                          university={uni}
                          locale={locale}
                        />
                      </>
                    ))}
                  </div>

                  {/* Mid-page advisor block */}
                  <div className="mt-12 flex flex-col items-center gap-6 rounded-3xl border border-[#0a1628]/10 bg-[#0a1628] px-6 py-10 text-center md:py-14">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4a84b]/15">
                      <GraduationCap className="h-7 w-7 text-[#d4a84b]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#f5f0e8] sm:text-3xl">
                        {dict.universities.advisorBlock}
                      </h3>
                      <p className="mx-auto mt-3 max-w-lg text-base text-white/55">
                        {dict.universities.advisorBlockSub}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-colors hover:bg-[#22c55e]"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                        {dict.universities.ctaWhatsApp}
                      </a>
                      <Link
                        href={`/${locale}/contact`}
                        className="flex h-12 items-center gap-2 rounded-full bg-[#d4a84b] px-6 text-sm font-semibold text-[#0a1628] transition-colors hover:bg-[#c49a3f]"
                      >
                        {dict.universities.advisorBlockCta}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY BOTTOM BAR ───────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a1628]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center text-sm font-medium text-white/80 sm:text-left sm:text-base">
            💬 {dict.universities.stickyTitle}
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/20 transition-colors hover:bg-[#22c55e]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{dict.universities.ctaWhatsApp}</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <a
              href="tel:+447879003218"
              className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.18]"
            >
              <Phone className="h-4 w-4 text-[#d4a84b]" />
              <span className="hidden sm:inline">{dict.universities.ctaCall}</span>
              <span className="sm:hidden">Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
