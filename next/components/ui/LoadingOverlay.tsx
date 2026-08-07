'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

const panels = [
  { id: 'panel-top', className: 'bg-[--color-brand-primary] z-20' },        // darker blue
  { id: 'panel-bottom', className: 'bg-[--color-brand-secondary] z-10' },   // yellow/gold
];

export default function LoadingOverlay() {
  const [loaded, setLoaded] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const onReady = () => setLoaded(true);
    if (document.readyState === 'complete') onReady();
    else window.addEventListener('load', onReady);
    return () => window.removeEventListener('load', onReady);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const ready = loaded && minTimePassed;

  useEffect(() => {
    if (!ready) return;
    // Mark readiness globally after overlay exit delay so downstream animations start after the panels clear.
    const timer = setTimeout(() => {
      (window as any).__appReady = true;
      window.dispatchEvent(new Event('app:ready'));
    }, 500);

    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Panels (stacked) */}
          {panels.map((panel, idx) => (
            <motion.div
              key={panel.id}
              className={`absolute inset-0 ${panel.className}`}
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: '-110%' }}
              transition={{
                duration: 0.7,
                ease: 'easeInOut',
                delay: idx * 0.15, // stagger upward
              }}
            />
          ))}

          {/* Centered Logo + Spinner */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo */}
            <Image
              src="/NopecaFooterLogo.png"
              alt="Nopeca"
              width={80}
              height={80}
              priority
              className="w-20 h-20 object-contain drop-shadow-lg"
            />

            {/* Loading Spinner */}
            <div className="relative w-12 h-12">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-3 border-transparent border-t-white border-r-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner ring */}
              <motion.div
                className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-white/60 border-l-white/60"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
