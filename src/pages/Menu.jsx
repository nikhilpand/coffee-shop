import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import products, { categories } from '../data/products';

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'popular', label: 'Popular' },
];

export default function Menu({ favorites }) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [searchFilter, setSearchFilter] = useState(initialSearch);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) setSearchFilter(s);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter((p) => {
        const hay = [p.name, p.category, p.description, ...(p.tags || [])].join(' ').toLowerCase();
        return hay.includes(q);
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, sortBy, searchFilter]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-24 md:pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="Our Menu"
          title="Good coffee. Something sweet."
          description="Something worth staying for."
        />

        {/* Search bar (menu page) */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search menu..."
            className="w-full px-5 py-3 bg-white border border-border/60 rounded-full text-sm text-espresso placeholder-warm-gray/50 focus:outline-none focus:border-caramel/40 transition-colors"
            aria-label="Search menu items"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />

          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wide uppercase text-warm-gray border border-border/60 rounded-full hover:text-espresso hover:border-espresso/20 transition-colors"
              aria-label="Sort products"
              aria-expanded={showSort}
            >
              <SlidersHorizontal size={14} />
              {sortOptions.find((o) => o.value === sortBy)?.label}
            </button>

            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-2 bg-white border border-border/60 rounded-xl shadow-lg overflow-hidden z-20 min-w-[180px]"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSort(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        sortBy === opt.value
                          ? 'bg-cream text-espresso font-medium'
                          : 'text-warm-gray hover:bg-cream/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Products grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${sortBy}-${searchFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} favorites={favorites} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="font-display text-2xl text-espresso mb-2">Nothing here</p>
                <p className="text-sm text-warm-gray">
                  Try a different category or search term.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Results count */}
        <p className="text-xs text-warm-gray mt-8 text-center">
          Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>
    </motion.main>
  );
}
