import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Check } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, favorites, index = 0 }) {
  const { addItem } = useCart();
  const isFav = favorites.isFavorite(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border border-border/60 card-lift"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/8 transition-colors duration-500" />
      </Link>

      {/* Favorite button */}
      <button
        onClick={() => favorites.toggleFavorite(product.id)}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/85 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
        aria-label={isFav ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
      >
        <motion.div
          animate={isFav ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            className={`transition-colors duration-200 ${
              isFav ? 'fill-caramel text-caramel' : 'text-warm-gray'
            }`}
          />
        </motion.div>
      </button>

      {/* Content */}
      <div className="p-4 md:p-5">
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-caramel mb-1.5">
          {product.category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg md:text-xl font-semibold text-espresso mb-1 hover:text-coffee transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-warm-gray leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-espresso">{formatPrice(product.price)}</span>
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.93 }}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full transition-all duration-300 ${
              added
                ? 'bg-green-700/90 text-white'
                : 'bg-espresso text-ivory hover:bg-coffee'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="flex items-center gap-1"
                >
                  <Check size={13} strokeWidth={2.5} />
                  Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="flex items-center gap-1"
                >
                  <Plus size={14} strokeWidth={2} />
                  Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

