import type { Region, RankingTier, ProgramCategory } from "@/lib/data/universities";

export interface FilterState {
  search: string;
  regions: Region[];
  rankingTiers: RankingTier[];
  programCategories: ProgramCategory[];
  budgetRange: { min: number; max: number };
  minRating?: number;
  sortBy: "relevance" | "ranking" | "price-low" | "price-high" | "rating" | "acceptance";
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
  isPopular?: boolean;
}

export interface SmartFilterGroup {
  id: string;
  title: string;
  type: "radio" | "checkbox" | "range";
  icon?: string;
  options?: FilterOption[];
  collapsible?: boolean;
  expanded?: boolean;
}

export const BUDGET_RANGE_MIN = 10000;
export const BUDGET_RANGE_MAX = 50000;
export const BUDGET_STEP = 1000;

export const DEFAULT_FILTER_STATE: FilterState = {
  search: "",
  regions: [],
  rankingTiers: [],
  programCategories: [],
  budgetRange: { min: BUDGET_RANGE_MIN, max: BUDGET_RANGE_MAX },
  sortBy: "relevance",
};

export const REGION_LABELS: Record<Region, string> = {
  London: "London",
  Manchester: "Manchester & Northwest",
  Edinburgh: "Edinburgh & Scotland",
  Oxford: "Oxford",
  Cambridge: "Cambridge",
  Bristol: "Bristol & Southwest",
  Wales: "Wales",
  Other: "Other Regions",
};

export const RANKING_TIER_LABELS: Record<RankingTier, string> = {
  "Top 10": "Top 10 Globally",
  "Top 50": "Top 50 Globally",
  "Top 100": "Top 100 Globally",
  "Top 200": "Top 200 Globally",
  "Top 500": "Top 500 Globally",
};

export const PROGRAM_CATEGORY_LABELS: Record<ProgramCategory, string> = {
  Engineering: "Engineering",
  Business: "Business & Economics",
  Medicine: "Medicine & Health Sciences",
  Law: "Law",
  Sciences: "Pure Sciences",
  "Computer Science": "Computer Science & IT",
  Arts: "Arts & Architecture",
  Humanities: "Humanities & Languages",
};
