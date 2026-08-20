import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import products from '../data/products';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage({ favorites }) {
  const favProducts = products.filter((p) => favorites.isFavorite(p.id));

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-24 md:pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-3">
            Saved
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso leading-tight">
            Your favourites
          </h1>
        </div>

        {favProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {favProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} favorites={favorites} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Heart size={40} className="mx-auto text-sand mb-4" strokeWidth={1.2} />
            <p className="font-display text-2xl text-espresso mb-2">Nothing saved yet</p>
            <p className="text-sm text-warm-gray max-w-xs mx-auto">
              Find something you'll want again. Tap the heart on any item to save it here.
            </p>
          </div>
        )}
      </div>
    </motion.main>
  );
}
