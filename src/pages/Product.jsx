import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus } from 'lucide-react';
import products from '../data/products';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Product({ favorites }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <main className="pt-32 pb-20 text-center">
        <p className="font-display text-2xl text-espresso mb-2">Product not found</p>
        <Link to="/menu" className="text-sm text-caramel hover:text-coffee transition-colors">
          Back to menu
        </Link>
      </main>
    );
  }

  const activeSize = selectedSize || product.sizes[0];
  const isFav = favorites.isFavorite(product.id);

  const handleAddToCart = () => {
    addItem(product, activeSize, quantity);
    setQuantity(1);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-24 md:pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-warm-gray hover:text-espresso transition-colors mb-8"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            className="rounded-2xl overflow-hidden aspect-square bg-cream"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-caramel mb-3">
              {product.category}
            </p>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso leading-tight">
                {product.name}
              </h1>
              <button
                onClick={() => favorites.toggleFavorite(product.id)}
                className="p-3 rounded-full border border-border/60 hover:bg-cream transition-all mt-1"
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <motion.div animate={isFav ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                  <Heart
                    size={20}
                    strokeWidth={1.8}
                    className={isFav ? 'fill-caramel text-caramel' : 'text-warm-gray'}
                  />
                </motion.div>
              </button>
            </div>

            <p className="text-warm-gray leading-relaxed mb-6 text-base md:text-lg">
              {product.description}
            </p>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-warm-gray mb-2">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-3 py-1 bg-cream text-xs text-warm-gray rounded-full border border-border/40"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Size selection */}
            {product.sizes.length > 1 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-warm-gray mb-3">
                  Size
                </h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-200 ${
                        activeSize.label === size.label
                          ? 'bg-espresso text-ivory border-espresso'
                          : 'border-border/60 text-warm-gray hover:border-espresso/30'
                      }`}
                    >
                      {size.label} · {formatPrice(size.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <span className="font-display text-3xl font-semibold text-espresso">
                {formatPrice(activeSize.price)}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border/60 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-warm-gray hover:text-espresso transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-medium text-espresso">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-warm-gray hover:text-espresso transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-espresso text-ivory text-sm font-medium rounded-full hover:bg-coffee transition-colors duration-200"
              >
                Add to Order · {formatPrice(activeSize.price * quantity)}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20 md:mt-28">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-espresso mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} favorites={favorites} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.main>
  );
}
