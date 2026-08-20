import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  return (
    <div className={`${alignClass} mb-10 md:mb-14`}>
      {eyebrow && (
        <motion.p
          className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso leading-tight tracking-tight"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className={`mt-4 text-warm-gray text-base md:text-lg leading-relaxed ${
            align === 'center' ? 'max-w-lg mx-auto' : 'max-w-lg'
          }`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
