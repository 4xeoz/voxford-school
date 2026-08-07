"use client";

import React from "react";
import Navbar from "./Navbar";
import FooterSection from "./FooterSection";
import type { Dictionary } from "@/dictionaries";

interface HomePageWrapperProps {
  children: React.ReactNode;
  locale: string;
  dict: Dictionary;
}

export default function HomePageWrapper({ children, locale, dict }: HomePageWrapperProps) {
  return (
    <div className="w-full bg-[--color-bg-primary] text-[--color-text-primary]">
      <Navbar locale={locale} dict={dict} />
      {children}
      <FooterSection dict={dict} locale={locale} />
    </div>
  );
}
