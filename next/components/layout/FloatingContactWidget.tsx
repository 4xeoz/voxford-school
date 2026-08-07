"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { trackWhatsAppClick, trackPhoneCall } from "@/lib/gtag";

// ─── Icons ────────────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.13 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.5v2.42z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className={className}>
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}

// ─── Contact options ──────────────────────────────────────────────────────────

const CONTACTS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    sublabel: "Chat with us",
    href: "https://wa.me/447879003218",
    icon: WhatsAppIcon,
    bg: "#25D366",
    iconColor: "text-white",
    onTrack: () => trackWhatsAppClick("widget"),
  },
  {
    key: "phone1",
    label: "0560 409 193",
    sublabel: "Call us",
    href: "tel:+213560409193",
    icon: PhoneIcon,
    bg: "#0f172a",
    iconColor: "text-[#d4a84b]",
    onTrack: () => trackPhoneCall("0560409193"),
  },
  {
    key: "phone2",
    label: "0560 409 195",
    sublabel: "Call us",
    href: "tel:+213560409195",
    icon: PhoneIcon,
    bg: "#0f172a",
    iconColor: "text-[#d4a84b]",
    onTrack: () => trackPhoneCall("0560409195"),
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const wiggleControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Periodic attention-grab wiggle on the main button
  useEffect(() => {
    const runWiggle = async () => {
      if (isOpen) return;
      await wiggleControls.start({
        rotate: [0, -18, 18, -12, 12, -6, 6, 0],
        scale:  [1, 1.08, 1.08, 1.05, 1.05, 1.02, 1.02, 1],
        transition: { duration: 0.7, ease: "easeInOut" },
      });
    };

    // First wiggle after 3 s, then every 6 s
    const initial = setTimeout(runWiggle, 3000);
    intervalRef.current = setInterval(runWiggle, 6000);

    return () => {
      clearTimeout(initial);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, wiggleControls]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 md:right-6"
    >
      {/* Expanded contact options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.key}
                href={c.href}
                target={c.key === "whatsapp" ? "_blank" : undefined}
                rel={c.key === "whatsapp" ? "noopener noreferrer" : undefined}
                onClick={() => { c.onTrack(); setIsOpen(false); }}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.2, delay: i * 0.06, ease: "easeOut" }}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 shadow-xl backdrop-blur-md transition-transform hover:-translate-x-1"
                style={{ backgroundColor: c.bg }}
              >
                {/* Icon bubble */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <c.icon className={`h-5 w-5 ${c.iconColor}`} />
                </div>
                {/* Labels */}
                <div className="pr-1">
                  <p className="text-xs font-medium text-white/60 leading-none mb-0.5">{c.sublabel}</p>
                  <p className="text-sm font-bold text-white leading-none">{c.label}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main trigger button */}
      <div className="relative">
        {/* Ripple rings — only when closed */}
        {!isOpen && (
          <>
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
              animate={{ scale: [1, 2], opacity: [0.45, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
              animate={{ scale: [1, 2], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
          </>
        )}

        <motion.button
          animate={wiggleControls}
          onClick={() => setIsOpen((o: boolean) => !o)}
          aria-label="Contact us"
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl shadow-black/40 transition-shadow hover:shadow-[#25D366]/30 focus:outline-none md:h-16 md:w-16"
          style={{ backgroundColor: isOpen ? "#1a1a2e" : "#25D366" }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <CloseIcon className="h-5 w-5 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="wa"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <WhatsAppIcon className="h-7 w-7 text-white md:h-8 md:w-8" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
