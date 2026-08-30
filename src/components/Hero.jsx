import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

const letterVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.5 + i * 0.035,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function AnimatedHeading({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-cream">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80"
          alt="Warm café interior with morning light"
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/80 to-ivory/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory/60 via-transparent to-transparent" />
      </motion.div>

      {/* Subtle grain texture on hero */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Steam decoration */}
      <div className="absolute right-[18%] top-[28%] hidden lg:block opacity-40 pointer-events-none">
        <svg width="40" height="100" viewBox="0 0 40 100" fill="none">
          <path
            className="steam-line"
            d="M20 100 C20 80, 10 70, 20 55 C30 40, 15 30, 20 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            style={{ color: 'var(--color-sand)' }}
          />
          <path
            className="steam-line"
            d="M12 100 C12 82, 22 68, 12 50 C2 35, 18 25, 12 5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            style={{ color: 'var(--color-sand)' }}
          />
          <path
            className="steam-line"
            d="M28 100 C28 78, 18 65, 28 48 C38 32, 22 22, 28 2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            style={{ color: 'var(--color-sand)' }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full py-32 md:py-0">
        <div className="max-w-xl">
          <motion.p
            className="text-xs md:text-sm font-medium tracking-[0.25em] uppercase text-caramel mb-5 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Your Daily Ritual
          </motion.p>

          <h1 className="font-display text-fluid-hero font-semibold text-espresso leading-[1.05] tracking-tight mb-6 md:mb-8">
            <AnimatedHeading text="Coffee," />
            <br />
            <span className="italic font-normal">
              <AnimatedHeading text="slowly made." className="italic font-normal" />
            </span>
          </h1>

          <motion.p
            className="text-fluid-base text-warm-gray leading-relaxed max-w-md mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            Thoughtfully brewed coffee, warm pastries and little moments worth staying for.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 md:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            <MagneticButton as={Link} to="/menu" strength={0.25}>
              <span className="inline-flex items-center px-7 py-3.5 bg-espresso text-ivory text-sm font-medium tracking-wide rounded-full hover:bg-coffee transition-colors duration-300 shadow-lg shadow-espresso/20">
                Explore Menu
              </span>
            </MagneticButton>
            <MagneticButton as={Link} to="/about" strength={0.25}>
              <span className="inline-flex items-center px-7 py-3.5 border border-espresso/20 text-espresso text-sm font-medium tracking-wide rounded-full hover:bg-espresso/5 transition-colors duration-300">
                Visit Us
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
    </section>
  );
}
