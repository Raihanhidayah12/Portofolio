import { useState, useEffect, useRef, Suspense } from 'react';
import { GridScan } from './GridScan';

function useIdleCallback(callback, deps = []) {
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(callback, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 200);
      return () => clearTimeout(id);
    }
  }, deps);
}

function useIsVisible(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

export default function HeroGridScan() {
  const containerRef = useRef(null);
  const isVisible = useIsVisible(containerRef);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useIdleCallback(() => {
    if (isVisible && !isMobile) {
      setShouldRender(true);
    }
  }, [isVisible, isMobile]);

  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null;
  }

  if (isMobile) return <div ref={containerRef} className="w-full h-full" />;

  return (
    <div ref={containerRef} className="w-full h-full">
      {shouldRender && (
        <Suspense fallback={null}>
          <GridScan
            className="hero-grid-scan"
            style={{ width: '100%', height: '100%' }}
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#1c1c24"
            gridScale={0.1}
            scanColor="#38bdf8"
            scanOpacity={0.42}
            scanDirection="pingpong"
            enablePost
            bloomIntensity={0.55}
            chromaticAberration={0.002}
            noiseIntensity={0.012}
            scanGlow={0.5}
            scanDuration={2.2}
            scanDelay={1.5}
            scanOnClick
          />
        </Suspense>
      )}
    </div>
  );
}
