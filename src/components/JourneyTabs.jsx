import {
  memo,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useId,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import {
  GraduationCap,
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { GlowCard, GlowButton } from "./ui/layout";
import { EASE_SMOOTH } from "../lib/motion";

const JOURNEY_TABS = [
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "organization", label: "Organization", icon: Users },
];

const JourneyCard = memo(({ item }) => (
  <GlowCard className="h-full p-4 sm:p-5 transition-all duration-300 group-hover:border-sky-500/40">
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-sky-400 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400/90 font-medium">
          {item.period}
        </span>
      </div>
      <h4 className="text-sm sm:text-base font-semibold text-zinc-100 transition-colors duration-200 group-hover:text-white">
        {item.title}
      </h4>
      <p className="mt-1 text-xs sm:text-sm font-medium text-sky-400/90">
        {item.org}
      </p>
      {item.description && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-400 transition-colors duration-200 group-hover:text-zinc-300">
          {item.description}
        </p>
      )}
    </div>
  </GlowCard>
));

JourneyCard.displayName = "JourneyCard";

JourneyCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    period: PropTypes.string,
    title: PropTypes.string,
    org: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default function JourneyTabs({ journey }) {
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("education");
  const [expandedTabs, setExpandedTabs] = useState({});
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false
  );

  const hasInteractedRef = useRef(false);
  const tablistRef = useRef(null);
  const panelsContainerRef = useRef(null);
  const tabRefs = useRef({});
  const panelRefs = useRef({});

  const initialLimit = isMobile ? 2 : 4;

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: reduceMotion
          ? { duration: 0 }
          : {
              staggerChildren: 0.08,
              delayChildren: 0.04,
            },
      },
    }),
    [reduceMotion]
  );

  const cardVariants = useMemo(
    () => ({
      hidden: {
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 20,
        scale: reduceMotion ? 1 : 0.98,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: reduceMotion ? 0 : 0.45,
          ease: EASE_SMOOTH,
        },
      },
    }),
    [reduceMotion]
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(max-width: 767px)");
    const handleChange = (event) => setIsMobile(event.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (hasInteractedRef.current) return;
    const currentItems = journey?.[activeTab] ?? [];
    if (currentItems.length > 0) return;

    const firstPopulated = JOURNEY_TABS.find(
      (tab) => (journey?.[tab.id] ?? []).length > 0
    );
    if (firstPopulated && firstPopulated.id !== activeTab) {
      setActiveTab(firstPopulated.id);
    }
  }, [journey, activeTab]);

  useLayoutEffect(() => {
    for (const tab of JOURNEY_TABS) {
      const panel = panelRefs.current[tab.id];
      if (!panel) continue;

      if (tab.id === activeTab) {
        if (panel.hasAttribute("hidden")) {
          panel.removeAttribute("hidden");
        }
      } else if (panel.getAttribute("hidden") !== "until-found") {
        panel.setAttribute("hidden", "until-found");
      }
    }
  });

  useEffect(() => {
    const container = panelsContainerRef.current;
    if (!container) return undefined;

    const handleBeforeMatch = (event) => {
      const matchedPanel = event.target?.closest?.('[role="tabpanel"]');
      const matchedTabId = matchedPanel?.dataset?.journeyTab;
      if (matchedTabId) {
        hasInteractedRef.current = true;
        setActiveTab(matchedTabId);
      }
    };

    container.addEventListener("beforematch", handleBeforeMatch);
    return () => container.removeEventListener("beforematch", handleBeforeMatch);
  }, []);

  useEffect(() => {
    const scroller = tablistRef.current;
    if (!scroller) return undefined;
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline", "scroll()")
    ) {
      return undefined;
    }

    const first = scroller.firstElementChild;
    const last = scroller.lastElementChild;
    if (!first || !last) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, intersectionRatio } of entries) {
          if (target === first) {
            scroller.classList.toggle("more-start", intersectionRatio < 1);
          }
          if (target === last) {
            scroller.classList.toggle("more-end", intersectionRatio < 1);
          }
        }
      },
      { root: scroller, threshold: 1, rootMargin: "1px" }
    );

    observer.observe(first);
    observer.observe(last);
    return () => observer.disconnect();
  }, []);

  const selectTab = useCallback((tabId, { focus = false } = {}) => {
    hasInteractedRef.current = true;
    setActiveTab(tabId);
    const tabEl = tabRefs.current[tabId];
    tabEl?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      container: "nearest",
    });
    if (focus) {
      tabEl?.focus();
    }
  }, []);

  const handleTabKeyDown = useCallback(
    (event, currentIndex) => {
      let nextIndex = null;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % JOURNEY_TABS.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + JOURNEY_TABS.length) % JOURNEY_TABS.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = JOURNEY_TABS.length - 1;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      selectTab(JOURNEY_TABS[nextIndex].id, { focus: true });
    },
    [selectTab]
  );

  const toggleExpand = useCallback((tabId) => {
    setExpandedTabs((prev) => ({
      ...prev,
      [tabId]: !prev[tabId],
    }));
  }, []);

  return (
    <div className="w-full">
      <div
        className="max-w-xl mx-auto border border-zinc-800 bg-zinc-950/70"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Journey categories"
          className="journey-tablist flex items-stretch"
        >
          {JOURNEY_TABS.map((tab, index) => {
            const Icon = tab.icon;
            const items = journey?.[tab.id] ?? [];
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className="journey-tab relative flex items-center justify-center gap-2 px-4 py-3 sm:flex-1 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400 transition-colors whitespace-nowrap overflow-hidden"
              >
                {/* Animated active pill background */}
                {isSelected && (
                  <motion.span
                    layoutId="journey-active-tab-highlight"
                    className="absolute inset-0 bg-sky-500/10 z-0 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
                {/* Animated active bottom indicator bar */}
                {isSelected && (
                  <motion.span
                    layoutId="journey-active-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)] z-10 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                      isSelected ? "text-sky-400" : "text-zinc-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={
                      isSelected ? "font-semibold text-zinc-100" : ""
                    }
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono transition-colors duration-200 ${
                      isSelected
                        ? "text-sky-400/90 font-medium"
                        : "text-zinc-600"
                    }`}
                  >
                    ({items.length})
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={panelsContainerRef}
        className="journey-panels grid max-w-4xl mx-auto"
      >
        {JOURNEY_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const items = journey?.[tab.id] ?? [];
          const isExpanded = Boolean(expandedTabs[tab.id]);
          const hasOverflow = items.length > initialLimit;
          const visibleItems = isExpanded ? items : items.slice(0, initialLimit);
          const remainingCount = items.length - initialLimit;

          return (
            <div
              key={tab.id}
              ref={(el) => {
                panelRefs.current[tab.id] = el;
              }}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              data-journey-tab={tab.id}
              hidden={!isActive}
              tabIndex={isActive && !hasOverflow ? 0 : undefined}
            >
              <div className="pt-6">
                {items.length === 0 ? (
                  <div className="max-w-2xl mx-auto border border-zinc-800/80 bg-zinc-950/50 p-6 text-center text-xs text-zinc-500">
                    Belum ada data {tab.label.toLowerCase()}.
                  </div>
                ) : (
                  <>
                    {/* Animated grid when tab is active */}
                    {isActive ? (
                      <motion.div
                        key={`${tab.id}-${isExpanded ? "expanded" : "collapsed"}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                          visibleItems.length === 1
                            ? "max-w-2xl mx-auto"
                            : "grid grid-cols-1 md:grid-cols-2 gap-4"
                        }
                      >
                        {visibleItems.map((item, index) => (
                          <motion.div
                            key={item.id ?? `${tab.id}-${index}`}
                            variants={cardVariants}
                            layout={!reduceMotion}
                            className="h-full group interactive-lift"
                          >
                            <JourneyCard item={item} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      /* Static DOM for search indexing when hidden="until-found" */
                      <div
                        className={
                          items.length === 1
                            ? "max-w-2xl mx-auto"
                            : "grid grid-cols-1 md:grid-cols-2 gap-4"
                        }
                      >
                        {items.map((item, index) => (
                          <div
                            key={item.id ?? `${tab.id}-${index}`}
                            className="h-full"
                          >
                            <JourneyCard item={item} />
                          </div>
                        ))}
                      </div>
                    )}

                    {hasOverflow && (
                      <div className="mt-6 flex justify-center">
                        <GlowButton
                          variant="ghost"
                          aria-expanded={isExpanded}
                          onClick={() => toggleExpand(tab.id)}
                          className="!px-4 !py-2"
                        >
                          {isExpanded ? (
                            <>
                              <span>Tampilkan lebih sedikit</span>
                              <ChevronUp
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </>
                          ) : (
                            <>
                              <span>Lihat {remainingCount} lainnya</span>
                              <ChevronDown
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </GlowButton>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

JourneyTabs.propTypes = {
  journey: PropTypes.shape({
    education: PropTypes.arrayOf(PropTypes.object),
    experience: PropTypes.arrayOf(PropTypes.object),
    organization: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
