import React, { useState } from 'react';
import { Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { PrimaryButton, SecondaryButton, GlowCard } from './ui/layout';

const ProjectCardModal = ({ title, description, link }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SecondaryButton
        type="button"
        className="!px-3 !py-1.5 text-white/90"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-sm">Details</span>
        <ArrowRight className="w-4 h-4" />
      </SecondaryButton>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <GlowCard
            className="relative w-full max-w-md p-6 text-white shadow-lg animate-slide-up sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <SecondaryButton
              type="button"
              className="!absolute !top-4 !right-4 !p-2"
              onClick={() => setIsOpen(false)}
            >
              <Eye className="h-5 w-5" />
            </SecondaryButton>
            <h2 className="mb-4 text-2xl font-bold">{title}</h2>
            <p className="mb-6 text-gray-400">{description}</p>
            <div className="flex justify-end gap-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <PrimaryButton type="button" className="!px-4 !py-2">
                  Live Demo <ExternalLink className="ml-2 inline-block h-5 w-5" />
                </PrimaryButton>
              </a>
              <SecondaryButton
                type="button"
                className="!px-4 !py-2"
                onClick={() => setIsOpen(false)}
              >
                Close
              </SecondaryButton>
            </div>
          </GlowCard>
        </div>
      )}
    </>
  );
};

export default ProjectCardModal;
