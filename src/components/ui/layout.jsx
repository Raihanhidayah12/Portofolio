/** Shared layout & UI — konsisten dengan Home (sky / zinc / editorial) */

import { Link } from "react-router-dom";
import BorderGlow from "../BorderGlow";
import { Reveal } from "./Reveal";
import {
  GLOW_CARD_PROPS,
  GLOW_BUTTON_PRIMARY_PROPS,
  GLOW_BUTTON_SECONDARY_PROPS,
} from "./borderGlowConfig";

export const PAGE_BG = "bg-[#050508] text-zinc-100";
export const SECTION_PAD = "px-[5%] lg:px-[10%]";

export const inputClass =
  "w-full bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-colors disabled:opacity-50";

export function PageGridBg({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[0.28] ${className}`}
      aria-hidden
      style={{
        backgroundImage: `
          linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    />
  );
}

export function SectionShell({ id, children, className = "", ...rest }) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${PAGE_BG} ${SECTION_PAD} ${className}`}
      {...rest}
    >
      <PageGridBg />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function SectionHeader({ label, title, subtitle, align = "center" }) {
  const alignClass =
    align === "left" ? "text-left mx-0" : "text-center mx-auto";

  return (
    <Reveal className={`max-w-2xl mb-10 sm:mb-12 ${alignClass}`}>
      {label && (
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky-500/90 mb-3">
          {label}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm md:text-base text-zinc-500 leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/** Card dengan BorderGlow — gunakan untuk panel / stat / project */
export function GlowCard({
  children,
  className = "",
  wrapperClassName = "",
  glowProps = {},
  /** false = kartu selebar konten (login, modal kecil) */
  fill = true,
  ...rest
}) {
  const sizeClass = fill
    ? "border-glow-fill w-full"
    : "border-glow-compact w-full max-w-full";

  return (
    <BorderGlow
      {...GLOW_CARD_PROPS}
      {...glowProps}
      className={`${sizeClass} ${wrapperClassName}`}
      {...rest}
    >
      <div className={className}>{children}</div>
    </BorderGlow>
  );
}

export function SurfaceCard({ children, className = "" }) {
  return (
    <GlowCard className={`backdrop-blur-sm ${className}`}>{children}</GlowCard>
  );
}

const primaryBtnInner =
  "interactive-press inline-flex w-full items-center justify-center gap-2 bg-transparent px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-[filter,transform] duration-200 ease-smooth hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed";

const secondaryBtnInner =
  "interactive-press inline-flex w-full items-center justify-center gap-2 bg-transparent px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-[color,transform] duration-200 ease-smooth hover:text-sky-200 disabled:opacity-50 disabled:cursor-not-allowed";

export function PrimaryButton({
  children,
  className = "",
  wrapperClassName = "",
  type = "button",
  ...props
}) {
  return (
    <BorderGlow
      {...GLOW_BUTTON_PRIMARY_PROPS}
      className={`border-glow-compact inline-flex ${wrapperClassName}`}
    >
      <button
        type={type}
        className={`${primaryBtnInner} ${className}`}
        {...props}
      >
        {children}
      </button>
    </BorderGlow>
  );
}

export function SecondaryButton({
  children,
  className = "",
  wrapperClassName = "",
  type = "button",
  ...props
}) {
  return (
    <BorderGlow
      {...GLOW_BUTTON_SECONDARY_PROPS}
      className={`border-glow-compact inline-flex ${wrapperClassName}`}
    >
      <button
        type={type}
        className={`${secondaryBtnInner} ${className}`}
        {...props}
      >
        {children}
      </button>
    </BorderGlow>
  );
}

/** Link / anchor dengan glow (CTA, nav actions). Pakai `to` untuk React Router. */
export function GlowLink({
  href,
  to,
  variant = "primary",
  children,
  className = "",
  wrapperClassName = "",
  ...props
}) {
  const glowProps =
    variant === "primary"
      ? GLOW_BUTTON_PRIMARY_PROPS
      : GLOW_BUTTON_SECONDARY_PROPS;
  const innerClass =
    variant === "primary"
      ? `${primaryBtnInner} ${className}`
      : `${secondaryBtnInner} ${className}`;

  const LinkTag = to ? Link : "a";
  const linkProps = to ? { to } : { href };

  return (
    <BorderGlow
      {...glowProps}
      className={`border-glow-compact inline-flex ${wrapperClassName}`}
    >
      <LinkTag className={innerClass} {...linkProps} {...props}>
        {children}
      </LinkTag>
    </BorderGlow>
  );
}

/** Tombol generik dengan glow — variant: primary | secondary | ghost */
export function GlowButton({
  variant = "primary",
  children,
  className = "",
  type = "button",
  ...props
}) {
  if (variant === "primary") {
    return (
      <PrimaryButton type={type} className={className} {...props}>
        {children}
      </PrimaryButton>
    );
  }
  if (variant === "secondary") {
    return (
      <SecondaryButton type={type} className={className} {...props}>
        {children}
      </SecondaryButton>
    );
  }

  return (
    <BorderGlow
      {...GLOW_CARD_PROPS}
      className="border-glow-compact inline-flex"
    >
      <button
        type={type}
        className={`inline-flex w-full items-center justify-center gap-2 bg-transparent px-3 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:text-sky-300 disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </button>
    </BorderGlow>
  );
}

/** MUI Tabs sx — Portofolio */
export const portfolioTabsSx = {
  minHeight: 56,
  "& .MuiTab-root": {
    fontSize: { xs: "0.85rem", md: "0.95rem" },
    fontWeight: 600,
    color: "#71717a",
    textTransform: "none",
    minHeight: 56,
    border: "1px solid transparent",
    transition: "all 0.25s ease",
    "&:hover": {
      color: "#e4e4e7",
      borderColor: "rgba(56, 189, 248, 0.25)",
      backgroundColor: "rgba(56, 189, 248, 0.05)",
    },
    "&.Mui-selected": {
      color: "#38bdf8",
      borderColor: "rgba(56, 189, 248, 0.4)",
      backgroundColor: "rgba(56, 189, 248, 0.08)",
    },
  },
  "& .MuiTabs-indicator": { display: "none" },
};

export const portfolioAppBarSx = {
  bgcolor: "transparent",
  border: "1px solid rgba(39, 39, 42, 0.9)",
  borderRadius: 0,
  boxShadow: "none",
};

/** Admin dashboard — sama dengan public site */
export const DASHBOARD_BG = PAGE_BG;

export function DashboardPageIcon({ children, className = "" }) {
  return (
    <BorderGlow
      {...GLOW_CARD_PROPS}
      glowRadius={12}
      className="border-glow-compact shrink-0"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center text-sky-400 ${className}`}
      >
        {children}
      </div>
    </BorderGlow>
  );
}

export function DashboardCard({ children, className = "" }) {
  return <GlowCard className={className}>{children}</GlowCard>;
}

export const dashboardNavActive =
  "bg-sky-500/10 border border-sky-500/30 text-zinc-100";
export const dashboardNavIdle =
  "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent";
