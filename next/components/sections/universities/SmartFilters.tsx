"use client";

import React, { useState } from "react";
import { ChevronDown, X, Filter } from "lucide-react";
import type { University, Region, RankingTier, ProgramCategory } from "@/lib/data/universities";
import type { FilterState } from "@/lib/types/filters";
import { getAvailableRegions, getAvailablePrograms } from "@/lib/utils/filterUtils";
import { REGION_LABELS, RANKING_TIER_LABELS, PROGRAM_CATEGORY_LABELS, BUDGET_RANGE_MIN, BUDGET_RANGE_MAX } from "@/lib/types/filters";

interface SmartFiltersProps {
  universities: University[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

const RANKING_TIERS: RankingTier[] = ["Top 10", "Top 50", "Top 100", "Top 200", "Top 500"];

export default function SmartFilters({ universities, filters, onFilterChange }: SmartFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["location", "ranking"]));

  const regions = getAvailableRegions(universities, filters);
  const programs = getAvailablePrograms(universities, filters);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const handleRegionToggle = (region: Region) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region];
    onFilterChange({ ...filters, regions: newRegions });
  };

  const handleRankingToggle = (tier: RankingTier) => {
    const newTiers = filters.rankingTiers.includes(tier)
      ? filters.rankingTiers.filter((t) => t !== tier)
      : [...filters.rankingTiers, tier];
    onFilterChange({ ...filters, rankingTiers: newTiers });
  };

  const handleProgramToggle = (category: ProgramCategory) => {
    const newCategories = filters.programCategories.includes(category)
      ? filters.programCategories.filter((c) => c !== category)
      : [...filters.programCategories, category];
    onFilterChange({ ...filters, programCategories: newCategories });
  };

  const handleBudgetChange = (type: "min" | "max", value: number) => {
    const newRange = { ...filters.budgetRange };
    if (type === "min") {
      newRange.min = Math.min(value, newRange.max);
    } else {
      newRange.max = Math.max(value, newRange.min);
    }
    onFilterChange({ ...filters, budgetRange: newRange });
  };

  const handleClearAll = () => {
    onFilterChange({
      search: filters.search,
      regions: [],
      rankingTiers: [],
      programCategories: [],
      budgetRange: { min: BUDGET_RANGE_MIN, max: BUDGET_RANGE_MAX },
      sortBy: "relevance",
    });
  };

  const activeFiltersCount =
    filters.regions.length + filters.rankingTiers.length + filters.programCategories.length;

  const FilterButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? "bg-[#0a1628] text-white"
          : "bg-gray-100 text-[#0a1628] hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  const FilterSection = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isExpanded = expandedSections.has(id);
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-[#0a1628]">{title}</span>
          <ChevronDown
            className={`h-5 w-5 text-[#0a1628]/60 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
        {isExpanded && <div className="px-4 pb-4 space-y-2">{children}</div>}
      </div>
    );
  };

  // Desktop filters
  const filterContent = (
    <>
      {/* Location Filter */}
      <FilterSection id="location" title="Location">
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <FilterButton
              key={region.value}
              label={`${region.label} (${region.count})`}
              isActive={filters.regions.includes(region.value)}
              onClick={() => handleRegionToggle(region.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Ranking Filter */}
      <FilterSection id="ranking" title="University Ranking">
        <div className="flex flex-wrap gap-2">
          {RANKING_TIERS.map((tier) => {
            const count = universities.filter((u) => u.ranking.tier === tier).length;
            return (
              <FilterButton
                key={tier}
                label={`${tier} (${count})`}
                isActive={filters.rankingTiers.includes(tier)}
                onClick={() => handleRankingToggle(tier)}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Program Filter */}
      {programs.length > 0 && (
        <FilterSection id="programs" title="Program Category">
          <div className="flex flex-wrap gap-2">
            {programs.map((prog) => (
              <FilterButton
                key={prog.value}
                label={`${prog.label} (${prog.count})`}
                isActive={filters.programCategories.includes(prog.value)}
                onClick={() => handleProgramToggle(prog.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Budget Filter */}
      <FilterSection id="budget" title="Annual Budget Range">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-[#0a1628]/60 block mb-2">
              Min: £{filters.budgetRange.min.toLocaleString()}
            </label>
            <input
              type="range"
              min={BUDGET_RANGE_MIN}
              max={BUDGET_RANGE_MAX}
              step={1000}
              value={filters.budgetRange.min}
              onChange={(e) => handleBudgetChange("min", parseInt(e.target.value))}
              className="w-full accent-[#d4a84b]"
            />
          </div>
          <div>
            <label className="text-sm text-[#0a1628]/60 block mb-2">
              Max: £{filters.budgetRange.max.toLocaleString()}
            </label>
            <input
              type="range"
              min={BUDGET_RANGE_MIN}
              max={BUDGET_RANGE_MAX}
              step={1000}
              value={filters.budgetRange.max}
              onChange={(e) => handleBudgetChange("max", parseInt(e.target.value))}
              className="w-full accent-[#d4a84b]"
            />
          </div>
        </div>
      </FilterSection>

      {/* Clear Button */}
      {activeFiltersCount > 0 && (
        <div className="pt-4">
          <button
            onClick={handleClearAll}
            className="w-full py-2 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#0a1628]/20 bg-white text-[#0a1628] font-semibold hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-auto bg-[#d4a84b] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white shadow-lg overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-4">
              <h2 className="font-bold text-lg text-[#0a1628]">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)} className="p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">{filterContent}</div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0 self-start">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-[#0a1628]/10 bg-white">
          <div className="bg-gradient-to-r from-[#0a1628] to-[#0f1f3c] px-4 py-3 sticky top-0 z-10">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Smart Filters
              {activeFiltersCount > 0 && (
                <span className="ml-auto bg-[#d4a84b] text-[#0a1628] rounded-full px-2.5 py-0.5 text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">{filterContent}</div>
        </div>
      </div>
    </>
  );
}
