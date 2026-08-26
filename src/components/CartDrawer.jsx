import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, UtensilsCrossed, QrCode, CreditCard, Banknote, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import { formatPrice } from '../utils/formatPrice';
import { orderService } from '../services/orderService';
import { soundEffects } from '../utils/soundEffects';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, tax, total, itemCount, isDrawerOpen, setIsDrawerOpen, clearCart } = useCart();
  const { tableNumber, openTableModal } = useTable();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI Online'); // 'UPI Online' | 'Pay at Counter'
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    try {
      const order = orderService.createOrder({
        tableNumber,
        items,
        subtotal,
        tax,
        total,
        paymentMethod,
        customerName,
      });

      // Play barista / order chime
      soundEffects.playOrderBell();

      setIsProcessing(false);
      setShowCheckout(false);
      setIsDrawerOpen(false);
      clearCart();

      // Navigate to live customer order tracking page immediately
      navigate(`/order/${order.id}`);
    } catch (err) {
      console.error('Order placement error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-overlay backdrop-blur-xs"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[90] w-full max-w-md bg-ivory border-l border-border flex flex-col shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border/80 bg-white/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={18} className="text-espresso" />
                  <h2 className="font-display text-xl font-semibold text-espresso">Your Order</h2>
                  {itemCount > 0 && (
                    <span className="text-xs font-semibold text-ivory bg-espresso px-2.5 py-0.5 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-cream text-warm-gray hover:text-espresso transition-colors"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Table status in cart */}
              <div className="flex items-center justify-between bg-cream/70 rounded-xl px-3.5 py-2 border border-border/60">
                <div className="flex items-center gap-2 text-xs">
                  <UtensilsCrossed size={14} className="text-caramel" />
                  <span className="text-warm-gray">Serving to:</span>
                  <strong className="text-espresso font-semibold">Table {tableNumber}</strong>
                </div>
                <button
                  onClick={openTableModal}
                  className="text-xs font-medium text-caramel hover:text-espresso transition-colors"
                >
                  Change Table
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-sand mb-4">
                    <ShoppingBag size={32} strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-xl text-espresso mb-1">Your order is empty</p>
                  <p className="text-sm text-warm-gray max-w-xs">
                    Choose something handcrafted from the menu to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex gap-3.5 bg-white rounded-2xl p-3.5 border border-border/60 shadow-xs"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-semibold text-espresso">{item.name}</p>
                              <p className="text-xs text-warm-gray">{item.size}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.key)}
                              className="p-1 text-warm-gray/50 hover:text-espresso transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Customizations tags */}
                          {item.customizations && (
                            <div className="mt-1 space-y-0.5">
                              {item.customizations.milkLabel && (
                                <p className="text-[11px] text-caramel font-medium">
                                  🥛 {item.customizations.milkLabel}
                                </p>
                              )}
                              {item.customizations.extrasLabels?.length > 0 && (
                                <p className="text-[11px] text-warm-gray">
                                  ✨ {item.customizations.extrasLabels.join(', ')}
                                </p>
                              )}
                              {item.customizations.note && (
                                <p className="text-[11px] text-warm-gray/80 italic">
                                  &ldquo;{item.customizations.note}&rdquo;
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/30">
                            <div className="flex items-center gap-1 border border-border/60 rounded-full bg-cream/30">
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="p-1.5 text-warm-gray hover:text-espresso transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-semibold text-espresso w-6 text-center">
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

            {/* Footer Totals & Checkout Button */}
            {items.length > 0 && (
              <div className="border-t border-border/80 bg-white/50 px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm text-warm-gray">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-warm-gray">
                  <span>GST & Café Service (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-espresso pt-2 border-t border-border/60">
                  <span>Estimated Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3.5 bg-espresso text-ivory text-sm font-semibold rounded-full hover:bg-coffee transition-colors duration-200 mt-2 flex items-center justify-center gap-2 shadow-md"
                >
                  Proceed to Table Checkout <ArrowRight size={16} />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-1 text-xs text-warm-gray hover:text-espresso transition-colors text-center"
                >
                  Clear order
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}

      {/* Modern Checkout & Payment Modal */}
      {showCheckout && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] bg-overlay backdrop-blur-xs"
            onClick={() => !isProcessing && setShowCheckout(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed z-[150] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ivory rounded-3xl p-6 sm:p-8 max-w-md w-[92%] border border-border shadow-2xl overflow-hidden"
          >
            {isProcessing ? (
              <div className="py-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-3 border-caramel border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="font-display text-2xl font-semibold text-espresso mb-1">
                  Sending Ticket to Barista...
                </h3>
                <p className="text-xs text-warm-gray">Registering order for Table {tableNumber}</p>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/60">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-espresso">Table Checkout</h3>
                    <p className="text-xs text-warm-gray">Dispatching to Table {tableNumber}</p>
                  </div>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="p-1.5 rounded-full hover:bg-cream text-warm-gray"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Name field (optional) */}
                <div className="mb-4">
                  <label htmlFor="customerName" className="block text-xs font-medium uppercase tracking-wider text-warm-gray mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul, Ananya..."
                    className="w-full px-4 py-2.5 bg-white border border-border/60 rounded-xl text-sm text-espresso placeholder-warm-gray/50 focus:outline-none focus:border-caramel/50"
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="mb-6">
                  <span className="block text-xs font-medium uppercase tracking-wider text-warm-gray mb-2">
                    Payment Preference
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI Online')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'UPI Online'
                          ? 'bg-espresso text-ivory border-espresso shadow-sm'
                          : 'bg-white border-border/60 text-charcoal hover:border-caramel/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <QrCode size={16} />
                        <span className="font-semibold text-xs">Pay Online (UPI)</span>
                      </div>
                      <p className={`text-[11px] ${paymentMethod === 'UPI Online' ? 'text-ivory/70' : 'text-warm-gray'}`}>
                        GPay, PhonePe, Paytm, Cards
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Pay at Counter')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'Pay at Counter'
                          ? 'bg-espresso text-ivory border-espresso shadow-sm'
                          : 'bg-white border-border/60 text-charcoal hover:border-caramel/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Banknote size={16} />
                        <span className="font-semibold text-xs">Pay at Counter</span>
                      </div>
                      <p className={`text-[11px] ${paymentMethod === 'Pay at Counter' ? 'text-ivory/70' : 'text-warm-gray'}`}>
                        Cash or Card when leaving
                      </p>
                    </button>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-cream/70 rounded-2xl p-4 mb-6 border border-border/60 space-y-2">
                  <div className="flex justify-between text-xs text-warm-gray">
                    <span>Table Destination</span>
                    <strong className="text-espresso">Table {tableNumber}</strong>
                  </div>
                  <div className="flex justify-between text-xs text-warm-gray">
                    <span>Items Count</span>
                    <span>{itemCount} items</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-espresso pt-2 border-t border-border/40">
                    <span>Total Amount</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-espresso text-ivory text-sm font-semibold rounded-full hover:bg-coffee transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Confirm & Place Order ({formatPrice(total)})
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
