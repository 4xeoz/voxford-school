import React from "react";
import Navbar from "./Navbar";
import FooterSection from "./FooterSection";
import { getPreRegistrationCount } from "@/actions/contact";
import type { Dictionary } from "@/dictionaries";

interface HomePageWrapperProps {
  children: React.ReactNode;
  locale: string;
  dict: Dictionary;
}

export default async function HomePageWrapper({ children, locale, dict }: HomePageWrapperProps) {
  const claimed = await getPreRegistrationCount();

  return (
    <div className="w-full bg-surface text-ink-soft">
      <Navbar locale={locale} dict={dict} />
      {children}
      <FooterSection dict={dict} locale={locale} claimed={claimed} />
    </div>
  );
}
