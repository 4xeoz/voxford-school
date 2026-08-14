"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import poster from "@/public/voxbridge/building-warrped-gift.png";
import type { Dictionary } from "@/dictionaries";

/**
 * Paste the teaser video URL here (MP4, or any direct file URL).
 * Leave it empty and the section renders as a still with no play control,
 * so it degrades to a plain image rather than an interactive dead end.
 */
const VIDEO_URL = "";

interface Props {
  dict: Dictionary;
}

export default function VideoTeaserSection({ dict }: Props) {
  const t = dict.teaser;
  const [open, setOpen] = useState(false);

  // Close on Escape, and stop the page scrolling behind the lightbox.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="teaser" className="bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-bright" />
            {t.badge}
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60">
            {t.subtitle}
          </p>
        </div>

        {/* Poster. The video itself is only fetched once the lightbox opens,
            so this section costs one image on load rather than a whole MP4. */}
        <div className="group relative aspect-video overflow-hidden rounded-3xl ring-1 ring-white/10">
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-ink/45" />

          {VIDEO_URL && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={t.cta}
            >
              <span className="flex items-center gap-3 rounded-full bg-white/95 py-3 ps-3 pe-6 font-bold text-ink shadow-2xl transition group-hover:scale-105">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand">
                  <Play className="h-4 w-4 fill-white text-white rtl:-scale-x-100" />
                </span>
                {t.cta}
              </span>
            </button>
          )}
        </div>
      </div>

      {open && VIDEO_URL && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute end-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <video
            src={VIDEO_URL}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-4xl rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
