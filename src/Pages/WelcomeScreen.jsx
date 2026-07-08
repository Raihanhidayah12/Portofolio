import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Code2, Github, Globe, User } from "lucide-react";
import { PageGridBg } from "../components/ui/layout";
import { SITE } from "../config/site";
import { EASE_SMOOTH } from "../lib/motion";
import "./WelcomeScreen.css";

const TYPEWRITER_TEXT = `Loading Portfolio...`;
const TYPEWRITER_DELAY_MS = 900;
const TYPEWRITER_SPEED_MS = 58;
const HOLD_AFTER_TYPE_MS = 500;
const EXIT_MS = 900;

const EASE_OUT = EASE_SMOOTH;

const titleContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

const titleWord = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const iconFloat = (i) => ({
  hidden: { opacity: 0, y: 24, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.55,
      ease: EASE_OUT,
    },
  },
});

const TypewriterEffect = ({ text, delay, speed, onComplete, onProgress }) => {
  const [displayText, setDisplayText] = useState("");
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    finishedRef.current = false;
    setDisplayText("");
    setDone(false);
    onProgress?.(0);

    let intervalId;
    const startTimer = setTimeout(() => {
      let index = 0;
      intervalId = setInterval(() => {
        index += 1;
        const slice = text.slice(0, index);
        setDisplayText(slice);
        onProgress?.(index / text.length);
        if (index >= text.length) {
          clearInterval(intervalId);
          if (!finishedRef.current) {
            finishedRef.current = true;
            setDone(true);
            onProgress?.(1);
            onComplete?.();
          }
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, speed, onComplete, onProgress]);

  return (
    <span className="inline-block min-w-[10ch] font-mono text-sky-300/95">
      {displayText}
      {!done && <span className="welcome-cursor" aria-hidden />}
    </span>
  );
};

const FloatingIcon = ({ Icon, index, reduceMotion }) => (
  <motion.div
    variants={iconFloat(index)}
    initial="hidden"
    animate="visible"
    className="welcome-icon-shell p-2 sm:p-3 md:p-3.5 text-zinc-300"
    whileHover={reduceMotion ? {} : { y: -4, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 22 }}
  >
    <motion.div
      animate={
        reduceMotion
          ? {}
          : { y: [0, -5, 0] }
      }
      transition={{
        duration: 2.8 + index * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-sky-400/90" />
    </motion.div>
  </motion.div>
);

const AmbientLayer = ({ reduceMotion }) =>
  reduceMotion ? null : (
    <>
      <div className="welcome-orb welcome-orb--sky" aria-hidden />
      <div className="welcome-orb welcome-orb--violet" aria-hidden />
      <div className="welcome-orb welcome-orb--cyan" aria-hidden />
      <div className="welcome-scanline" aria-hidden />
      <div className="welcome-vignette" aria-hidden />
    </>
  );

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const isLowEnd = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
           navigator.hardwareConcurrency < 4;
  }, []);

  const handleTypewriterComplete = useCallback(() => {
    setTypewriterDone(true);
  }, []);

  const handleProgress = useCallback((p) => {
    setProgress(p);
  }, []);

  useEffect(() => {
    if (!typewriterDone) return undefined;
    const holdTimer = setTimeout(() => setIsLoading(false), HOLD_AFTER_TYPE_MS);
    return () => clearTimeout(holdTimer);
  }, [typewriterDone]);

  useEffect(() => {
    if (isLoading) return undefined;
    const exitTimer = setTimeout(() => onLoadingComplete?.(), EXIT_MS);
    return () => clearTimeout(exitTimer);
  }, [isLoading, onLoadingComplete]);

  const exitVariants = reduceMotion
    ? {
        exit: {
          opacity: 0,
          transition: { duration: 0.3 },
        },
      }
    : {
        exit: {
          opacity: 0,
          scale: 1.04,
          filter: "blur(12px)",
          transition: {
            duration: EXIT_MS / 1000,
            ease: EASE_OUT,
            when: "beforeChildren",
            staggerChildren: 0.04,
          },
        },
      };

  const childExit = {
    exit: {
      opacity: 0,
      y: -16,
      transition: { duration: 0.35, ease: EASE_OUT },
    },
  };

  const icons = [Code2, User, Github];

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="welcome-root fixed inset-0 z-[100] bg-[#050508] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={exitVariants}
        >
          <PageGridBg />
          {!isLowEnd && <AmbientLayer reduceMotion={reduceMotion} />}

          {!reduceMotion && (
            <>
              <motion.span
                className="welcome-corner welcome-corner--tl"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT }}
                aria-hidden
              />
              <motion.span
                className="welcome-corner welcome-corner--br"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.5, ease: EASE_OUT }}
                aria-hidden
              />
            </>
          )}

          <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
            <div className="mx-auto w-full max-w-4xl">
              {/* Icons */}
              <motion.div
                className="mb-8 flex justify-center gap-3 sm:gap-5 md:mb-12 md:gap-8"
                variants={childExit}
              >
                {icons.map((Icon, index) => (
                  <FloatingIcon
                    key={index}
                    Icon={Icon}
                    index={index}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </motion.div>

              {/* Label + title */}
              <motion.div className="mb-8 text-center md:mb-12" variants={childExit}>
                <motion.p
                  className="welcome-counter mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-sky-500/90 sm:text-xs"
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "0.35em" }}
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                >
                  Welcome
                </motion.p>

                <motion.h1
                  className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl md:leading-[1.2]"
                  variants={titleContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.span
                    variants={titleWord}
                    className="welcome-title-gradient inline-block pb-2"
                  >
                    Welcome to
                  </motion.span>
                  <motion.span
                    variants={titleWord}
                    className="mt-2 block text-2xl font-medium text-sky-400 sm:text-3xl md:text-4xl"
                  >
                    My Work
                  </motion.span>
                </motion.h1>

                <motion.div
                  className="welcome-line mx-auto mt-6 max-w-xs sm:max-w-sm"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.8, ease: EASE_OUT }}
                />
              </motion.div>

              {/* Terminal typewriter */}
              <motion.div
                className="flex justify-center"
                variants={childExit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: EASE_OUT }}
              >
                <div className="welcome-terminal w-full max-w-md px-4 py-3 sm:px-6 sm:py-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                      terminal
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <span className="font-mono text-sm text-sky-500/70 sm:text-base">
                      &gt;
                    </span>
                    <Globe className="h-4 w-4 shrink-0 text-sky-400/80 sm:h-5 sm:w-5" />
                    <span className="text-base text-zinc-300 sm:text-lg md:text-xl">
                      <TypewriterEffect
                        text={TYPEWRITER_TEXT}
                        delay={TYPEWRITER_DELAY_MS}
                        speed={TYPEWRITER_SPEED_MS}
                        onComplete={handleTypewriterComplete}
                        onProgress={handleProgress}
                      />
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Progress */}
              <motion.div
                className="mx-auto mt-8 w-full max-w-md px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  <span>Loading experience</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="welcome-progress-track">
                  <motion.div
                    className="welcome-progress-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.max(progress, 0.08) }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
