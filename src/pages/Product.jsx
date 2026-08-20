import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus, Sparkles, Coffee } from 'lucide-react';
import products, { milkOptions, extraAddons } from '../data/products';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import ProductCard from '../components/ProductCard';

export default function Product({ favorites }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { tableNumber } = useTable();
  const product = products.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMilk, setSelectedMilk] = useState(milkOptions[0]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [specialNote, setSpecialNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isBeverage = product && ['Coffee', 'Cold Coffee', 'Tea'].includes(product.category);

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

  // Price calculations with customizations
  const milkAddonPrice = isBeverage && selectedMilk ? selectedMilk.price : 0;
  const extrasAddonPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = activeSize.price + milkAddonPrice + extrasAddonPrice;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  const handleAddToCart = () => {
    const customizations = {
      milkLabel: isBeverage ? selectedMilk.label : null,
      milkPrice: milkAddonPrice,
      extrasLabels: selectedExtras.map((e) => e.label),
      extrasPrices: selectedExtras.reduce((acc, e) => ({ ...acc, [e.id]: e.price }), {}),
      note: specialNote.trim(),
    };

    addItem(product, activeSize, quantity, customizations);
    setQuantity(1);
    setSpecialNote('');
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
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-warm-gray hover:text-espresso transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="text-xs text-warm-gray bg-cream px-3 py-1 rounded-full border border-border/60">
            Serving to: <strong className="text-espresso">Table {tableNumber}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            className="rounded-3xl overflow-hidden aspect-square bg-cream border border-border/40"
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
            className="flex flex-col justify-between"
          >
            <div>
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
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-200 ${
                          activeSize.label === size.label
                            ? 'bg-espresso text-ivory border-espresso shadow-xs'
                            : 'border-border/60 text-warm-gray hover:border-espresso/30 bg-white'
                        }`}
                      >
                        {size.label} · {formatPrice(size.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Milk Options (Beverages only) */}
              {isBeverage && (
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Coffee size={14} className="text-caramel" />
                    <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-warm-gray">
                      Choice of Milk
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {milkOptions.map((milk) => {
                      const isSelected = selectedMilk.id === milk.id;
                      return (
                        <button
                          key={milk.id}
                          type="button"
                          onClick={() => setSelectedMilk(milk)}
                          className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                            isSelected
                              ? 'bg-espresso text-ivory border-espresso'
                              : 'bg-white border-border/60 text-charcoal hover:border-caramel/40'
                          }`}
                        >
                          <p className="font-medium truncate">{milk.label}</p>
                          <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-ivory/70' : 'text-warm-gray'}`}>
                            {milk.price === 0 ? 'Included' : `+${formatPrice(milk.price)}`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add-ons & Extras */}
              {isBeverage && (
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles size={14} className="text-caramel" />
                    <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-warm-gray">
                      Customize & Extras
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {extraAddons.map((extra) => {
                      const isSelected = selectedExtras.some((e) => e.id === extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra)}
                          className={`px-3.5 py-2 rounded-full border text-xs transition-all ${
                            isSelected
                              ? 'bg-coffee text-ivory border-coffee shadow-xs'
                              : 'bg-white border-border/60 text-charcoal hover:border-caramel/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {extra.label} ({formatPrice(extra.price)})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Note */}
              <div className="mb-6">
                <label htmlFor="specialNote" className="block text-xs font-medium tracking-[0.15em] uppercase text-warm-gray mb-2">
                  Special Notes for Barista / Kitchen
                </label>
                <input
                  id="specialNote"
                  type="text"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g. Extra hot, less sugar, serve warm..."
                  className="w-full px-4 py-2.5 bg-white border border-border/60 rounded-xl text-xs text-espresso placeholder-warm-gray/50 focus:outline-none focus:border-caramel/40"
                />
              </div>
            </div>

            {/* Price & Quantity & Add to Cart */}
            <div className="pt-6 border-t border-border/60">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-warm-gray">Item Total</span>
                <div className="text-right">
                  <span className="font-display text-3xl font-semibold text-espresso">
                    {formatPrice(totalPrice)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-warm-gray block">
                      ({formatPrice(unitPrice)} each)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border/60 rounded-full bg-white">
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
                  className="flex-1 py-3.5 bg-espresso text-ivory text-sm font-medium rounded-full hover:bg-coffee transition-colors duration-200 shadow-md"
                >
                  Add to Table {tableNumber} Order · {formatPrice(totalPrice)}
                </button>
              </div>
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
