import type { University, Region, RankingTier, ProgramCategory } from "@/lib/data/universities";
import type { FilterState } from "@/lib/types/filters";

export function filterUniversities(universities: University[], filters: FilterState): University[] {
  let filtered = universities;

  // Search filter
  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    filtered = filtered.filter((uni) => {
      const searchFields = [
        uni.name.toLowerCase(),
        uni.location.city.toLowerCase(),
        uni.location.region.toLowerCase(),
        uni.description.toLowerCase(),
        uni.programs.map((p) => p.name.toLowerCase()).join(" "),
        uni.tags.map((t) => t.toLowerCase()).join(" "),
      ].join(" ");
      return searchFields.includes(query);
    });
  }

  // Region filter
  if (filters.regions.length > 0) {
    filtered = filtered.filter((uni) => filters.regions.includes(uni.location.region));
  }

  // Ranking tier filter
  if (filters.rankingTiers.length > 0) {
    filtered = filtered.filter((uni) => filters.rankingTiers.includes(uni.ranking.tier));
  }

  // Program category filter
  if (filters.programCategories.length > 0) {
    filtered = filtered.filter((uni) =>
      uni.programs.some((prog) => filters.programCategories.includes(prog.category))
    );
  }

  // Budget filter
  const { min: budgetMin, max: budgetMax } = filters.budgetRange;
  if (budgetMin || budgetMax) {
    filtered = filtered.filter((uni) => {
      const programFees = uni.programs.map((p) => p.feeFrom);
      const maxFee = Math.max(...programFees);
      return maxFee >= budgetMin && maxFee <= budgetMax;
    });
  }

  // Rating filter
  if (filters.minRating && filters.minRating > 0) {
    filtered = filtered.filter((uni) => uni.rating >= filters.minRating!);
  }

  // Sorting
  switch (filters.sortBy) {
    case "ranking":
      filtered.sort((a, b) => {
        const tierOrder: Record<RankingTier, number> = {
          "Top 10": 1,
          "Top 50": 2,
          "Top 100": 3,
          "Top 200": 4,
          "Top 500": 5,
        };
        return tierOrder[a.ranking.tier] - tierOrder[b.ranking.tier];
      });
      break;

    case "price-low":
      filtered.sort((a, b) => {
        const minA = Math.min(...a.programs.map((p) => p.feeFrom));
        const minB = Math.min(...b.programs.map((p) => p.feeFrom));
        return minA - minB;
      });
      break;

    case "price-high":
      filtered.sort((a, b) => {
        const maxA = Math.max(...a.programs.map((p) => p.feeFrom));
        const maxB = Math.max(...b.programs.map((p) => p.feeFrom));
        return maxB - maxA;
      });
      break;

    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;

    case "acceptance":
      filtered.sort((a, b) => a.acceptanceRate - b.acceptanceRate);
      break;

    case "relevance":
    default:
      // Keep original order for relevance
      break;
  }

  return filtered;
}

export function getAvailableRegions(universities: University[], currentFilters: FilterState): Array<{ value: Region; label: string; count: number; isPopular: boolean }> {
  const regionCounts = new Map<Region, number>();
  const allRegions: Set<Region> = new Set();

  // First pass: count all regions
  universities.forEach((uni) => {
    allRegions.add(uni.location.region);
    regionCounts.set(uni.location.region, (regionCounts.get(uni.location.region) || 0) + 1);
  });

  // Apply all filters except regions
  const tempFilters = { ...currentFilters, regions: [] };
  const filtered = filterUniversities(universities, tempFilters);

  // Recount for filtered set
  const filteredRegionCounts = new Map<Region, number>();
  filtered.forEach((uni) => {
    filteredRegionCounts.set(uni.location.region, (filteredRegionCounts.get(uni.location.region) || 0) + 1);
  });

  const regions: Array<{ value: Region; label: string; count: number; isPopular: boolean }> = [];
  allRegions.forEach((region) => {
    const count = filteredRegionCounts.get(region) || 0;
    if (count > 0) {
      regions.push({
        value: region,
        label: region,
        count,
        isPopular: count > 10,
      });
    }
  });

  // Sort by popularity and count
  return regions.sort((a, b) => b.count - a.count);
}

export function getAvailablePrograms(universities: University[], currentFilters: FilterState): Array<{ value: ProgramCategory; label: string; count: number; isPopular: boolean }> {
  const programCounts = new Map<ProgramCategory, number>();
  const allPrograms: Set<ProgramCategory> = new Set();

  universities.forEach((uni) => {
    uni.programs.forEach((prog) => {
      allPrograms.add(prog.category);
      programCounts.set(prog.category, (programCounts.get(prog.category) || 0) + 1);
    });
  });

  const tempFilters = { ...currentFilters, programCategories: [] };
  const filtered = filterUniversities(universities, tempFilters);

  const filteredProgramCounts = new Map<ProgramCategory, number>();
  filtered.forEach((uni) => {
    uni.programs.forEach((prog) => {
      filteredProgramCounts.set(prog.category, (filteredProgramCounts.get(prog.category) || 0) + 1);
    });
  });

  const programs: Array<{ value: ProgramCategory; label: string; count: number; isPopular: boolean }> = [];
  allPrograms.forEach((prog) => {
    const count = filteredProgramCounts.get(prog) || 0;
    if (count > 0) {
      const labels: Record<ProgramCategory, string> = {
        Engineering: "Engineering",
        Business: "Business & Economics",
        Medicine: "Medicine & Health",
        Law: "Law",
        Sciences: "Pure Sciences",
        "Computer Science": "Computer Science",
        Arts: "Arts & Architecture",
        Humanities: "Humanities",
      };
      programs.push({
        value: prog,
        label: labels[prog],
        count,
        isPopular: count > 8,
      });
    }
  });

  return programs.sort((a, b) => b.count - a.count);
}

export function formatFee(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

export function getMinFee(university: University): number {
  return Math.min(...university.programs.map((p) => p.feeFrom));
}

export function getMaxFee(university: University): number {
  return Math.max(...university.programs.map((p) => p.feeFrom));
}
