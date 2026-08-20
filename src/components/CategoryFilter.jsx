import { motion } from 'framer-motion';

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto category-scroll pb-2 -mb-2" role="tablist" aria-label="Filter by category">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          role="tab"
          aria-selected={active === cat}
          className={`relative px-5 py-2.5 text-xs font-medium tracking-[0.12em] uppercase whitespace-nowrap rounded-full transition-colors duration-200 ${
            active === cat
              ? 'text-ivory'
              : 'text-warm-gray hover:text-espresso hover:bg-cream border border-border/60'
          }`}
        >
          {active === cat && (
            <motion.div
              layoutId="activeCategoryPill"
              className="absolute inset-0 bg-espresso rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
}
