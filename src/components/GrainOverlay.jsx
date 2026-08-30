/**
 * GrainOverlay — Subtle animated film grain texture for premium aesthetic.
 * Uses an SVG turbulence filter rendered via CSS; zero image downloads.
 * The grain pattern shifts subtly to avoid a static "frozen" look.
 */
export default function GrainOverlay({ opacity = 0.035, className = '' }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] ${className}`}
      aria-hidden="true"
      style={{ opacity, mixBlendMode: 'multiply' }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#grain-filter)"
          style={{ animation: 'grain-shift 8s steps(6) infinite' }}
        />
      </svg>
    </div>
  );
}
