"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  initials: string;
  color: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Eyad Cherifi",
    role: "Uk Representative & Co-Founder",
    department: "Leadership",
    bio: "Former Oxford Brookes student who founded Nopeca to make UK education accessible for every Algerian student. 7+ years guiding students through admissions and visas.",
    image: "/team/Eyad-cherifi.png",
    initials: "AB",
    color: "#0a1628",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 2,
    name: "Mellisa zouzou",
    role: "Co-Founder & Head of Admissions",
    department: "Admissions",
    bio: "Expert in UCAS applications and university matching. Has personally guided 300+ students to UK universities including UCL, Manchester, and Royal Holloway.",
    image: "",
    initials: "SM",
    color: "#1a3a6b",
    linkedin: "#",
    instagram: "#",
  },
  {
    id: 3,
    name: "Karim Oualid",
    role: "Visa Specialist",
    department: "Visa",
    bio: "Certified immigration advisor with a 98% UK student visa approval rate. Specialises in Algerian students' documentation and financial requirements.",
    image: "",
    initials: "KO",
    color: "#d4a84b",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 4,
    name: "Lina Haddad",
    role: "Student Success Manager",
    department: "Support",
    bio: "Coordinates arrival support, accommodation, and onboarding for students landing in the UK. Previously studied at University of Manchester.",
    image: "",
    initials: "LH",
    color: "#2e7d32",
    linkedin: "#",
    instagram: "#",
  },
  {
    id: 5,
    name: "Yacine Ferhat",
    role: "Scholarship Advisor",
    department: "Admissions",
    bio: "Tracks and applies for scholarships and bursaries on behalf of students. Has secured over £2M in funding for Algerian students across UK universities.",
    image: "",
    initials: "YF",
    color: "#6a1b9a",
    linkedin: "#",
    twitter: "#",
  },
];

const DEPARTMENTS = ["All", "Leadership", "Admissions", "Visa", "Support"];

const PARTNER_LOGOS = [
  { text: "UniPartner", color: "#6a1b9a", bg: "#f3e8ff" },
  { text: "EduLink", color: "#1565c0", bg: "#e3f2fd" },
  { text: "StudyPro", color: "#c62828", bg: "#ffebee" },
  { text: "VisaXpert", color: "#e65100", bg: "#fff3e0" },
];

function BioModal({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top color band */}
        <div
          className="h-24 w-full"
          style={{ backgroundColor: member.color }}
        />

        {/* Avatar */}
        <div className="absolute left-6 top-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white shadow-lg"
          style={{ backgroundColor: member.color + "22" }}>
          {member.image ? (
            <Image src={member.image} alt={member.name} fill className="object-cover" />
          ) : (
            <span className="text-2xl font-bold" style={{ color: member.color }}>
              {member.initials}
            </span>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pb-6 pt-16">
          <span
            className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: member.color + "15", color: member.color }}
          >
            {member.department}
          </span>
          <h3 className="mt-2 text-xl font-bold text-[#0a1628]">{member.name}</h3>
          <p className="text-sm font-medium text-[#0a1628]/50">{member.role}</p>
          <p className="mt-4 text-sm leading-relaxed text-[#0a1628]/70">{member.bio}</p>

          {/* Social */}
          <div className="mt-5 flex gap-2">
            {member.linkedin && (
              <a
                href={member.linkedin}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a1628]/5 text-[#0a1628]/50 transition hover:bg-[#0a1628] hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a1628]/5 text-[#0a1628]/50 transition hover:bg-[#0a1628] hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {member.instagram && (
              <a
                href={member.instagram}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a1628]/5 text-[#0a1628]/50 transition hover:bg-[#0a1628] hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setActiveIndex(idx);
    }
  }, []);

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
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft ?? 0);
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }
  function onMouseUp() { isDragging.current = false; }

  return (
    <>
      <section id="team" className="bg-white py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Left */}
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-[--color-brand-primary]">
                <span className="h-2 w-2 rounded-full bg-[--color-brand-secondary]" />
                Pure talent
              </span>
              <h2 className="mt-4 text-4xl font-bold leading-tight text-[--color-brand-primary] sm:text-5xl">
                Meet our team
              </h2>
              <p className="mt-3 text-base text-[--color-text-primary]/60">
                Passionate experts who&apos;ve been through the journey themselves.
                <br />
                We know exactly what it takes to get you to your dream university.
              </p>
            </div>

            {/* Right */}
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex h-11 items-center rounded-full bg-[--color-brand-primary] px-6 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Get started
              </a>
              <a
                href="#universities"
                className="inline-flex h-11 items-center rounded-full border border-[--color-border-soft] bg-white px-6 text-sm font-semibold text-[--color-brand-primary] transition hover:border-[--color-brand-primary]/40"
              >
                Explore universities
              </a>
            </div>
          </div>



          {/* ── Carousel ─────────────────────────────────────────── */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollSnapType: "x mandatory" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {TEAM.map((member, i) => (
              <div key={member.id} data-card className="flex flex-col w-52 shrink-0 sm:w-60 md:w-72 lg:w-80">
                {/* Image Card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
                  style={{ scrollSnapAlign: "start" }}
                  className="group relative w-full h-64 md:h-96 rounded-2xl border border-[--color-border-soft] bg-white shadow-sm transition hover:shadow-md overflow-hidden"
                >
                  {/* Photo - takes full height */}
                  <div
                    className="relative h-full w-full overflow-hidden"
                    style={{ backgroundColor: member.color + "18" }}
                  >
                    {member.image ? (
                      <Image src={member.image} alt={member.name} fill className="object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold" style={{ color: member.color }}>
                        {member.initials}
                      </div>
                    )}
                  </div>

                  {/* Social icons - inside card, top right in column */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[--color-brand-primary] transition hover:bg-white hover:text-[--color-brand-primary]">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[--color-brand-primary] transition hover:bg-white hover:text-[--color-brand-primary]">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[--color-brand-primary] transition hover:bg-white hover:text-[--color-brand-primary]">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Info - outside card, below image */}
                <button
                  className="text-left mt-4"
                  onClick={() => setSelectedMember(member)}
                >
                  <p className="font-bold text-[--color-brand-primary]">{member.name}</p>
                  <p className="mt-0.5 text-sm text-[--color-text-primary]/55">{member.role}</p>
                  <span
                    className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium w-fit"
                    style={{ backgroundColor: member.color + "15", color: member.color }}
                  >
                    {member.department}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* ── Pagination dots ──────────────────────────────────── */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {TEAM.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? "w-8 bg-[--color-brand-primary]"
                    : "w-4 bg-[--color-brand-primary]/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bio Modal ──────────────────────────────────────────────── */}
      {selectedMember && (
        <BioModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </>
  );
}
