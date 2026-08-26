import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, RotateCcw, Check, Coffee, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import products from '../data/products';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';

const QUESTIONS = [
  {
    id: 'mood',
    title: 'How do you want to feel right now?',
    subtitle: 'Step 1 of 3 · Mindset & Energy',
    options: [
      { id: 'focus', label: '⚡ Deep Focus & Energy', desc: 'Bold, dark, high-caffeine punch' },
      { id: 'relax', label: '🌿 Gentle Comfort & Cozy', desc: 'Warm milk, velvety texture, mild roast' },
      { id: 'refresh', label: '🧊 Cool & Crisp Refreshment', desc: 'Chilled, low acidity, ultra clean' },
      { id: 'treat', label: '🍫 Sweet Decadent Treat', desc: 'Chocolate, vanilla, dessert indulgence' },
    ],
  },
  {
    id: 'roast',
    title: 'What flavor profile calls to you?',
    subtitle: 'Step 2 of 3 · Sensory Palate',
    options: [
      { id: 'dark', label: '🌰 Dark Cocoa & Toasted Nuts', desc: 'Full-bodied, earthy, smoky sweetness' },
      { id: 'medium', label: '🍯 Caramel, Toffee & Honey', desc: 'Balanced, smooth, naturally sweet' },
      { id: 'floral', label: '🌸 Floral, Spices & Herbal', desc: 'Aromatic cardamom, jasmine, green notes' },
    ],
  },
  {
    id: 'temperature',
    title: 'Hot steaming pour or iced crystal chill?',
    subtitle: 'Step 3 of 3 · Serving Ritual',
    options: [
      { id: 'hot', label: '☕ Steaming Hot Cup', desc: 'Freshly pulled espresso or simmered brew' },
      { id: 'cold', label: '🧊 Over Crystal Ice', desc: 'Slow-steeped 18hr cold drip' },
    ],
  },
];

export default function CoffeeMatcherModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({ mood: null, roast: null, temperature: null });
  const [matchedProduct, setMatchedProduct] = useState(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleSelectOption = (questionId, optionId) => {
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate match
      computeMatch(nextAnswers);
    }
  };

  const computeMatch = (finalAnswers) => {
    let match = null;

    if (finalAnswers.temperature === 'cold') {
      if (finalAnswers.mood === 'treat') {
        match = products.find((p) => p.id === 11) || products[9]; // Iced Vanilla Latte
      } else {
        match = products.find((p) => p.id === 10) || products[9]; // Slow Cold Brew
      }
    } else if (finalAnswers.roast === 'floral') {
      match = products.find((p) => p.id === 13) || products[12]; // Masala Chai or Matcha
    } else if (finalAnswers.mood === 'treat') {
      match = products.find((p) => p.id === 6) || products[5]; // Mocha
    } else if (finalAnswers.mood === 'focus') {
      match = products.find((p) => p.id === 1) || products.find((p) => p.id === 3); // Espresso or Flat White
    } else if (finalAnswers.mood === 'relax') {
      match = products.find((p) => p.id === 4) || products.find((p) => p.id === 2); // Latte or Cappuccino
    } else {
      match = products.find((p) => p.popular) || products[0];
    }

    setMatchedProduct(match);
    setCurrentStep(QUESTIONS.length); // Results step
  };

  const handleReset = () => {
    setAnswers({ mood: null, roast: null, temperature: null });
    setCurrentStep(0);
    setMatchedProduct(null);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (matchedProduct) {
      addItem(matchedProduct);
      setAdded(true);
      setTimeout(() => {
        onClose();
        setAdded(false);
      }, 900);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-espresso/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-ivory rounded-3xl p-6 sm:p-8 border border-border shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream text-espresso flex items-center justify-center">
                <Sparkles size={16} className="text-caramel" />
              </div>
              <h2 className="font-display text-xl font-bold text-espresso">Ritual Coffee Matcher</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cream text-warm-gray hover:text-espresso transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quiz Content */}
          <div className="py-6">
            {currentStep < QUESTIONS.length ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-caramel mb-1">
                  {QUESTIONS[currentStep].subtitle}
                </p>
                <h3 className="font-display text-2xl font-bold text-espresso mb-6">
                  {QUESTIONS[currentStep].title}
                </h3>

                <div className="space-y-3">
                  {QUESTIONS[currentStep].options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(QUESTIONS[currentStep].id, opt.id)}
                      className="w-full text-left p-4 rounded-2xl bg-white hover:bg-cream border border-border/70 hover:border-caramel/80 transition-all group shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-semibold text-sm text-espresso group-hover:text-coffee">
                          {opt.label}
                        </span>
                        <ArrowRight size={14} className="text-sand group-hover:text-caramel group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-warm-gray">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep ? 'w-8 bg-caramel' : i < currentStep ? 'w-4 bg-espresso' : 'w-4 bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : matchedProduct ? (
              /* Results Screen */
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream border border-border text-xs font-bold text-caramel uppercase tracking-wider mb-3"
                >
                  <Sparkles size={12} /> Your Perfect Match
                </motion.div>

                <h3 className="font-display text-3xl font-bold text-espresso mb-2">
                  {matchedProduct.name}
                </h3>
                <p className="text-xs text-warm-gray max-w-sm mx-auto mb-5 leading-relaxed">
                  {matchedProduct.description}
                </p>

                {/* Product Card Showcase */}
                <div className="bg-white rounded-2xl p-4 border border-border/70 shadow-sm flex items-center gap-4 text-left mb-6">
                  <img
                    src={matchedProduct.image}
                    alt={matchedProduct.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-caramel block">
                      {matchedProduct.origin || matchedProduct.category}
                    </span>
                    <span className="font-display text-lg font-bold text-espresso block mb-1">
                      {matchedProduct.name}
                    </span>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {matchedProduct.tastingNotes?.slice(0, 2).map((note) => (
                        <span key={note} className="text-[10px] bg-cream px-2 py-0.5 rounded-full text-warm-gray">
                          {note}
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-sm text-espresso">{formatPrice(matchedProduct.price)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                      added ? 'bg-green-700 text-white' : 'bg-espresso text-ivory hover:bg-coffee'
                    }`}
                  >
                    {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                    {added ? 'Added to Order!' : `Add to Order (${formatPrice(matchedProduct.price)})`}
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-5 py-3 rounded-full border border-border bg-white text-warm-gray hover:text-espresso text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={14} /> Retake
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
