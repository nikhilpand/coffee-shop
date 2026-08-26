import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Coffee, Sparkles, UtensilsCrossed, Clock, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';

const STATUS_STEPS = [
  { key: 'received', title: 'Order Received', desc: 'Barista ticket printed & confirmed' },
  { key: 'preparing', title: 'Brewing & Crafting', desc: 'Your coffee is being slowly brewed' },
  { key: 'served', title: 'Served to Table', desc: 'Delivered fresh to your table' },
];

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(() => orderService.getOrderById(orderId));
  const [isLoading, setIsLoading] = useState(!orderService.getOrderById(orderId));

  useEffect(() => {
    let isMounted = true;

    // 1. If not found in immediate memory, fetch from Firestore cloud
    if (!order) {
      orderService.getOrderDoc(orderId).then((fetched) => {
        if (isMounted) {
          if (fetched) setOrder(fetched);
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }

    // 2. Real-time stream subscription for live status changes
    const unsubscribe = orderService.subscribe((orders) => {
      const found = orders.find((o) => o.id === orderId);
      if (found && isMounted) {
        setOrder(found);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <main className="pt-36 pb-24 text-center max-w-md mx-auto px-5">
        <div className="w-12 h-12 rounded-full bg-cream text-espresso flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Coffee size={24} className="text-caramel" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-espresso mb-2">Connecting to Table Ticket...</h2>
        <p className="text-xs text-warm-gray">Syncing live barista status with Cloud Firestore.</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="pt-32 pb-20 text-center max-w-md mx-auto px-5">
        <AlertCircle size={40} className="mx-auto text-sand mb-4" />
        <h2 className="font-display text-2xl font-semibold text-espresso mb-2">Order not found</h2>
        <p className="text-sm text-warm-gray mb-6">We couldn&apos;t locate an order with ID &quot;{orderId}&quot;.</p>
        <Link
          to="/menu"
          className="inline-flex items-center px-6 py-3 bg-espresso text-ivory rounded-full text-xs font-semibold hover:bg-coffee transition-colors"
        >
          Return to Menu
        </Link>
      </main>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isComplete = order.status === 'served';

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 md:pt-32 pb-24"
    >
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        {/* Header Badge */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream border border-border text-xs font-medium text-espresso mb-4"
          >
            <UtensilsCrossed size={14} className="text-caramel" />
            <span>Dine-in Ticket · <strong>Table {order.tableNumber}</strong></span>
          </motion.div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-espresso mb-2">
            {isComplete ? 'Enjoy your ritual!' : 'Coffee is on its way.'}
          </h1>
          <p className="text-sm text-warm-gray">
            Order Reference: <span className="font-mono font-semibold text-espresso">{order.id}</span>
          </p>
        </div>

        {/* Live Status Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-lg mb-8">
          <div className="flex items-center justify-between pb-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isComplete ? 'bg-green-100 text-green-800' : 'bg-cream text-espresso'
              }`}>
                {isComplete ? <CheckCircle2 size={20} /> : <Coffee size={20} className="animate-pulse" />}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-warm-gray">Current Status</p>
                <p className="font-display text-xl font-semibold text-espresso capitalize">
                  {STATUS_STEPS[currentStepIndex]?.title || order.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-warm-gray justify-end">
                <Clock size={13} />
                <span>Est. Wait Time</span>
              </div>
              <p className="text-sm font-semibold text-espresso">
                {isComplete ? 'Completed' : `~${order.estimatedTime} mins`}
              </p>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="py-8">
            <div className="relative flex items-center justify-between">
              {/* Connector line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-border rounded-full -z-0">
                <div
                  className="h-full bg-caramel transition-all duration-500 rounded-full"
                  style={{
                    width: currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : '100%',
                  }}
                />
              </div>

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10 w-28">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'bg-espresso text-ivory ring-4 ring-caramel/30 scale-110 shadow-md'
                          : isPassed
                          ? 'bg-caramel text-white shadow-xs'
                          : 'bg-white border-2 border-border text-warm-gray'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <p className={`text-xs font-semibold mt-2.5 ${isPassed ? 'text-espresso' : 'text-warm-gray/60'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-warm-gray leading-tight hidden sm:block mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time notice */}
          <div className="bg-cream/60 rounded-2xl p-3.5 border border-border/40 flex items-center gap-2.5 text-xs text-warm-gray">
            <RefreshCw size={14} className="animate-spin text-caramel flex-shrink-0" />
            <span>This page updates live automatically as the barista prepares your ticket.</span>
          </div>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm mb-8">
          <h3 className="font-display text-xl font-semibold text-espresso mb-4">Ticket Breakdown</h3>
          <div className="divide-y divide-border/40">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-espresso">{item.name}</span>
                    <span className="text-xs text-warm-gray">× {item.quantity}</span>
                  </div>
                  <p className="text-xs text-warm-gray mt-0.5">{item.size}</p>
                  {item.customizations && (
                    <div className="text-[11px] text-caramel mt-1 space-y-0.5">
                      {item.customizations.milkLabel && <span>🥛 {item.customizations.milkLabel}</span>}
                      {item.customizations.extrasLabels?.length > 0 && (
                        <span className="block text-warm-gray">✨ {item.customizations.extrasLabels.join(', ')}</span>
                      )}
                      {item.customizations.note && (
                        <span className="block italic text-warm-gray/80">&ldquo;{item.customizations.note}&rdquo;</span>
                      )}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-sm text-espresso">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Financials */}
          <div className="mt-4 pt-4 border-t border-border/60 space-y-2 text-xs">
            <div className="flex justify-between text-warm-gray">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-warm-gray">
              <span>Taxes & GST (5%)</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-espresso pt-2 border-t border-border/40">
              <span>Total Amount</span>
              <span className="text-base">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-xs pt-2">
              <span className="text-warm-gray">Payment Status</span>
              <span className={`font-semibold px-2 py-0.5 rounded-full ${
                order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {order.paymentStatus} ({order.paymentMethod})
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-espresso text-ivory text-sm font-semibold rounded-full hover:bg-coffee transition-colors shadow-sm"
          >
            Order More for Table {order.tableNumber} <ArrowRight size={15} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-border bg-white text-espresso text-sm font-medium rounded-full hover:bg-cream transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </motion.main>
  );
}
