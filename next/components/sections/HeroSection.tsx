import Image from "next/image";
import crest from "@/public/voxford/icon-detailed-red-transparent-v2.png";
import HeroRing from "./HeroRing";
import HeroCtas from "./HeroCtas";
import type { Dictionary } from "@/dictionaries";

interface HeroSectionProps {
  locale: string;
  dict: Dictionary;
}

export default function HeroSection({ locale, dict }: HeroSectionProps) {
  const h = dict.hero;

  return (
    // overflow-hidden: the ring's cards start off-screen, which would otherwise
    // widen the page and flash a horizontal scrollbar while they fly in.
    <section
      id="home"
      className="relative w-full flex flex-col justify-center overflow-hidden bg-surface-soft min-h-fit h-[80svh]"
    >
      <HeroRing />

      {/* pt clears the floating navbar, which overlays this section */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-28 sm:px-6 lg:pb-20 lg:pt-36">

        {/* ── Centred copy ── */}
        <div className="flex flex-col items-center text-center">
          <Image
            src={crest}
            alt="Voxford language school"
            priority
            className="mb-7 h-20 w-auto lg:h-28"
          />

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand sm:text-xs sm:tracking-[0.28em]">
            {h.eyebrow}
          </p>

          {/* 16ch / text-6xl: this headline is two lines per half, so it is
              capped narrower and one step smaller than a short headline would
              be — that keeps it clear of the HeroRing cards at every width. */}
          <h1 className="mt-5 max-w-[16ch] text-3xl font-black leading-[0.95] tracking-[-0.03em] text-ink sm:text-4xl md:text-5xl lg:text-6xl">
            {h.headlineTop}
            <span className="block text-brand">{h.headlineBottom}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {h.lead}
            <span className="block">{h.leadSecondary}</span>
          </p>

          {/* Nothing is bookable before launch, so the hero's two exits are a
              direct WhatsApp chat and the pre-registration form. */}
          <HeroCtas locale={locale} dict={dict} />
        </div>

      </div>
    </section>
  );
}
