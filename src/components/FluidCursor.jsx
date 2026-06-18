import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashCursor from './SplashCursor';

function shouldDisable(pathname, isMobile) {
  if (isMobile) return true;
  if (pathname !== '/') return true;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return false;
}

export default function FluidCursor() {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (shouldDisable(pathname, isMobile)) return null;

  return (
    <SplashCursor
      COLOR="#00daff"
      RAINBOW_MODE={false}
      TRANSPARENT
      DYE_RESOLUTION={512}
      SIM_RESOLUTION={64}
      SPLAT_FORCE={5000}
      DENSITY_DISSIPATION={4}
    />
  );
}
