import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE } from "../config/site";
import { SecondaryButton } from "./ui/layout";
import { EASE_SMOOTH } from "../lib/motion";

const navItems = [
  { href: "#Home", label: "Home" },
  { href: "#About", label: "About" },
  { href: "#Portofolio", label: "Portofolio" },
  { href: "#Contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          if (section) {
            return {
              id: item.href.replace("#", ""),
              offset: section.offsetTop - 550,
              height: section.offsetHeight,
            };
          }
          return null;
        })
        .filter(Boolean);

      const currentPosition = window.scrollY;
      const active = sections.find(
        (section) =>
          currentPosition >= section.offset &&
          currentPosition < section.offset + section.height
      );

      if (active) setActiveSection(active.id);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 88, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const linkClass = (id) =>
    `relative font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors duration-200 ${
      activeSection === id
        ? "text-sky-400"
        : "text-zinc-500 hover:text-zinc-200"
    }`;

  return (
    <motion.nav
      initial={reduceMotion ? false : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.05 }}
      className={`fixed top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-smooth ${
        isOpen || scrolled
          ? "border-zinc-800/80 bg-[#050508]/95 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-[5%] lg:px-[10%]">
        <a
          href="#Home"
          onClick={(e) => scrollToSection(e, "#Home")}
          className="font-mono text-sm font-bold tracking-widest text-zinc-100 transition-opacity duration-200 hover:opacity-90"
        >
          {SITE.brandName}
          <span className="text-sky-500">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const id = item.href.substring(1);
            const isActive = activeSection === id;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={linkClass(id)}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-sky-400/80"
                    transition={{ duration: 0.25, ease: EASE_SMOOTH }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <SecondaryButton
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="!p-2 !text-zinc-400 hover:!text-sky-400 md:hidden"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </SecondaryButton>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE_SMOOTH }}
            className="overflow-hidden border-t border-zinc-800 bg-[#050508] md:hidden"
          >
            <div className="flex flex-col gap-1 px-[5%] py-4">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: EASE_SMOOTH }}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`py-3 ${linkClass(item.href.substring(1))}`}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
