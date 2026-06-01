import { useLocation } from 'react-router-dom';
import SplashCursor from './SplashCursor';

const HIDDEN_PREFIXES = ['/dashboard', '/login'];

function shouldHideCursor(pathname) {
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function getDyeResolution() {
  if (typeof window === 'undefined') return 1024;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
  return window.matchMedia('(max-width: 768px)').matches ? 512 : 1024;
}

/** Efek fluid cursor — nonaktif di login/dashboard & reduced-motion */
export default function FluidCursor() {
  const { pathname } = useLocation();

  if (shouldHideCursor(pathname)) return null;

  const dyeResolution = getDyeResolution();
  if (dyeResolution === 0) return null;

  return (
    <SplashCursor
      COLOR="#00daff"
      RAINBOW_MODE={false}
      TRANSPARENT
      DYE_RESOLUTION={dyeResolution}
      SIM_RESOLUTION={128}
      SPLAT_FORCE={5000}
      DENSITY_DISSIPATION={4}
    />
  );
}
