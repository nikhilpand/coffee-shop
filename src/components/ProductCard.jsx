import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, favorites, index = 0 }) {
  const { addItem } = useCart();
  const isFav = favorites.isFavorite(product.id);

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border border-border/60 hover:border-border transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,35,20,0.06)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Favorite button */}
      <button
        onClick={() => favorites.toggleFavorite(product.id)}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
        aria-label={isFav ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
      >
        <motion.div
          animate={isFav ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={16}
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
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-espresso text-ivory text-xs font-medium rounded-full hover:bg-coffee transition-colors duration-200"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={14} strokeWidth={2} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
