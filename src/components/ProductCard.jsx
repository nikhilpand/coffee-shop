import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Check, Flame } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, favorites, index = 0 }) {
  const { addItem } = useCart();
  const isFav = favorites.isFavorite(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border border-border/60 card-lift flex flex-col justify-between"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        {/* Image */}
        <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-cream">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/5 transition-colors duration-500" />
          
          {/* Popular Tag */}
          {product.popular && (
            <span className="absolute top-3 left-3 bg-espresso/85 backdrop-blur-xs text-ivory text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-xs">
              Popular
            </span>
          )}
        </Link>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            favorites.toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
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
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-caramel">
              {product.category}
            </span>
            {product.roastLabel && (
              <span className="text-[9px] font-semibold text-warm-gray bg-cream px-2 py-0.5 rounded-md flex items-center gap-1">
                <Flame size={10} className="text-caramel" /> {product.roastLabel}
              </span>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-lg font-bold text-espresso mb-1 hover:text-coffee transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-warm-gray leading-relaxed line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Tasting Notes Chips */}
          {product.tastingNotes && product.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.tastingNotes.slice(0, 2).map((note) => (
                <span
                  key={note}
                  className="text-[10px] bg-cream/70 text-espresso/80 font-medium px-2 py-0.5 rounded-full border border-border/40"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between border-t border-border/30 pt-3 mt-auto">
        <span className="text-sm sm:text-base font-bold text-espresso">{formatPrice(product.price)}</span>
        <motion.button
          onClick={handleAdd}
          whileTap={{ scale: 0.93 }}
          className={`flex items-center gap-1 px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-full transition-all duration-300 shadow-2xs ${
            added
              ? 'bg-green-700 text-white'
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
                <Plus size={13} strokeWidth={2.2} />
                Add
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
