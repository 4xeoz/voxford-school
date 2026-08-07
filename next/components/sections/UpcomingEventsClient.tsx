"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface EventItem {
  id: string;
  name: string;
  description: string;
  location: string;
  date: Date;
  slug: string;
  imageUrl: string | null;
  _count: { registrations: number };
}

interface Props {
  events: EventItem[];
  locale: string;
}

const CARD_COLORS = [
  { bg: "#0a1628", text: "#f5f0e8" },
  { bg: "#1a3a6b", text: "#f5f0e8" },
  { bg: "#d4a84b", text: "#0a1628" },
  { bg: "#2e4057", text: "#f5f0e8" },
  { bg: "#1b4332", text: "#f5f0e8" },
  { bg: "#4a1942", text: "#f5f0e8" },
];

const labels: Record<string, {
  badge: string;
  title: string;
  exploreAll: string;
  viewDetails: string;
  addToCalendar: string;
  soldOut: string;
  limitedSpots: string;
  registered: string;
}> = {
  en: {
    badge: "Connect",
    title: "Upcoming events",
    exploreAll: "Explore all",
    viewDetails: "View details",
    addToCalendar: "Add to calendar",
    soldOut: "Sold out",
    limitedSpots: "Limited spots",
    registered: "registered",
  },
  fr: {
    badge: "Se connecter",
    title: "Événements à venir",
    exploreAll: "Voir tout",
    viewDetails: "Voir les détails",
    addToCalendar: "Ajouter au calendrier",
    soldOut: "Complet",
    limitedSpots: "Places limitées",
    registered: "inscrits",
  },
  ar: {
    badge: "تواصل",
    title: "الفعاليات القادمة",
    exploreAll: "استكشف الكل",
    viewDetails: "عرض التفاصيل",
    addToCalendar: "أضف إلى التقويم",
    soldOut: "نفذت التذاكر",
    limitedSpots: "أماكن محدودة",
    registered: "مسجل",
  },
};

function formatDate(date: Date, locale: string) {
  return new Date(date).toLocaleDateString(
    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

function formatDay(date: Date) {
  return new Date(date).getDate();
}

function formatMonth(date: Date, locale: string) {
  return new Date(date).toLocaleDateString(
    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB",
    { month: "short" }
  );
}

function toCalendarHref(event: EventItem) {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hrs
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description.slice(0, 300))}`;
}

export default function UpcomingEventsClient({ events, locale }: Props) {
  const l = labels[locale] || labels.en;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const isHovered = useRef(false);

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const target = cards[idx];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft - 16, behavior: "smooth" });
    setActiveIndex(idx);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % events.length;
      scrollTo(next);
      return next;
    });
  }, [events.length, scrollTo]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => {
      const p = (prev - 1 + events.length) % events.length;
      scrollTo(p);
      return p;
    });
  }, [events.length, scrollTo]);

  // Auto-advance every 5s, pause on hover
  useEffect(() => {
    function start() {
      intervalRef.current = setInterval(() => {
        if (!isHovered.current) next();
      }, 5000);
    }
    start();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  // Track active card on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - el.getBoundingClientRect().left);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIndex(closest);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Drag-to-scroll
  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeftRef.current = scrollRef.current?.scrollLeft ?? 0;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current);
  }
  function onMouseUp() { isDragging.current = false; }

  return (
    <section id="events" className="bg-[#F3F4F6] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-[--color-brand-secondary]">
              <span className="h-2 w-2 rounded-full bg-[--color-brand-secondary]" />
              {l.badge}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[--color-brand-primary] sm:text-4xl lg:text-5xl">
              {l.title}
            </h2>
          </div>

          {/* Right — nav arrows */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/events`}
              className="hidden rounded-full border border-[--color-border-soft] px-5 py-2 text-sm font-semibold text-[--color-brand-primary] transition hover:border-[--color-brand-primary]/40 sm:inline-flex"
            >
              {l.exploreAll}
            </Link>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[--color-border-soft] text-[--color-brand-primary] transition hover:bg-[--color-brand-primary] hover:text-white hover:border-transparent"
                aria-label="Previous"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[--color-border-soft] text-[--color-brand-primary] transition hover:bg-[--color-brand-primary] hover:text-white hover:border-transparent"
                aria-label="Next"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Cards carousel ─────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
          style={{ scrollSnapType: "x mandatory" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseEnter={() => { isHovered.current = true; }}
          onMouseOut={() => { isHovered.current = false; }}
        >
          {events.map((event, i) => {
            const color = CARD_COLORS[i % CARD_COLORS.length];
            const isLimited = event._count.registrations > 30 && event._count.registrations <= 50;
            const isSoldOut = event._count.registrations > 50;

            return (
              <motion.div
                key={event.id}
                data-card
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
                style={{ scrollSnapAlign: "start", backgroundColor: color.bg }}
                className="group relative flex w-72 shrink-0 flex-col overflow-hidden rounded-3xl shadow-md transition hover:shadow-xl sm:w-80"
                onMouseEnter={() => { isHovered.current = true; }}
                onMouseLeave={() => { isHovered.current = false; }}
              >
                {/* Image or colored top area */}
                <div className="relative h-44 w-full overflow-hidden">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 288px, 320px"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center opacity-20"
                      style={{ backgroundColor: color.bg }}
                    >
                      <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={0.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                    </div>
                  )}

                  {/* Date badge */}
                  <div className="absolute right-3 top-3 flex flex-col items-center rounded-xl bg-white px-3 py-2 text-center shadow-md">
                    <span className="text-xl font-bold leading-none text-[#0a1628]">
                      {formatDay(event.date)}
                    </span>
                    <span className="mt-0.5 text-xs font-semibold uppercase text-[#0a1628]/60">
                      {formatMonth(event.date, locale)}
                    </span>
                  </div>

                  {/* Status badge */}
                  {(isSoldOut || isLimited) && (
                    <div className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                      isSoldOut ? "bg-red-500 text-white" : "bg-[#d4a84b] text-[#0a1628]"
                    }`}>
                      {isSoldOut ? l.soldOut : l.limitedSpots}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5" style={{ color: color.text }}>
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs opacity-60">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-2 text-lg font-bold leading-snug line-clamp-2">
                    {event.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed opacity-70 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link
                      href={`/${locale}/events/${event.slug}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/15 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25"
                      style={{ color: color.text }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {l.viewDetails}
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>

                    {/* Add to calendar (shown on hover) */}
                    <a
                      href={toCalendarHref(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 opacity-0 backdrop-blur-sm transition hover:bg-white/25 group-hover:opacity-100"
                      title={l.addToCalendar}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: color.text }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Pagination dots ──────────────────────────────────────── */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "w-8 bg-[--color-brand-primary]"
                  : "w-3 bg-[--color-brand-primary]/20"
              }`}
            />
          ))}
        </div>

        {/* ── Mobile explore all link ───────────────────────────── */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href={`/${locale}/events`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[--color-brand-primary]"
          >
            {l.exploreAll}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
