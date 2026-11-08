export const PROGRAMME_INTERESTS = [
  "language-classes",
  "holiday-study-trip",
  "study-abroad-enquiry",
  "classes-and-trip",
  "help-me-choose",
] as const;

export type ProgrammeInterest = (typeof PROGRAMME_INTERESTS)[number];

export const PROGRAMME_INTEREST_LABELS: Record<ProgrammeInterest, string> = {
  "language-classes": "Language classes at Voxbridge",
  "holiday-study-trip": "Language study trip during school breaks",
  "study-abroad-enquiry": "Studying abroad enquiry",
  "classes-and-trip": "Language classes and a study trip",
  "help-me-choose": "Help choosing a programme",
};

export function isProgrammeInterest(value: unknown): value is ProgrammeInterest {
  return typeof value === "string" && PROGRAMME_INTERESTS.some(interest => interest === value);
}
