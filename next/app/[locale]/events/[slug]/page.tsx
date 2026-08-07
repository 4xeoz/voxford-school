import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import { getEventBySlug } from "@/actions/events";
import Navbar from "@/components/layout/Navbar";
import RegisterClient from "./register-client";
import type { Metadata } from "next";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.name} — Nopeca`,
    description: event.description,
  };
}

export default async function EventPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const isPast = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Navbar locale={locale} dict={dict} />

      {/* ── Event hero ──────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1628] px-4 pb-16 pt-28 md:pt-36 overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover opacity-15"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1628]/80" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Event badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4a84b]/30 bg-[#d4a84b]/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#d4a84b] animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a84b]">
              Nopeca Event
            </p>
          </div>

          {/* Title */}
          <h1 className="text-balance text-3xl font-bold leading-tight text-[#f5f0e8] sm:text-4xl md:text-5xl mb-8">
            {event.name}
          </h1>

          {/* Event details cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date card */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-3 hover:bg-white/8 transition-colors">
              <p className="text-white/50 text-xs font-medium mb-1">DATE & TIME</p>
              <div className="flex items-center gap-2 justify-center">
                <svg className="h-4 w-4 text-[#d4a84b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                <span className="text-white/80 text-sm font-medium">
                  {format(new Date(event.date), "MMM d, yyyy · HH:mm")}
                </span>
              </div>
            </div>

            {/* Location card with direct map link */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-3 hover:bg-[#d4a84b]/20 hover:border-[#d4a84b]/50 transition-all group cursor-pointer"
            >
              <p className="text-white/50 text-xs font-medium mb-1">LOCATION</p>
              <div className="flex items-center gap-2 justify-center">
                <svg className="h-4 w-4 text-[#d4a84b] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  {event.location}
                </span>
              </div>
            </a>

            {/* Registrations count */}
            {event._count.registrations > 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-3 hover:bg-white/8 transition-colors">
                <p className="text-white/50 text-xs font-medium mb-1">GOING</p>
                <div className="flex items-center gap-2 justify-center">
                  <svg className="h-4 w-4 text-[#d4a84b]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  <span className="text-white/80 text-sm font-bold text-[#d4a84b]">
                    {event._count.registrations}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────── */}
      <section className="px-4 py-8 bg-gradient-to-b from-[#f5f0e8] to-white">
        <div className="mx-auto max-w-6xl">

          {/* Compact Event Info - Quick Access */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-white border border-[#e5e0d5] p-3 text-center">
              <p className="text-xs text-[#0a1628]/50 mb-1">📅 DATE</p>
              <p className="text-sm font-bold text-[#0a1628]">{format(new Date(event.date), "MMM d")}</p>
            </div>
            <div className="rounded-lg bg-white border border-[#e5e0d5] p-3 text-center">
              <p className="text-xs text-[#0a1628]/50 mb-1">🕐 TIME</p>
              <p className="text-sm font-bold text-[#0a1628]">{format(new Date(event.date), "HH:mm")}</p>
            </div>
            {event._count.registrations > 0 && (
              <div className="rounded-lg bg-white border border-[#e5e0d5] p-3 text-center">
                <p className="text-xs text-[#0a1628]/50 mb-1">👥 GOING</p>
                <p className="text-sm font-bold text-[#d4a84b]">{event._count.registrations}</p>
              </div>
            )}
            <div className="rounded-lg bg-white border border-[#e5e0d5] p-3 text-center">
              <p className="text-xs text-[#0a1628]/50 mb-1">📍 LOCATION</p>
              <p className="text-xs font-bold text-[#0a1628] line-clamp-1">{event.location}</p>
            </div>
          </div>

          {/* Main content grid - 50/50 Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

            {/* Left column: Description + Location */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-white p-5 shadow-md border border-[#e5e0d5]">
                <h2 className="text-lg font-black text-[#0a1628] mb-2">About This Event</h2>
                <p className="whitespace-pre-wrap leading-relaxed text-[#0a1628]/70 text-sm line-clamp-4">
                  {event.description}
                </p>
              </div>

              {/* Location + Maps Button */}
              <div className="rounded-2xl bg-gradient-to-br from-white to-[#f5f0e8] border border-[#d4a84b]/20 p-5 shadow-md">
                <h3 className="text-base font-black text-[#0a1628] mb-3">📍 {event.location}</h3>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4a84b] to-[#c49a3d] hover:from-[#c49a3d] hover:to-[#b8883d] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Right column: Registration & CTA section (1 col) */}
            <div className="flex flex-col gap-6">
              {/* Registration form - shown when event is active */}
              {!isPast && event.isActive && (
                <>
                  <RegisterClient eventId={event.id} />
                </>
              )}

              {/* Quick contact options */}
              {(isPast || !event.isActive) && (
                <div className="rounded-3xl bg-gradient-to-br from-[#25D366] to-[#1a9f4b] p-8 shadow-xl text-white text-center">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">Registration Closed?</p>
                  <h3 className="text-2xl font-black mb-4">Contact Us</h3>
                  <p className="text-sm mb-6 opacity-90">Get on the waitlist or ask about upcoming events</p>
                  <a
                    href="https://wa.me/447879003218"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-white text-[#25D366] font-bold py-4 px-6 rounded-2xl hover:bg-[#f0f0f0] active:scale-[0.98] transition-all shadow-lg"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Open WhatsApp
                  </a>
                </div>
              )}

              {/* Show these even when registration is closed */}
              {(!isPast && event.isActive) && (
                <>
                  {/* WhatsApp CTA - PROMINENT */}
                  <div className="rounded-3xl bg-gradient-to-br from-[#25D366] to-[#1a9f4b] p-8 shadow-xl text-white text-center">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">Quick Contact</p>
                    <h3 className="text-2xl font-black mb-4">Chat with Us</h3>
                    <p className="text-sm mb-6 opacity-90">Get instant answers about this event</p>
                    <a
                      href="https://wa.me/447879003218"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-white text-[#25D366] font-bold py-4 px-6 rounded-2xl hover:bg-[#f0f0f0] active:scale-[0.98] transition-all shadow-lg"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Open WhatsApp
                    </a>
                  </div>

                  {/* Phone CTA */}
                  <a
                    href="tel:+213560409193"
                    className="rounded-2xl bg-white border-2 border-[#0a1628]/10 p-6 text-center hover:border-[#d4a84b] hover:bg-[#f5f0e8] transition-all shadow-md"
                  >
                    <p className="text-xs font-medium text-[#0a1628]/50 mb-2">📞 CALL US</p>
                    <p className="text-2xl font-black text-[#0a1628]">0560 409 193</p>
                  </a>
                </>
              )}

              {/* Registration status */}
              <div className="rounded-2xl bg-[#0a1628] text-white p-6 text-center">
                <p className="text-xs font-medium uppercase tracking-wider mb-2 opacity-75">Registration Status</p>
                <p className="text-lg font-bold">
                  {isPast || !event.isActive ? (
                    <span className="text-red-400">Registration Closed</span>
                  ) : (
                    <span className="text-[#25D366]">✓ Now Open</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
