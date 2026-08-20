import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, tax, total, itemCount, isDrawerOpen, setIsDrawerOpen, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-overlay"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[90] w-full max-w-md bg-ivory border-l border-border flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-espresso" />
                <h2 className="font-display text-xl font-semibold text-espresso">Your Order</h2>
                {itemCount > 0 && (
                  <span className="text-xs font-medium text-warm-gray bg-cream px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-cream text-warm-gray transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={40} className="text-sand mb-4" strokeWidth={1.2} />
                  <p className="font-display text-lg text-espresso mb-1">Your order is empty</p>
                  <p className="text-sm text-warm-gray">Find something worth staying for.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex gap-3.5 bg-white rounded-xl p-3 border border-border/40"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-espresso">{item.name}</p>
                              <p className="text-xs text-warm-gray">{item.size}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.key)}
                              className="p-1 text-warm-gray/60 hover:text-espresso transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 border border-border/60 rounded-full">
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="p-1.5 text-warm-gray hover:text-espresso transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-medium text-espresso w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="p-1.5 text-warm-gray hover:text-espresso transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-espresso">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Totals */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm text-warm-gray">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-warm-gray">
                  <span>Tax (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-espresso pt-2 border-t border-border/60">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3.5 bg-espresso text-ivory text-sm font-medium rounded-full hover:bg-coffee transition-colors duration-200 mt-2"
                >
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs text-warm-gray hover:text-espresso transition-colors"
                >
                  Clear order
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}

      {/* Checkout modal */}
      {showCheckout && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-overlay"
            onClick={() => setShowCheckout(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed z-[110] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ivory rounded-2xl p-8 max-w-sm w-[90%] border border-border shadow-xl text-center"
          >
            <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={24} className="text-espresso" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-espresso mb-2">Almost there</h3>
            <p className="text-sm text-warm-gray mb-6 leading-relaxed">
              This is a demo checkout. In a real café, you&apos;d complete your order here.<br />
              Your total: <strong className="text-espresso">{formatPrice(total)}</strong>
            </p>
            <button
              onClick={() => {
                setShowCheckout(false);
                setIsDrawerOpen(false);
                clearCart();
              }}
              className="w-full py-3 bg-espresso text-ivory text-sm font-medium rounded-full hover:bg-coffee transition-colors"
            >
              Place Order (Demo)
            </button>
            <button
              onClick={() => setShowCheckout(false)}
              className="mt-3 text-sm text-warm-gray hover:text-espresso transition-colors"
            >
              Go back
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
