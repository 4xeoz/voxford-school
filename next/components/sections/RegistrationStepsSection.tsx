"use client";

import { useRef } from "react";
import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import Image, { StaticImageData } from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import steps1Img from "@/public/steps-1.png";
import steps2Img from "@/public/steps-2.png";
import steps3Img from "@/public/steps-3.png";
import type { Dictionary } from "@/dictionaries";

interface StepCardProps {
  i: number;
  step: number;
  title: string;
  description: string;
  color: string;
  image: StaticImageData;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

function StepCard({
  i,
  step,
  title,
  description,
  color,
  image,
  progress,
  range,
  targetScale,
}: StepCardProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });


  const imageScale = useTransform(scrollYProgress, [0, 1], [2,1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-dvh flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5dvh + ${i * 25}px)`,
        }}
        className="relative flex flex-col max-h-[700px] h-[70dvh] w-[90%] max-w-4xl rounded-3xl p-8 lg:p-12 origin-top shadow-2xl"
      >
        {/* Step number badge */}
        <div className="absolute -top-4 left-8 bg-[#f5f2ed] text-[#0a1628] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
          {step}
        </div>

        <div className="flex flex-col lg:flex-row h-full gap-6 lg:gap-8 pt-4">
          {/* Left side - Text content */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4">
              {title}
            </h3>
            <p className="text-white/80 text-base lg:text-lg leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right side - Step image */}
          <div className="flex-1 lg:w-1/2 flex items-center justify-center overflow-hidden rounded-xl min-h-[180px] sm:min-h-[220px]">
            <motion.div className="relative w-full h-full overflow-hidden" style={{scale: imageScale}}>
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface RegistrationStepsSectionProps {
  dict: Dictionary;
}

export default function RegistrationStepsSection({ dict }: RegistrationStepsSectionProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const registrationSteps = [
    {
      step: 1,
      title: dict.steps.step1Title,
      description: dict.steps.step1Desc,
      color: "#0a1628",
      image: steps1Img,
    },
    {
      step: 2,
      title: dict.steps.step2Title,
      description: dict.steps.step2Desc,
      color: "#d4a84b",
      image: steps2Img,
    },
    {
      step: 3,
      title: dict.steps.step3Title,
      description: dict.steps.step3Desc,
      color: "#0a1628",
      image: steps3Img,
    }
  ];

  return (
    <section
      id="steps"
      ref={container}
      className="relative w-full py-20 px-4 bg-[#f5f0e8]"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical stripes */}
        <div className="absolute inset-0 flex justify-between ">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-px h-full bg-[#0a1628]/[0.06]"
            />
          ))}
        </div>

        {/* Decorative arcs */}
        <svg
          className="absolute -left-32 top-0 h-[600px] w-[600px] opacity-40"
          viewBox="0 0 600 600"
          fill="none"
        >
          <path
            d="M-100 600 C 100 400, 300 200, 600 100"
            stroke="#e8dcc8"
            strokeWidth="120"
            fill="none"
          />
        </svg>
        <svg
          className="absolute -right-32 bottom-0 h-[500px] w-[500px] opacity-30"
          viewBox="0 0 500 500"
          fill="none"
        >
          <path
            d="M500 -50 C 400 150, 200 300, -50 400"
            stroke="#e8dcc8"
            strokeWidth="100"
            fill="none"
          />
        </svg>
      </div>

      {/* Header section */}
      <div className="relative h-[50dvh] max-h-[400px] flex items-center justify-center px-4 ">
        <ScrollReveal className="text-center max-w-3xl" duration={0.7}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-8 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4a84b]" />
            <span className="text-sm font-medium text-[#0a1628]">
              {dict.steps.badge}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-[#0a1628] leading-tight text-balance mb-6">
            {dict.steps.title}
          </h2>
          <p className="text-lg text-[#0a1628]/80 max-w-xl mx-auto">
            {dict.steps.description}
          </p>
        </ScrollReveal>
      </div>

      {/* Stacking cards section */}
      <div className="relative">
        {registrationSteps.map((stepData, i) => {
          const targetScale = 1 - (registrationSteps.length - i) * 0.05;
          return (
            <StepCard
              key={`step_${i}`}
              i={i}
              step={stepData.step}
              title={stepData.title}
              description={stepData.description}
              color={stepData.color}
              image={stepData.image}
              progress={scrollYProgress}
              range={[i * 0.2, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>



    </section>
  );
}
