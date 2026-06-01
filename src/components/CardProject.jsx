import React from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { toSlug } from "../utils/slug";
import { GlowCard, GlowLink } from "./ui/layout";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <div className="group relative h-full w-full interactive-lift">
      <GlowCard className="flex h-full flex-col overflow-hidden">
        <div className="relative overflow-hidden border-b border-zinc-800/80">
          <img
            src={Img}
            alt={Title}
            className="aspect-[16/8] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-2">
            Project
          </p>
          <h3 className="text-lg font-semibold text-zinc-100">{Title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 line-clamp-2">
            {Description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-800/80 pt-4">
            {ProjectLink ? (
              <a
                href={ProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300"
              >
                Live Demo
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-xs text-zinc-600">No demo</span>
            )}

            {id ? (
              <GlowLink
                to={`/project/${toSlug(Title)}`}
                variant="secondary"
                onClick={handleDetails}
                className="!px-3 !py-1.5 text-xs"
                wrapperClassName="!inline-flex"
              >
                Details
                <ArrowRight className="h-3.5 w-3.5" />
              </GlowLink>
            ) : (
              <span className="text-xs text-zinc-600">No details</span>
            )}
          </div>
        </div>
      </GlowCard>
    </div>
  );
};

export default CardProject;
