import React from 'react';
import HomePageWrapper from '@/components/layout/HomePageWrapper';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedLogoBand from '@/components/sections/AnimatedLogoBand';
import PartnershipBar from '@/components/sections/PartnershipBar';
import WhyWeLovedSection from '@/components/sections/WhyWeLovedSection';
import SocialProofSection from '@/components/sections/SocialProofSection';
import UniShowcaseSection from '@/components/sections/UniShowcaseSection';
import VisitInstituteSection from '@/components/sections/VisitInstituteSection';
import RegistrationStepsSection from '@/components/sections/RegistrationStepsSection';
import TeamSection from '@/components/sections/TeamSection';
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
      <HomePageWrapper locale={locale} dict={dict}>
        <HeroSection dict={dict} />
        <PartnershipBar dict={dict} />
        <AnimatedLogoBand />
        <WhyWeLovedSection dict={dict} />
        <SocialProofSection dict={dict} />
        <VisitInstituteSection dict={dict} />
        <UniShowcaseSection dict={dict} />
        <TeamSection />
        <UpcomingEventsSection locale={locale} />
        <BlogSection locale={locale} />
        <RegistrationStepsSection dict={dict} />
      </HomePageWrapper>
    </>
  );
}
