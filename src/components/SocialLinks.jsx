import { useEffect } from "react";
import { Linkedin, Github, Instagram, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { SOCIAL_PROFILES } from "../config/social";

const socialLinks = [
  {
    name: "LinkedIn",
    displayName: "LinkedIn",
    subText: "Professional network",
    icon: Linkedin,
    url: SOCIAL_PROFILES.linkedin.url,
    isPrimary: true,
  },
  {
    name: "Instagram",
    displayName: "Instagram",
    subText: SOCIAL_PROFILES.instagram.handle,
    icon: Instagram,
    url: SOCIAL_PROFILES.instagram.url,
  },
  {
    name: "GitHub",
    displayName: "GitHub",
    subText: SOCIAL_PROFILES.github.handle,
    icon: Github,
    url: SOCIAL_PROFILES.github.url,
  },
];

const SocialLinks = () => {
  useEffect(() => {
    AOS.init({ offset: 10 });
  }, []);

  return (
    <div className="w-full border border-zinc-800 bg-zinc-950/80 p-5 sm:p-6">
      <h3
        className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-sky-500/90"
        data-aos="fade-down"
      >
        Connect
      </h3>

      <div className="flex flex-col gap-3">
        {socialLinks.map((link, index) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-sky-500/40 ${
              link.isPrimary ? "hover:bg-sky-500/5" : ""
            }`}
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-700 text-zinc-300 group-hover:border-sky-500/50 group-hover:text-sky-400">
                <link.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-200 group-hover:text-white">
                  {link.displayName}
                </span>
                <span className="block truncate text-xs text-zinc-600 group-hover:text-zinc-400">
                  {link.subText}
                </span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-sky-400" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
