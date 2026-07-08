import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ArrowUpRight, Instagram, FileText } from "lucide-react"
import { SOCIAL_PROFILES, SOCIAL_SAME_AS } from "../config/social"
import { SITE, pageTitle } from "../config/site"
import { supabase } from "../supabase"
import { getTechCategoryLabel } from "../config/techCategories"
import {
  FALLBACK_TECH_STACK,
  fetchPublishedTechStack,
  formatTechStackIndex,
} from "../utils/techStackQuery"
import BorderGlow from "../components/BorderGlow"
import { GlowLink, GlowCard } from "../components/ui/layout"
import { GLOW_CHIP_PROPS } from "../components/ui/borderGlowConfig"

const HeroGridScan = lazy(() => import("../components/HeroGridScan"))

const StatusBadge = memo(() => (
  <div
    className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-emerald-400/90"
    data-aos="fade-up"
    data-aos-delay="400"
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
    Available for work
  </div>
))

const MainTitle = memo(({ roleIndex }) => {
  const role = SITE.heroRoles[roleIndex] ?? SITE.heroRoles[0]

  return (
    <div className="space-y-4" data-aos="fade-up" data-aos-delay="500">
      <div className="flex items-center justify-between gap-4 max-w-xl">
        <p className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest">
          ROLE {String(roleIndex + 1).padStart(2, "0")} /{" "}
          {String(SITE.heroRoles.length).padStart(2, "0")}
        </p>
        <div className="flex gap-1.5">
          {SITE.heroRoles.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === roleIndex ? "w-8 bg-sky-400" : "w-2 bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>

      <h1 className="min-h-[5.5rem] sm:min-h-[6.5rem] lg:min-h-[7.5rem] text-4xl sm:text-5xl md:text-6xl xl:text-[4.25rem] font-bold tracking-tight leading-[1.05]">
        <span
          key={`${roleIndex}-l1`}
          className="block text-zinc-100 animate-fade-up"
        >
          {role.line1}
        </span>
        <span
          key={`${roleIndex}-l2`}
          className="block mt-1 text-sky-400 animate-fade-up"
        >
          {role.line2}
        </span>
      </h1>
    </div>
  )
})

const HeroDescription = memo(() => {
  const text = SITE.heroDescription
  const highlights = SITE.heroDescriptionHighlights ?? []

  if (!highlights.length) {
    return <>{text}</>
  }

  const parts = text.split(
    new RegExp(`(${highlights.join("|")})`, "g")
  )

  return (
    <>
      {parts.map((part, i) =>
        highlights.includes(part) ? (
          <span key={i} className="text-zinc-100 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
})

const TechChip = memo(({ item }) => (
  <BorderGlow
    {...GLOW_CHIP_PROPS}
    backgroundColor="rgba(24, 24, 27, 0.9)"
    className="border-glow-compact inline-flex"
  >
    <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-300">
      <span className="font-mono text-[10px] text-zinc-600">
        {formatTechStackIndex(item.order_index)}
      </span>
      <span>{item.name}</span>
      <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-wider text-zinc-600 border-l border-zinc-800 pl-2">
        {getTechCategoryLabel(item.category)}
      </span>
    </span>
  </BorderGlow>
))

const CTAButton = memo(({ href, text, primary, icon: Icon }) => (
  <GlowLink
    href={href}
    variant={primary ? "primary" : "secondary"}
    className="group"
  >
    {text}
    <Icon
      className={`w-4 h-4 ${
        primary ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : ""
      }`}
    />
  </GlowLink>
))

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <BorderGlow
    {...GLOW_CHIP_PROPS}
    backgroundColor="rgba(9, 9, 11, 0.92)"
    className="border-glow-compact inline-flex"
  >
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center text-zinc-500 transition-colors hover:text-sky-300"
    >
      <Icon className="w-4 h-4" />
    </a>
  </BorderGlow>
))

const TYPING_SPEED = 85
const ERASING_SPEED = 45
const PAUSE_DURATION = 2200
const TAGLINE_WORDS = SITE.heroTaglines
const SOCIAL_LINKS = [
  { icon: Github, link: SOCIAL_PROFILES.github.url, label: SOCIAL_PROFILES.github.label },
  { icon: Linkedin, link: SOCIAL_PROFILES.linkedin.url, label: SOCIAL_PROFILES.linkedin.label },
  { icon: Instagram, link: SOCIAL_PROFILES.instagram.url, label: SOCIAL_PROFILES.instagram.label },
]

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)
  const [techPills, setTechPills] = useState(FALLBACK_TECH_STACK)
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoSrc, setVideoSrc] = useState("")

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const loadVideo = () => setVideoSrc("/hero-workspace.mp4");
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(loadVideo, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(loadVideo, 800);
      return () => clearTimeout(id);
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % SITE.heroRoles.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadTech = async () => {
      const { data, error } = await fetchPublishedTechStack(supabase, { limit: 6 })
      if (!error && data.length) {
        setTechPills(data)
      }
    }
    loadTech()
  }, [])

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < TAGLINE_WORDS[wordIndex].length) {
        setText((prev) => prev + TAGLINE_WORDS[wordIndex][charIndex])
        setCharIndex((prev) => prev + 1)
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION)
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1))
        setCharIndex((prev) => prev - 1)
      } else {
        setWordIndex((prev) => (prev + 1) % TAGLINE_WORDS.length)
        setIsTyping(true)
      }
    }
  }, [charIndex, isTyping, wordIndex])

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    )
    return () => clearTimeout(timeout)
  }, [handleTyping])

  return (
    <>
      <Helmet>
        <title>{pageTitle()}</title>
        <meta name="description" content={SITE.bioShort} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle()} />
        <meta property="og:description" content={SITE.bioShort} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": ${JSON.stringify(SITE.fullName)},
            "jobTitle": ${JSON.stringify(SITE.jobTitle)},
            "sameAs": ${JSON.stringify(SOCIAL_SAME_AS)}
          }
        `}</script>
      </Helmet>

      <section
        id="Home"
        className="relative min-h-screen overflow-hidden bg-[#050508] px-[5%] lg:px-[10%]"
      >
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <HeroGridScan />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute -right-32 top-20 z-[1] h-72 w-72 rounded-full bg-sky-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 z-[1] h-64 w-64 rounded-full bg-violet-600/8 blur-[90px]" />

        <div
          className={`relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center py-24 transition-opacity duration-700 pointer-events-none lg:flex-row lg:items-center lg:gap-16 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full space-y-7 lg:w-[52%] lg:py-8 pointer-events-auto"
            data-aos="fade-right"
            data-aos-delay="150"
          >
            <StatusBadge />
            <MainTitle roleIndex={roleIndex} />

            <div
              className="min-h-[2rem] font-mono text-sm sm:text-base text-zinc-400"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <span className="text-sky-500/80">&gt; </span>
              {text}
              <span className="ml-0.5 inline-block w-[2px] h-4 bg-sky-400 align-middle animate-soft-pulse" />
            </div>

            <blockquote
              className="max-w-lg border-l-2 border-sky-500/60 pl-4 text-base leading-relaxed text-zinc-400 sm:text-lg"
              data-aos="fade-up"
              data-aos-delay="850"
            >
              <HeroDescription />
            </blockquote>

            <div
              className="flex flex-wrap gap-2"
              data-aos="fade-up"
              data-aos-delay="1000"
            >
              {techPills.map((item) => (
                <TechChip key={item.id} item={item} />
              ))}
            </div>

            <div
              className="flex flex-wrap items-center gap-3 pt-1"
              data-aos="fade-up"
              data-aos-delay="1150"
            >
              <CTAButton href="#Portofolio" text="Lihat Proyek" primary icon={ArrowUpRight} />
              <CTAButton href="#Contact" text="Hubungi Saya" icon={Mail} />
              <GlowLink
                href={SITE.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="group"
              >
                <FileText className="w-4 h-4" />
                Download CV
              </GlowLink>
            </div>

            <div
              className="flex gap-2 pt-2"
              data-aos="fade-up"
              data-aos-delay="1300"
            >
              {SOCIAL_LINKS.map((social, index) => (
                <SocialLink key={index} {...social} />
              ))}
            </div>
          </div>

          <div
            className="relative mt-12 w-full pointer-events-auto lg:mt-0 lg:w-[48%]"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="relative mx-auto aspect-square max-w-md lg:max-w-none">
              <span className="absolute -left-2 -top-2 h-8 w-8 border-l-2 border-t-2 border-sky-400" />
              <span className="absolute -right-2 -top-2 h-8 w-8 border-r-2 border-t-2 border-sky-400" />
              <span className="absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-sky-400" />
              <span className="absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-sky-400" />

              <GlowCard className="relative overflow-hidden p-3 sm:p-4">
                <div className="absolute left-0 top-0 z-10 flex gap-1.5 p-3">
                  <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  <span className="h-2 w-2 rounded-full bg-zinc-600" />
                </div>
                {videoSrc && (
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  loading="lazy"
                  className="relative z-[1] w-full object-cover pt-6 aspect-square"
                  aria-label="Futuristic software engineer workspace"
                />
                )}
                <div
                  className="pointer-events-none absolute bottom-0 right-0 z-[2] h-11 w-24 sm:h-12 sm:w-28 bg-[#050508]"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute bottom-0 right-0 z-[2] h-16 w-32 sm:h-20 sm:w-40 bg-gradient-to-tl from-[#050508] via-[#050508]/85 to-transparent"
                  aria-hidden
                />
              </GlowCard>

              <p className="absolute -bottom-8 right-0 hidden font-mono text-[10px] text-zinc-600 sm:block">
                portfolio.exe — running
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default memo(Home)
