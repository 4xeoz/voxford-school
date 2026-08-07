"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        // Smoothness: lower = smoother (0.05-0.15 recommended)
        lerp: 0.08,
        // Duration of the scroll animation
        duration: 1.2,
        // Easing function
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Scroll direction
        orientation: "vertical",
        // Gesture direction
        gestureOrientation: "vertical",
        // Smooth scroll on touch devices
        smoothWheel: true,
        // Multiplier for wheel scroll
        wheelMultiplier: 1,
        // Multiplier for touch scroll
        touchMultiplier: 2,
        // Infinite scroll
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
