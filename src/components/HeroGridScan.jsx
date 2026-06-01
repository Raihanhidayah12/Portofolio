import { GridScan } from './GridScan';

/** Grid 3D interaktif untuk hero Home — tema sky portfolio */
export default function HeroGridScan() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null;
  }

  return (
    <GridScan
      className="hero-grid-scan"
      style={{ width: '100%', height: '100%' }}
      enableWebcam={false}
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
  );
}
