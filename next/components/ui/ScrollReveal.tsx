"use client";

import { motion, type TargetAndTransition } from "motion/react";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  /** Slide-in direction (default: "up") */
  direction?: Direction;
  /** Delay in seconds before the animation starts */
  delay?: number;
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Distance in pixels for the slide (default: 40) */
  distance?: number;
  /** Extra class names forwarded to the wrapper */
  className?: string;
  /** Animate only once when entering viewport (default: true) */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger (default: 0.15) */
  amount?: number;
  /** HTML tag to render — keeps semantic markup intact */
  as?: "div" | "section" | "header" | "span";
}

function getInitial(direction: Direction, distance: number): TargetAndTransition {
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign =
    direction === "up" || direction === "left" ? 1 : -1;
  return { opacity: 0, [axis]: distance * sign };
}

const visible: TargetAndTransition = { opacity: 1, x: 0, y: 0 };

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 40,
  className,
  once = true,
  amount = 0.15,
  as = "div",
}: ScrollRevealProps) {
  const Tag = motion[as];

  return (
    <Tag
      initial={getInitial(direction, distance)}
      whileInView={visible}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Tag>
  );
}
