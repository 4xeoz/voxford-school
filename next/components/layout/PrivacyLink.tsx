import Link from "next/link";
import type { Locale } from "@/i18n.config";

const labels: Record<Locale, string> = {
  en: "Website privacy",
  fr: "Confidentialité du site",
  ar: "خصوصية الموقع",
};

export default function PrivacyLink({ locale, className }: { locale: string; className?: string }) {
  const language: Locale = locale === "ar" || locale === "fr" ? locale : "en";
  return <Link href={`/${language}/privacy`} className={className}>{labels[language]}</Link>;
}
