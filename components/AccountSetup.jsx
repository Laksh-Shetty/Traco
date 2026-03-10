"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const steps = [
  { label: "Verifying your identity", duration: 900 },
  { label: "Setting up your workspace", duration: 900 },
  { label: "Creating your account", duration: 900 },
  { label: "Preparing your dashboard", duration: 700 },
];

export default function AccountSetup({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let stepIndex = 0;
    let progressVal = 0;
    const progressPerStep = 100 / steps.length;

    const runStep = () => {
      if (stepIndex >= steps.length) {
        setProgress(100);
        setDone(true);
        setTimeout(() => onComplete?.(), 600);
        return;
      }

      setCurrentStep(stepIndex);

      const targetProgress = (stepIndex + 1) * progressPerStep;
      const stepDuration = steps[stepIndex].duration;
      const tickInterval = 16;
      const ticks = stepDuration / tickInterval;
      const increment = (targetProgress - progressVal) / ticks;

      let tick = 0;
      const ticker = setInterval(() => {
        tick++;
        progressVal = Math.min(progressVal + increment, targetProgress);
        setProgress(progressVal);
        if (tick >= ticks) {
          clearInterval(ticker);
          stepIndex++;
          setTimeout(runStep, 80);
        }
      }, tickInterval);
    };

    runStep();
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#050508" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(34,113,240,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,113,240,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }} />
          <div className="absolute rounded-full pointer-events-none blur-[120px]"
            style={{ width: 500, height: 400, background: "rgba(34,113,240,0.12)", top: -100, left: -150 }} />
          <div className="absolute rounded-full pointer-events-none blur-[120px]"
            style={{ width: 400, height: 300, background: "rgba(208,6,212,0.09)", bottom: -50, right: -100 }} />

          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <span className="font-black text-3xl tracking-tight" style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                background: "linear-gradient(90deg, #2271f0, #d006d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                TRACO
              </span>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative mb-10"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ border: "1px solid rgba(34,113,240,0.3)", background: "rgba(34,113,240,0.08)" }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <motion.path
                    d="M6 26 L12 18 L18 22 L24 12 L30 16"
                    stroke="url(#grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2271f0" />
                      <stop offset="100%" stopColor="#d006d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: "1px solid rgba(34,113,240,0.4)" }}
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.div>

            <div className="h-6 mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono text-center tracking-wide"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {steps[currentStep]?.label}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="w-full rounded-full overflow-hidden mb-4"
              style={{ height: 3, background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #2271f0, #d006d4)",
                  boxShadow: "0 0 12px rgba(34,113,240,0.6)",
                  transition: "width 0.016s linear",
                }}
              />
            </div>

            <div className="flex items-center gap-2 mt-3">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentStep ? 20 : 6,
                    height: 6,
                    background: i <= currentStep
                      ? "linear-gradient(90deg, #2271f0, #d006d4)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}