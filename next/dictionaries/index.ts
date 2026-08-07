import type { Locale } from "@/i18n.config";

const dictionaries = {
  en: () => import("./en.json").then((m) => m.default),
  fr: () => import("./fr.json").then((m) => m.default),
  ar: () => import("./ar.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale as keyof typeof dictionaries];
  if (!loader) return dictionaries.en();
  return loader();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
