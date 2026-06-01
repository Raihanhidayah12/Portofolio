import React from "react";

const TechStackIcon = ({ icon, language, TechStackIcon: legacyIcon, Language }) => {
  const src = icon ?? legacyIcon;
  const label = language ?? Language;

  return (
    <div className="group flex flex-col items-center justify-center gap-3 border border-zinc-800 bg-zinc-950/60 p-5 transition-colors hover:border-sky-500/40 hover:bg-sky-500/5">
      <img
        src={src}
        alt={`${label} icon`}
        className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-105 md:h-16 md:w-16"
      />
      <span className="text-center text-xs font-medium tracking-wide text-zinc-400 group-hover:text-zinc-200">
        {label}
      </span>
    </div>
  );
};

export default TechStackIcon;
