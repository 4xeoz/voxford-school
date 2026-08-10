import React from 'react';
import HomePageWrapper from '@/components/layout/HomePageWrapper';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedLogoBand from '@/components/sections/AnimatedLogoBand';
import VideoTeaserSection from '@/components/sections/VideoTeaserSection';
import BlogSection from '@/components/sections/BlogSection';
import UpcomingEventsSection from '@/components/sections/UpcomingEventsSection';
import JsonLd from '@/components/seo/JsonLd';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/i18n.config';

export const dynamic = "force-dynamic";

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
      {/* Hidden for now: <VisitInstituteSection dict={dict} /> ("Our School")
          and <TeamSection /> ("Pure talent"). Both components still exist —
          re-import and drop them back in to restore. */}
      <HomePageWrapper locale={locale} dict={dict}>
        <HeroSection locale={locale} dict={dict} />
        <AnimatedLogoBand />
        <VideoTeaserSection dict={dict} />
        <UpcomingEventsSection locale={locale} />
        <BlogSection locale={locale} />
      </HomePageWrapper>
    </>
  );
}
