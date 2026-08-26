import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus, Sparkles, Coffee, UtensilsCrossed, Check, Flame, MapPin } from 'lucide-react';
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
  const [added, setAdded] = useState(false);

  const isBeverage = product && ['Coffee', 'Cold Coffee', 'Tea'].includes(product.category);

  // Finding pairing product if available
  const pairingProduct = useMemo(() => {
    if (!product?.pairing?.id) return null;
    return products.find((p) => p.id === product.pairing.id);
  }, [product]);

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
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
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
        {/* Back navigation & table context badge */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-gray hover:text-espresso transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
            Back to Menu
          </button>
          <span className="text-xs text-warm-gray bg-cream px-3.5 py-1.5 rounded-full border border-border/80 flex items-center gap-1.5 shadow-xs">
            <UtensilsCrossed size={12} className="text-caramel" />
            <span>Ordering for: <strong className="text-espresso font-semibold">Table {tableNumber}</strong></span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image & Provenance Card */}
          <div className="space-y-4">
            <motion.div
              className="rounded-3xl overflow-hidden aspect-square bg-cream border border-border/60 shadow-sm relative group"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {product.popular && (
                <span className="absolute top-4 left-4 bg-espresso/90 backdrop-blur-sm text-ivory text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-md">
                  House Bestseller
                </span>
              )}
            </motion.div>

            {/* Estate Provenance & Brew Method Box */}
            {product.origin && (
              <div className="bg-white rounded-2xl p-4 border border-border/60 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-caramel flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-warm-gray">Single-Origin Terroir</p>
                    <p className="font-semibold text-xs text-espresso">{product.origin}</p>
                  </div>
                </div>
                {product.brewMethod && (
                  <span className="text-[10px] font-semibold bg-cream px-3 py-1 rounded-full text-warm-gray border border-border/40 hidden sm:inline-block">
                    {product.brewMethod}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Details & Customizations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-caramel">
                  {product.category}
                </span>

                {/* Roast Level Meter for coffees */}
                {product.roastLevel && (
                  <div className="flex items-center gap-1.5 bg-cream/80 px-3 py-1 rounded-full border border-border/60">
                    <Flame size={12} className="text-caramel" />
                    <span className="text-[11px] font-semibold text-espresso">{product.roastLabel}</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`w-1.5 h-1.5 rounded-full ${
                            level <= product.roastLevel ? 'bg-caramel' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Favorite */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso leading-tight">
                  {product.name}
                </h1>
                <button
                  onClick={() => favorites.toggleFavorite(product.id)}
                  className="p-3 rounded-full border border-border/60 hover:bg-cream transition-all mt-1 shadow-xs"
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

              <p className="text-warm-gray leading-relaxed mb-5 text-sm md:text-base">
                {product.description}
              </p>

              {/* Tasting Notes */}
              {product.tastingNotes && product.tastingNotes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-warm-gray mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-caramel" /> Tasting Profile
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="px-3 py-1 bg-white text-xs font-medium text-espresso rounded-full border border-border/80 shadow-2xs"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {product.sizes.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-warm-gray mb-2.5">
                    Cup Size & Volume
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                          activeSize.label === size.label
                            ? 'bg-espresso text-ivory border-espresso shadow-xs scale-102'
                            : 'border-border/70 text-warm-gray hover:border-espresso/30 bg-white'
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
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Coffee size={14} className="text-caramel" />
                    <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-warm-gray">
                      Artisan Milk Choice
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
                              ? 'bg-espresso text-ivory border-espresso shadow-xs'
                              : 'bg-white border-border/70 text-charcoal hover:border-caramel/50'
                          }`}
                        >
                          <p className="font-semibold truncate">{milk.label}</p>
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
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkles size={14} className="text-caramel" />
                    <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-warm-gray">
                      Craft Add-ons
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
                          className={`px-3.5 py-2 rounded-full border text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-coffee text-ivory border-coffee shadow-xs'
                              : 'bg-white border-border/70 text-charcoal hover:border-caramel/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {extra.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chef's Pairing Recommendation */}
              {pairingProduct && (
                <div className="bg-cream/70 rounded-2xl p-4 border border-border/70 mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={pairingProduct.image}
                      alt={pairingProduct.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-caramel">Chef's Table Pairing</p>
                      <p className="font-semibold text-xs text-espresso">{pairingProduct.name}</p>
                      <p className="text-[11px] text-warm-gray">{product.pairing?.note}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addItem(pairingProduct)}
                    className="px-3.5 py-2 bg-espresso hover:bg-coffee text-ivory text-xs font-semibold rounded-full shadow-xs transition-colors flex-shrink-0"
                  >
                    + Add ({formatPrice(pairingProduct.price)})
                  </button>
                </div>
              )}

              {/* Special Note */}
              <div className="mb-6">
                <label htmlFor="specialNote" className="block text-xs font-semibold tracking-[0.15em] uppercase text-warm-gray mb-2">
                  Special Notes for Barista
                </label>
                <input
                  id="specialNote"
                  type="text"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g. Extra hot, less ice, warm croissant..."
                  className="w-full px-4 py-2.5 bg-white border border-border/70 rounded-xl text-xs text-espresso placeholder-warm-gray/50 focus:outline-none focus:border-caramel/50"
                />
              </div>
            </div>

            {/* Price & Quantity & Add to Cart */}
            <div className="pt-6 border-t border-border/80">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-warm-gray">Total for Item</span>
                <div className="text-right">
                  <span className="font-display text-3xl font-bold text-espresso">
                    {formatPrice(totalPrice)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-warm-gray block">
                      ({formatPrice(unitPrice)} each)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center border border-border/70 rounded-full bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-warm-gray hover:text-espresso transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-espresso">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-warm-gray hover:text-espresso transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                    added ? 'bg-green-700 text-white' : 'bg-espresso text-ivory hover:bg-coffee'
                  }`}
                >
                  {added ? <Check size={16} /> : null}
                  {added ? 'Added to Order!' : `Add to Table ${tableNumber} · ${formatPrice(totalPrice)}`}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20 md:mt-28">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-espresso mb-8">
              More from {product.category}
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
