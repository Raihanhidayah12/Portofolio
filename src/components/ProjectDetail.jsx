import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
} from "lucide-react";
import Swal from "sweetalert2";
import { toSlug } from "../utils/slug";
import { SITE } from "../config/site";
import { PageGridBg, SecondaryButton } from "./ui/layout";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="group px-3 py-2 md:px-4 md:py-2.5 border border-zinc-800 bg-zinc-950/60 hover:border-sky-500/30 transition-colors cursor-default">
      <div className="flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-400" />
        <span className="text-xs md:text-sm font-medium text-zinc-300 group-hover:text-sky-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 border border-transparent hover:border-zinc-800 hover:bg-zinc-950/50 transition-colors">
      <div className="relative mt-2.5">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-400" />
      </div>
      <span className="text-sm md:text-base text-zinc-400 group-hover:text-zinc-200 transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 border border-zinc-800 bg-zinc-950/70">
      <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 border border-zinc-800 bg-zinc-900/50">
        <div className="bg-sky-500/15 p-1.5 md:p-2">
          <Code2 className="text-sky-400 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-zinc-100">{techStackCount}</div>
          <div className="text-[10px] md:text-xs text-zinc-600 font-mono uppercase tracking-wider">
            Total Teknologi
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 border border-zinc-800 bg-zinc-900/50">
        <div className="bg-sky-500/15 p-1.5 md:p-2">
          <Layers className="text-sky-400 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-zinc-100">{featuresCount}</div>
          <div className="text-[10px] md:text-xs text-zinc-600 font-mono uppercase tracking-wider">
            Fitur Utama
          </div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Maaf, source code untuk proyek ini bersifat privat.",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#3085d6",
      background: "#050508",
      color: "#ffffff",
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    // Cari project berdasarkan slug yang di-generate dari Title
    const selectedProject = storedProjects.find(
      (p) => toSlug(p.Title) === slug,
    );

    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Github: selectedProject.Github || "https://github.com/Raihanhidayah12",
      };
      setProject(enhancedProject);
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Loading Project...
          </h2>
        </div>
      </div>
    );
  }

  const projectUrl = `${window.location.origin}/project/${toSlug(project.Title)}`;

  return (
    <>
      <Helmet>
        <title>{project.Title} — {SITE.fullName}</title>
        <meta
          name="description"
          content={
            project.Description
              ? project.Description.slice(0, 155)
              : `Project ${project.Title} oleh ${SITE.fullName} — ${SITE.jobTitle}.`
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={projectUrl} />
        <meta
          property="og:title"
          content={`${project.Title} — ${SITE.fullName}`}
        />
        <meta
          property="og:description"
          content={project.Description?.slice(0, 155)}
        />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:type" content="website" />
        {project.Img && <meta property="og:image" content={project.Img} />}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "${project.Title}",
            "description": "${project.Description?.replace(/"/g, '\\"')}",
            "url": "${projectUrl}",
            "author": {
              "@type": "Person",
              "name": ${JSON.stringify(SITE.fullName)},
              "url": ${JSON.stringify(window.location.origin)}
            }
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-[#050508] px-[2%] sm:px-0 relative overflow-hidden">
        <PageGridBg className="fixed inset-0" />

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
              <SecondaryButton
                type="button"
                onClick={() => navigate(-1)}
                className="group !px-3 md:!px-5 !py-2 md:!py-2.5 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </SecondaryButton>
              <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
                <span>Projects</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-white/90 truncate">{project.Title}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-6 md:space-y-10 animate-slideInLeft">
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-3xl md:text-6xl font-bold text-zinc-100 leading-tight tracking-tight">
                    {project.Title}
                  </h1>
                  <div className="h-px w-16 md:w-24 bg-sky-500/60" />
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
                    {project.Description}
                  </p>
                </div>

                <ProjectStats project={project} />

                <div className="flex flex-wrap gap-3 md:gap-4">
                  <a
                    href={project.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 md:px-8 py-2.5 md:py-4 bg-sky-500 text-zinc-950 text-sm md:text-base font-semibold hover:bg-sky-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    Live Demo
                  </a>

                  <a
                    href={project.Github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) =>
                      !handleGithubClick(project.Github) && e.preventDefault()
                    }
                    className="inline-flex items-center gap-2 px-4 md:px-8 py-2.5 md:py-4 border border-zinc-700 text-zinc-200 text-sm md:text-base font-semibold hover:border-sky-500/50 hover:text-sky-200 transition-colors"
                  >
                    <Github className="w-4 h-4 md:w-5 md:h-5" />
                    Github
                  </a>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-100 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                    <Code2 className="w-4 h-4 md:w-5 md:h-5 text-sky-400" />
                    Technologies Used
                  </h3>
                  {project.TechStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {project.TechStack.map((tech, index) => (
                        <TechBadge key={index} tech={tech} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-gray-400 opacity-50">
                      No technologies added.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6 md:space-y-10 animate-slideInRight">
                <div className="relative overflow-hidden border border-zinc-800 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                  <img
                    src={project.Img}
                    alt={project.Title}
                    className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
                </div>

                <div className="border border-zinc-800 bg-zinc-950/70 p-8 space-y-6 hover:border-zinc-700 transition-colors group">
                  <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                    Key Features
                  </h3>
                  {project.Features.length > 0 ? (
                    <ul className="list-none space-y-2">
                      {project.Features.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 opacity-50">
                      No features added.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .animate-fadeIn {
            animation: fadeIn 0.7s ease-out;
          }
          .animate-slideInLeft {
            animation: slideInLeft 0.7s ease-out;
          }
          .animate-slideInRight {
            animation: slideInRight 0.7s ease-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ProjectDetails;
