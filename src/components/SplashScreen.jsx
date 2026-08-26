import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('fill'); // 'fill' | 'text' | 'out'

  useEffect(() => {
    // Phase 1 → cup fills + steam appears (1.2s)
    const t1 = setTimeout(() => setPhase('text'), 1200);
    // Phase 2 → brand text fades in (1.0s more)
    const t2 = setTimeout(() => setPhase('out'), 2500);
    // Phase 3 → fade out then signal done
    const t3 = setTimeout(() => onDone(), 3200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'out' ? 0 : 1 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#2C1810' }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(196,164,122,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Coffee Cup SVG */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-7"
          >
            <svg
              width="72"
              height="88"
              viewBox="0 0 72 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cup body */}
              <path
                d="M10 28 L16 76 Q16 80 20 80 L52 80 Q56 80 56 76 L62 28 Z"
                fill="none"
                stroke="#C4A47A"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Coffee liquid fill — animated */}
              <clipPath id="cupClip">
                <path d="M11 29 L17 75 Q17 79 20 79 L52 79 Q55 79 55 75 L61 29 Z" />
              </clipPath>
              <motion.rect
                x="0"
                y="0"
                width="72"
                height="88"
                fill="#5C3D2E"
                clipPath="url(#cupClip)"
                initial={{ y: 88 }}
                animate={{ y: 38 }}
                transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
              />
              {/* Crema / surface */}
              <motion.ellipse
                cx="36"
                cy="38"
                rx="22"
                ry="4"
                fill="#C4A47A"
                opacity={0.5}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.5 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              />
              {/* Handle */}
              <path
                d="M56 44 Q70 44 70 56 Q70 68 56 68"
                fill="none"
                stroke="#C4A47A"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Saucer */}
              <ellipse
                cx="36"
                cy="82"
                rx="26"
                ry="4"
                fill="none"
                stroke="#C4A47A"
                strokeWidth="1.5"
                opacity="0.6"
              />

              {/* Steam paths */}
              {[
                { d: 'M28 26 C28 18, 22 14, 28 6', delay: 1.0 },
                { d: 'M36 24 C36 16, 42 12, 36 4', delay: 1.2 },
                { d: 'M44 26 C44 18, 38 14, 44 6', delay: 1.4 },
              ].map((s, i) => (
                <motion.path
                  key={i}
                  d={s.d}
                  stroke="#C4A47A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: [0, 0.7, 0], pathLength: 1 }}
                  transition={{
                    delay: s.delay,
                    duration: 1.4,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </svg>
          </motion.div>

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: phase === 'text' || phase === 'out' ? 1 : 0, y: phase === 'text' || phase === 'out' ? 0 : 12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#FAF7F2',
                fontSize: '2.4rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              Slow Pour
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: '#C4A47A',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: '0.5rem',
              }}
            >
              Coffee, slowly made.
            </p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            style={{ width: 48, height: 2, borderRadius: 2, background: 'rgba(196,164,122,0.2)' }}
          >
            <motion.div
              style={{ height: '100%', borderRadius: 2, background: '#C4A47A' }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
