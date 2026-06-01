import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, defaultInView } from "../../lib/motion";

/**
 * Fade-up halus saat masuk viewport (alternatif ringan untuk blok tanpa data-aos).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] ?? motion.div;

  if (reduceMotion) {
    const Tag = as === "div" ? "div" : as;
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultInView}
      variants={fadeUp}
      transition={{ delay }}
      {...props}
    >
      {children}
    </Component>
  );
}
