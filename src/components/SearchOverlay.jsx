import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Clock, TrendingUp, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { popularSearches } from '../data/products';

export default function SearchOverlay({ search }) {
  const { query, setQuery, results, isOpen, close, recentSearches, addRecent, clearRecent } = search;
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const handleSelect = (product) => {
    addRecent(product.name);
    close();
    navigate(`/product/${product.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      addRecent(query.trim());
      close();
      navigate(`/menu?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handlePopularClick = (term) => {
    setQuery(term);
    addRecent(term);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-overlay"
            onClick={close}
          />

          {/* Search panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-[70] bg-ivory border-b border-border shadow-lg"
          >
            <div className="max-w-2xl mx-auto px-5 py-5">
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <SearchIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search coffee, pastries, snacks..."
                  className="w-full pl-12 pr-12 py-3.5 bg-cream rounded-xl text-espresso placeholder-warm-gray/60 text-sm border border-border/60 focus:outline-none focus:border-caramel/40 transition-colors"
                  aria-label="Search products"
                />
                <button
                  type="button"
                  onClick={close}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-sand/30 text-warm-gray transition-colors"
                  aria-label="Close search"
                >
                  <X size={16} />
                </button>
              </form>

              {/* Results / Suggestions */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {query.length > 0 ? (
                  <>
                    {results.length > 0 ? (
                      <div>
                        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-warm-gray mb-3">
                          Suggestions
                        </p>
                        <div className="space-y-1">
                          {results.slice(0, 6).map((product, i) => (
                            <motion.button
                              key={product.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              onClick={() => handleSelect(product)}
                              className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-cream transition-colors text-left"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-espresso truncate">{product.name}</p>
                                <p className="text-xs text-warm-gray">
                                  {product.category} · {formatPrice(product.price)}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Coffee size={32} className="mx-auto text-sand mb-3" />
                        <p className="text-sm text-warm-gray">
                          No results for "<span className="text-espresso font-medium">{query}</span>"
                        </p>
                        <p className="text-xs text-warm-gray/70 mt-1">Try a different search term</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-warm-gray">
                            Recent
                          </p>
                          <button
                            onClick={clearRecent}
                            className="text-xs text-caramel hover:text-coffee transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => setQuery(term)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-cream rounded-full text-xs text-warm-gray hover:text-espresso transition-colors"
                            >
                              <Clock size={12} />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular */}
                    <div>
                      <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-warm-gray mb-3 flex items-center gap-1.5">
                        <TrendingUp size={12} />
                        Popular
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handlePopularClick(term)}
                            className="px-3.5 py-1.5 border border-border/60 rounded-full text-xs text-warm-gray hover:text-espresso hover:border-espresso/20 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
