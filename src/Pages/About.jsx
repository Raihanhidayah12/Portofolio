import React, { memo, useMemo, useState, useEffect } from "react"
import { GitHubCalendar } from "react-github-calendar"
import { FileText, Code, Award, Globe, ArrowUpRight, Mail, GraduationCap, Briefcase, Users } from "lucide-react"
import { aosStaggerDelay } from "../lib/aos"
import { SITE } from "../config/site"
import { SOCIAL_PROFILES } from "../config/social"
import { supabase } from "../supabase"
import { mapProjects, mapCertificates, mapJourney } from "../utils/supabase/mappers"
import {
  SectionShell,
  SectionHeader,
  GlowCard,
  GlowLink,
} from "../components/ui/layout"

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Optimized gradient backgrounds with reduced complexity for mobile */}
      <div className="relative">
        <span className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-sky-400" />
        <span className="absolute -right-2 -bottom-2 h-6 w-6 border-r-2 border-b-2 border-sky-400" />
        <GlowCard className="w-72 h-72 sm:w-80 sm:h-80 overflow-hidden transition-all duration-500 group-hover:brightness-105">
          <div className="absolute inset-0 border border-zinc-700 z-20 pointer-events-none" />
          
          {/* Optimized overlay effects - disabled on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-500/15 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />
          
          <img
            src="/Photo.jpg"
            alt="Profile"
            className="w-full h-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
            loading="lazy"
          />
        </GlowCard>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, value, label, description, index = 0 }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={aosStaggerDelay(index)}
    className="relative group h-full interactive-lift"
  >
    <GlowCard className="relative z-10 flex h-full flex-col justify-between p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-14 w-14 items-center justify-center border border-zinc-700 bg-zinc-900 text-sky-400 transition-colors group-hover:border-sky-500/50">
          <Icon className="w-7 h-7" />
        </div>
        <span 
          className="text-4xl font-bold text-zinc-100"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p 
          className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p 
            className="text-xs text-zinc-600"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-sky-400 transition-colors" />
        </div>
      </div>
    </GlowCard>
  </div>
));

function readCachedCount(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]").length;
  } catch {
    return 0;
  }
}

const TimelineSection = memo(({ title, icon: Icon, items }) => {
  if (!items || !items.length) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 max-w-2xl mx-auto" data-aos="fade-up">
        <div className="flex h-8 w-8 items-center justify-center border border-zinc-700 bg-zinc-900 text-sky-400">
          <Icon className="w-4 h-4" />
        </div>
        <h4 className="text-lg font-semibold text-zinc-100">{title}</h4>
        <span className="font-mono text-[10px] text-zinc-600">({items.length})</span>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-zinc-800" aria-hidden />

        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative pl-12 sm:pl-16"
              data-aos="fade-up"
              data-aos-delay={aosStaggerDelay(index)}
            >
              <div className="absolute left-2.5 sm:left-4.5 top-5 flex h-3 w-3 items-center justify-center">
                <span className="absolute h-3 w-3 rounded-full border border-sky-500/50 bg-[#050508]" />
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              </div>

              <GlowCard className="p-5">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-sky-500/80">
                    {item.period}
                  </span>
                  <h4 className="text-sm font-semibold text-zinc-100 mt-1">{item.title}</h4>
                  <p className="text-xs text-sky-400/80 mt-0.5">{item.org}</p>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const AboutPage = () => {
  const [totalProjects, setTotalProjects] = useState(() => readCachedCount("projects"));
  const [totalCertificates, setTotalCertificates] = useState(() => readCachedCount("certificates"));
  const [journey, setJourney] = useState({ education: [], experience: [], organization: [] });

  const YearExperience = useMemo(() => {
    const startDate = new Date("2021-11-06");
    const today = new Date();
    return (
      today.getFullYear() -
      startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0)
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("certificates").select("*").order("id", { ascending: false }),
      ]);

      if (cancelled) return;

      if (!projectsResponse.error && projectsResponse.data) {
        const projectData = mapProjects(projectsResponse.data);
        setTotalProjects(projectData.length);
        localStorage.setItem("projects", JSON.stringify(projectData));
      }

      if (!certificatesResponse.error && certificatesResponse.data) {
        const certificateData = mapCertificates(certificatesResponse.data);
        setTotalCertificates(certificateData.length);
        localStorage.setItem("certificates", JSON.stringify(certificateData));
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    async function loadJourney() {
      const { data, error } = await supabase
        .from("journey")
        .select("*")
        .order("type")
        .order("order_index", { ascending: true });

      if (error || !data) {
        setJourney({
          education: SITE.education || [],
          experience: SITE.experience || [],
          organization: SITE.organization || [],
        });
        return;
      }

      const items = mapJourney(data);
      setJourney({
        education: items.filter((i) => i.type === "education"),
        experience: items.filter((i) => i.type === "experience"),
        organization: items.filter((i) => i.type === "organization"),
      });
    }
    loadJourney();
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      value: totalProjects,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
    },
    {
      icon: Award,
      value: totalCertificates,
      label: "Certificates",
      description: "Professional skills validated",
    },
    {
      icon: Globe,
      value: YearExperience,
      label: "Years of Experience",
      description: "Continuous learning journey",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  return (
    <SectionShell
      id="About"
      className="pb-[10%] pt-24 sm:pt-28"
      itemScope
      itemType="https://schema.org/Person"
    >
      <SectionHeader
        label="02 — About"
        title="About Me"
        subtitle="Mengubah ide menjadi solusi digital melalui kode, desain, dan inovasi."
      />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left w-full max-w-full">
            <h2 className="font-bold w-full" data-aos="fade-up">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-500/90">
                Hello, I'm
              </span>
              <span 
                className="block w-full max-w-full mt-2 text-gray-200 font-bold leading-tight text-2xl sm:text-3xl lg:text-4xl text-justify [text-align-last:justify]"
                itemProp="name"
              >
                {SITE.fullName}
              </span>
            </h2>
            
            <p 
              className="w-full max-w-full text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              {SITE.bioAbout}
            </p>

               {/* Quote Section */}
      <GlowCard
        className="my-6 border-l-2 border-l-sky-500/80 p-4 text-sm italic text-zinc-400"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        {SITE.quote}
      </GlowCard>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-3 w-full">
              <GlowLink
                href="https://drive.google.com/file/d/1LKXV3D5JiGCj9wCCmpPvi_AAGoYi8zWf/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                wrapperClassName="w-full lg:w-auto"
                className="!px-6"
                data-aos="fade-up"
                data-aos-delay="160"
              >
                <FileText className="w-4 h-4" /> Download CV
              </GlowLink>
              <GlowLink
                href="#Portofolio"
                variant="secondary"
                wrapperClassName="w-full lg:w-auto"
                className="!px-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <Code className="w-4 h-4" /> View Projects
              </GlowLink>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))}
          </div>
        </a>

        {/* Journey Sections */}
        <div className="mt-20 space-y-16">
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky-500/90 text-center mb-3" data-aos="fade-up">
            Journey
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-zinc-100 text-center mb-12" data-aos="fade-up" data-aos-delay="80">
            Education, Experience & Organization
          </h3>

          <TimelineSection
            title="Education"
            icon={GraduationCap}
            items={journey.education}
          />

          <TimelineSection
            title="Experience"
            icon={Briefcase}
            items={journey.experience}
          />

          <TimelineSection
            title="Organization"
            icon={Users}
            items={journey.organization}
          />
        </div>

        {/* GitHub Contributions */}
        <div className="mt-16" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-8 max-w-2xl mx-auto">
            <div className="flex h-8 w-8 items-center justify-center border border-zinc-700 bg-zinc-900 text-sky-400">
              <Code className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-semibold text-zinc-100">GitHub Activity</h4>
          </div>

          <GlowCard className="p-5 sm:p-6 max-w-4xl mx-auto overflow-x-auto">
            <div className="flex justify-center min-w-[700px]">
              <GitHubCalendar
                username={SOCIAL_PROFILES.github.handle.replace("@", "")}
                colorScheme="dark"
                fontSize={12}
                blockSize={12}
                blockMargin={4}
                theme={{
                  light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                }}
                labels={{
                  totalCount: `{{count}} contributions in the last year`,
                }}
              />
            </div>
          </GlowCard>
        </div>
      </div>

    </SectionShell>
  );
};

export default memo(AboutPage);