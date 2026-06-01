/** Konfigurasi AOS — halus, sekali tampil, tidak berlebihan */

export const AOS_DEFAULTS = {
  duration: 600,
  easing: "ease-out-cubic",
  once: true,
  offset: 48,
  delay: 0,
  anchorPlacement: "top-bottom",
  mirror: false,
};

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getAOSOptions(overrides = {}) {
  if (prefersReducedMotion()) {
    return { disable: true, ...overrides };
  }
  return { ...AOS_DEFAULTS, ...overrides };
}

/** Delay bertahap untuk grid / list (ms) */
export function aosStaggerDelay(index, step = 70, max = 350) {
  return Math.min(index * step, max);
}
