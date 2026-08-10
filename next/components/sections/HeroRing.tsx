"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import img1 from "@/public/arc_gallery/image-gen (1).png";
import img2 from "@/public/arc_gallery/image-gen (3).png";
import img3 from "@/public/arc_gallery/image-gen (5).png";
import img4 from "@/public/arc_gallery/image-gen (12).png";
import img5 from "@/public/arc_gallery/image-gen (14).png";
import img6 from "@/public/arc_gallery/image-gen (16).png";

const CARD = 192; // px — must match h-48 w-48 below
const RX = 600; // horizontal radius: wide, to clear the headline
const RY = 310; // vertical radius: shorter, to stay inside the hero

/**
 * Angles in degrees, three down each side. Deliberately none at 90° or 270°,
 * so the vertical centreline stays clear for the crest above the copy and the
 * CTAs below it. The ellipse is much wider than it is tall, which is what keeps
 * the cards beside the text rather than on top of it.
 */
const ANGLES = [-35, 0, 35, 145, 180, 215];

const IMAGES = [img1, img2, img3, img4, img5, img6];

export default function HeroRing() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Zero-size anchor at the centre; scaling it scales the whole ring.
          The steps keep the outermost card edge (RX + CARD/2 = 696px) inside
          half the viewport at each breakpoint, so nothing gets clipped. */}
      <div className="absolute left-1/2 top-1/2 scale-[0.68] xl:scale-90 2xl:scale-100">
        {ANGLES.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = Math.cos(rad) * RX - CARD / 2;
          const y = Math.sin(rad) * RY - CARD / 2;

          return (
            <motion.div
              key={i}
              // Drop straight down into place: same x, starting well above the fold.
              initial={reduced ? false : { x, y: y - 900, opacity: 0 }}
              animate={{ x, y, opacity: 1 }}
              transition={{
                delay: 0.15 + i * 0.1,
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute h-48 w-48 overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5"
            >
              <Image src={IMAGES[i]} alt="" fill sizes="192px" className="object-cover" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
