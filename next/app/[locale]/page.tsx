import React from 'react';
import HomePageWrapper from '@/components/layout/HomePageWrapper';
import OpenHomeExperience from '@/components/sections/OpenHomeExperience';
import JsonLd from '@/components/seo/JsonLd';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/i18n.config';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <JsonLd locale={locale} dict={dict} />
      <HomePageWrapper locale={locale} dict={dict}>
        <OpenHomeExperience locale={locale} />
      </HomePageWrapper>
    </>
  );
}
