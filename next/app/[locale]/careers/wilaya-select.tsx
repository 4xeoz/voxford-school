"use client";

import { WILAYAS } from "@/lib/wilayas";

export default function WilayaSelect({
  locale,
  defaultValue,
  placeholder,
  className,
}: {
  locale: string;
  defaultValue?: number | null;
  placeholder: string;
  className?: string;
}) {
  return (
    <select
      name="wilayaCode"
      required
      defaultValue={defaultValue ?? ""}
      className={className}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {WILAYAS.map((w) => (
        <option key={w.code} value={w.code}>
          {String(w.code).padStart(2, "0")} —{" "}
          {locale === "ar" ? w.nameAr : w.nameLatin}
        </option>
      ))}
    </select>
  );
}
