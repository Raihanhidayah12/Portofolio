import { Github, Linkedin, Instagram, ArrowUp, Mail } from "lucide-react";
import { SITE } from "../config/site";
import { SOCIAL_PROFILES } from "../config/social";
import VisitorCounter from "./VisitorCounter";

const FOOTER_NAV = [
  { href: "#Home", label: "Home" },
  { href: "#About", label: "About" },
  { href: "#Portofolio", label: "Portofolio" },
  { href: "#Contact", label: "Contact" },
];

const SOCIAL_ICONS = [
  { Icon: Github, ...SOCIAL_PROFILES.github },
  { Icon: Linkedin, ...SOCIAL_PROFILES.linkedin },
  { Icon: Instagram, ...SOCIAL_PROFILES.instagram },
];

const scrollToSection = (e, href) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) {
    window.scrollTo({ top: el.offsetTop - 88, behavior: "smooth" });
  }
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-[#050508] px-[5%] pt-12 pb-8 lg:px-[10%]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a
              href="#Home"
              onClick={(e) => scrollToSection(e, "#Home")}
              className="inline-block font-mono text-lg font-bold tracking-widest text-zinc-100"
            >
              {SITE.brandName}
              <span className="text-sky-500">.</span>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
              {SITE.bioShort}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {SITE.profileStatus}
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sky-500/90 mb-4">
              Navigasi
            </p>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="text-sm text-zinc-400 transition-colors hover:text-sky-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sosial & kontak */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sky-500/90 mb-4">
              Terhubung
            </p>
            <ul className="flex flex-col gap-2.5 mb-5">
              {SOCIAL_ICONS.map(({ Icon, url, handle, label }) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-sky-300"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-sky-500/80" />
                    <span>{handle}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#Contact"
              onClick={(e) => scrollToSection(e, "#Contact")}
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
            >
              <Mail className="h-4 w-4" />
              {SITE.profileContactLabel}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-6 sm:flex-row">
          <p className="font-mono text-xs text-zinc-600 text-center sm:text-left">
            © {year} {SITE.fullName}. All rights reserved.
          </p>
          <VisitorCounter />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-sky-400"
          >
            Kembali ke atas
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
