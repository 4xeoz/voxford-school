"use client";

import React, { useState, useMemo } from "react";
import { Search, X, ArrowUpDown } from "lucide-react";
import type { FilterState } from "@/lib/types/filters";
import type { University } from "@/lib/data/universities";

interface UniversitySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: FilterState["sortBy"]) => void;
  sortBy: FilterState["sortBy"];
  universities: University[];
  resultCount: number;
}

const SORT_OPTIONS: Array<{
  value: FilterState["sortBy"];
  label: string;
  description: string;
}> = [
  { value: "relevance", label: "Relevance", description: "Best matching your search" },
  { value: "ranking", label: "Ranking", description: "QS World Ranking" },
  { value: "price-low", label: "Price: Low to High", description: "Most affordable first" },
  { value: "price-high", label: "Price: High to Low", description: "Premium first" },
  { value: "rating", label: "Top Rated", description: "Student satisfaction" },
  { value: "acceptance", label: "Easiest to Hardest", description: "Acceptance rate" },
];

export default function UniversitySearch({
  search,
  onSearchChange,
  onSortChange,
  sortBy,
  universities,
  resultCount,
}: UniversitySearchProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate suggestions
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];

    const query = search.toLowerCase().trim();
    const uniqueSuggestions = new Set<string>();

    universities.forEach((uni) => {
      if (uni.name.toLowerCase().includes(query)) {
        uniqueSuggestions.add(uni.name);
      }
      uni.programs.forEach((prog) => {
        if (prog.name.toLowerCase().includes(query)) {
          uniqueSuggestions.add(prog.name);
        }
      });
      if (uni.location.city.toLowerCase().includes(query)) {
        uniqueSuggestions.add(uni.location.city);
      }
    });

    return Array.from(uniqueSuggestions).slice(0, 5);
  }, [search, universities]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Sort";

  return (
    <div className="space-y-4">
      {/* Search Bar & Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0a1628]/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => search && setShowSuggestions(true)}
            placeholder="Search universities, programs, cities..."
            className="h-12 w-full rounded-xl border border-[#0a1628]/15 bg-white pl-12 pr-10 text-[#0a1628] placeholder:text-[#0a1628]/40 transition-all focus:border-[#d4a84b]/50 focus:ring-2 focus:ring-[#d4a84b]/20 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-[#0a1628]/60" />
            </button>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      onSearchChange(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#0a1628] hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Search className="h-4 w-4 text-[#0a1628]/40" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="h-12 w-full sm:w-56 rounded-xl border border-[#0a1628]/15 bg-white px-4 font-medium text-[#0a1628] transition-all hover:border-[#d4a84b]/30 hover:bg-gray-50 flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-[#0a1628]/60" />
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <span className="sm:hidden text-sm">Sort</span>
            </span>
            <span className="text-[#0a1628]/40">▼</span>
          </button>

          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 z-10 w-full sm:w-80 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="p-2 space-y-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      sortBy === option.value
                        ? "bg-[#d4a84b]/15 border border-[#d4a84b] text-[#0a1628]"
                        : "text-[#0a1628] hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-[#0a1628]/50">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-[#0a1628]/60">
          <span className="font-semibold text-[#0a1628]">{resultCount}</span> universities found
        </p>
        {sortBy !== "relevance" && (
          <p className="text-xs text-[#0a1628]/50">
            Sorted by: <span className="font-medium text-[#0a1628]">{currentSortLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
