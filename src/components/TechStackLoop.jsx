import { useMemo } from 'react';
import LogoLoop from './LogoLoop';
import { toLogoLoopItems } from '../utils/techStackLogoItems';

export default function TechStackLoop({ techStacks }) {
  const logos = useMemo(() => toLogoLoopItems(techStacks), [techStacks]);

  if (!logos.length) {
    return (
      <p className="text-center text-zinc-500 text-sm py-6">
        Belum ada tech stack. Jalankan supabase/tech-stack.sql atau tambah dari Dashboard.
      </p>
    );
  }

  return (
    <div className="tech-stack-loop relative h-[88px] sm:h-[100px] w-full overflow-hidden">
      <LogoLoop
        logos={logos}
        speed={70}
        direction="left"
        logoHeight={44}
        gap={56}
        hoverSpeed={0}
        fadeOut
        fadeOutColor="#050508"
        scaleOnHover
        ariaLabel="Technology stack"
        className="tech-stack-loop__logoloop"
      />
    </div>
  );
}
