import React from "react";
import Navbar from "./Navbar";
import OpenFooter from "./OpenFooter";
import type { Dictionary } from "@/dictionaries";

interface HomePageWrapperProps {
  children: React.ReactNode;
  locale: string;
  dict: Dictionary;
}

export default async function HomePageWrapper({ children, locale, dict }: HomePageWrapperProps) {
  return (
    <div className="w-full bg-surface text-ink-soft">
      <Navbar locale={locale} dict={dict} />
      {children}
      <OpenFooter dict={dict} locale={locale} />
    </div>
  );
}
