/** Preset Framer Motion — easing natural, tanpa bounce berlebihan */

export const EASE_SMOOTH = [0.22, 1, 0.36, 1];

export const pageEnter = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: EASE_SMOOTH,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

export const pageChild = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_SMOOTH },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SMOOTH },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_SMOOTH },
  },
};

export const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.28, ease: EASE_SMOOTH },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.22, ease: EASE_SMOOTH },
  },
};

export const defaultInView = {
  once: true,
  amount: 0.15,
  margin: "-40px 0px -40px 0px",
};

export const routeTransition = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_SMOOTH },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: EASE_SMOOTH },
  },
};
