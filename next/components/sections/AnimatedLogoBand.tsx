"use client";

import { MarqueeDemo } from "../ui/HeroSectionUI/InfiniteMarquee";
import ScrollReveal from "../ui/ScrollReveal";

export default function AnimatedLogoBand() {
  return (
    <section className="w-full py-12 px-4 bg-[#F3F4F6]">
      <ScrollReveal className="max-w-7xl mx-auto" duration={0.7}>
        <MarqueeDemo />
      </ScrollReveal>
    </section>
  );
}
