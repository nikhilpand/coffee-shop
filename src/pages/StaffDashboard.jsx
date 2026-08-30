import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, CheckCircle2, Clock, Volume2, VolumeX, Lock, UtensilsCrossed, DollarSign, QrCode, Printer, Sparkles, AlertTriangle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { soundEffects } from '../utils/soundEffects';
import { formatPrice } from '../utils/formatPrice';
import TableQrGeneratorModal from '../components/TableQrGeneratorModal';

// ── XSS Escape for print template ──
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ── SHA-256 hash for PIN comparison ──
async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Pre-computed SHA-256 hashes for accepted PINs
const VALID_PIN_HASHES = [
  '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // 1234
  '5765cb64c11b526b0816e2f4f0b94da08ae397cfb3a93f77aab4dfe9b82e7a28', // 0000  — kept as fallback demo PIN
];

const MAX_PIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30000; // 30 seconds

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'preparing' | 'served' | 'all'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('slowpour_staff_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const isLocked = Date.now() < lockedUntil;

  // Subscribe to real-time order stream
  useEffect(() => {
    let initialLoad = true;
    let prevCount = 0;

    const unsubscribe = orderService.subscribe((newOrders) => {
      setOrders(newOrders);

      // Play alert chime when a new order arrives while dashboard is open
      if (!initialLoad && newOrders.length > prevCount && soundEnabled) {
        soundEffects.playOrderBell();
      }

      prevCount = newOrders.length;
      initialLoad = false;
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    const hashed = await sha256(pinInput);
    if (VALID_PIN_HASHES.includes(hashed)) {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      try {
        sessionStorage.setItem('slowpour_staff_auth', 'true');
      } catch {
        // ignore
      }
      setPinError(false);
    } else {
      const newCount = failedAttempts + 1;
      setFailedAttempts(newCount);
      setPinError(true);
      setPinInput('');
      if (newCount >= MAX_PIN_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION);
        setFailedAttempts(0);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('slowpour_staff_auth');
    } catch {
      // ignore
    }
  };

  const updateStatus = (orderId, newStatus, newPaymentStatus = null) => {
    orderService.updateOrderStatus(orderId, newStatus, newPaymentStatus);
  };

  const handlePrintTicket = (order) => {
    const printWindow = window.open('', '_blank', 'width=350,height=500');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket ${order.id}</title>
          <style>
            body { font-family: monospace; padding: 15px; font-size: 12px; line-height: 1.4; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
            .table-badge { font-size: 18px; font-weight: bold; margin: 4px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .notes { font-size: 10px; font-style: italic; margin-left: 8px; }
            .footer { border-top: 1px dashed #000; margin-top: 8px; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>SLOW POUR CAFÉ</h2>
            <div class="table-badge">TABLE ${order.tableNumber}</div>
            <div>Order: ${escapeHtml(order.id)}</div>
            <div>${new Date(order.createdAt).toLocaleTimeString()}</div>
            <div>Guest: ${escapeHtml(order.customerName || 'Dine-in Guest')}</div>
          </div>
          <div>
            ${order.items.map(i => `
              <div class="item">
                <span>${i.quantity}x ${escapeHtml(i.name)} (${escapeHtml(i.size || '')})</span>
                <span>₹${i.price * i.quantity}</span>
              </div>
              ${i.customizations?.milkLabel ? `<div class="notes">🥛 ${escapeHtml(i.customizations.milkLabel)}</div>` : ''}
              ${i.customizations?.extrasLabels?.length ? `<div class="notes">✨ ${i.customizations.extrasLabels.map(escapeHtml).join(', ')}</div>` : ''}
              ${i.customizations?.note ? `<div class="notes">Note: "${escapeHtml(i.customizations.note)}"</div>` : ''}
            `).join('')}
          </div>
          <div class="footer">
            <div class="item"><strong>Total:</strong> <strong>₹${order.total}</strong></div>
            <div>Payment: ${order.paymentStatus} (${order.paymentMethod})</div>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Metrics
  const metrics = useMemo(() => {
    const active = orders.filter((o) => o.status === 'received' || o.status === 'preparing').length;
    const servedToday = orders.filter((o) => o.status === 'served').length;
    const revenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
    return { active, servedToday, revenue };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return orders.filter((o) => o.status === 'received' || o.status === 'preparing');
      case 'preparing':
        return orders.filter((o) => o.status === 'preparing');
      case 'served':
        return orders.filter((o) => o.status === 'served');
      case 'all':
      default:
        return orders;
    }
  }, [orders, activeTab]);

  // PIN Authentication Lock Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-32 pb-20 flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full border border-border shadow-xl text-center"
        >
          <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center text-espresso mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h2 className="font-display text-2xl font-semibold text-espresso mb-1">Barista Counter Portal</h2>
          <p className="text-xs text-warm-gray mb-6">Enter counter PIN to access live kitchen tickets (Default: 1234)</p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 4-digit PIN"
              maxLength={6}
              autoFocus
              disabled={isLocked}
              className="w-full text-center tracking-widest text-xl font-bold py-3 bg-cream/60 border border-border rounded-xl text-espresso focus:outline-none focus:border-caramel disabled:opacity-40"
            />
            {pinError && !isLocked && <p className="text-xs text-red-600">Incorrect PIN. Please try again.</p>}
            {isLocked && (
              <p className="text-xs text-red-600 font-medium">
                Too many attempts. Please wait 30 seconds before trying again.
              </p>
            )}
            <button
              type="submit"
              disabled={isLocked}
              className="w-full py-3.5 bg-espresso text-ivory text-sm font-semibold rounded-full hover:bg-coffee transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLocked ? 'Locked — Please Wait' : 'Unlock Dashboard'}
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#F4EFE6] pt-24 pb-20 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-800">Live Kitchen Display · Real-Time Cloud</p>
            </div>
            <h1 className="font-display text-3xl font-bold text-espresso">Slow Pour Barista Station</h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-border text-espresso hover:bg-cream transition-colors shadow-2xs"
            >
              <QrCode size={15} className="text-caramel" />
              <span>Table QR Generator</span>
            </button>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) soundEffects.playOrderBell();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all shadow-2xs ${
                soundEnabled
                  ? 'bg-espresso text-ivory border-espresso'
                  : 'bg-white text-warm-gray border-border/70'
              }`}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{soundEnabled ? 'Chimes ON' : 'Muted'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-full text-xs font-medium bg-white border border-border text-warm-gray hover:text-espresso"
            >
              Lock Station
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-warm-gray">Active Brewing Queue</p>
              <p className="font-display text-3xl font-bold text-espresso">{metrics.active}</p>
            </div>
            <div className="w-11 h-11 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center">
              <Coffee size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-warm-gray">Orders Served Today</p>
              <p className="font-display text-3xl font-bold text-espresso">{metrics.servedToday}</p>
            </div>
            <div className="w-11 h-11 bg-green-100 text-green-900 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-warm-gray">Paid Register Total</p>
              <p className="font-display text-3xl font-bold text-espresso">{formatPrice(metrics.revenue)}</p>
            </div>
            <div className="w-11 h-11 bg-cream text-espresso rounded-xl flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { key: 'active', label: `Active Queue (${metrics.active})` },
            { key: 'preparing', label: 'In Brewing' },
            { key: 'served', label: 'Served' },
            { key: 'all', label: `All Tickets (${orders.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-espresso text-ivory shadow-xs'
                  : 'bg-white text-warm-gray border border-border/80 hover:text-espresso'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-border/80">
            <Coffee size={40} className="mx-auto text-sand mb-3 opacity-60" />
            <p className="font-display text-2xl font-semibold text-espresso mb-1">Queue is clear</p>
            <p className="text-xs text-warm-gray">New table orders will appear here automatically with audio chimes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredOrders.map((order) => {
                const isNew = order.status === 'received';
                const isPreparing = order.status === 'preparing';
                const isServed = order.status === 'served';

                const timeAgo = Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000);
                const isOverdue = timeAgo > 10 && !isServed;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                      isOverdue
                        ? 'border-red-400 ring-2 ring-red-400/20'
                        : isNew
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : isPreparing
                        ? 'border-caramel/80'
                        : 'border-border/60 opacity-85'
                    }`}
                  >
                    <div>
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-border/50 mb-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-espresso text-ivory font-display font-bold flex items-center justify-center text-sm">
                            T{order.tableNumber}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-espresso block">Table {order.tableNumber}</span>
                            <span className="text-[11px] text-warm-gray">{order.customerName || 'Dine-in Guest'}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-warm-gray block">{order.id}</span>
                          <span className={`text-[10px] flex items-center gap-1 justify-end font-semibold ${
                            isOverdue ? 'text-red-600' : 'text-warm-gray'
                          }`}>
                            <Clock size={10} />
                            {timeAgo <= 0 ? 'Just now' : `${timeAgo}m ago`}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2.5 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-cream/40 rounded-xl p-2.5 border border-border/30">
                            <div className="flex justify-between font-semibold text-xs text-espresso">
                              <span>
                                {item.quantity}× {item.name}
                              </span>
                              <span className="text-warm-gray">{item.size}</span>
                            </div>

                            {item.customizations && (
                              <div className="mt-1 space-y-0.5 text-[11px]">
                                {item.customizations.milkLabel && (
                                  <p className="text-caramel font-semibold">🥛 {item.customizations.milkLabel}</p>
                                )}
                                {item.customizations.extrasLabels?.length > 0 && (
                                  <p className="text-coffee font-medium">✨ {item.customizations.extrasLabels.join(', ')}</p>
                                )}
                                {item.customizations.note && (
                                  <p className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded text-[11px] font-bold mt-1">
                                    Note: &ldquo;{item.customizations.note}&rdquo;
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ticket Footer & Actions */}
                    <div className="pt-3 border-t border-border/60">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-espresso">{formatPrice(order.total)}</span>
                          <button
                            onClick={() => handlePrintTicket(order)}
                            className="p-1 text-warm-gray hover:text-espresso rounded hover:bg-cream"
                            title="Print counter ticket"
                          >
                            <Printer size={13} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {order.paymentStatus} ({order.paymentMethod})
                          </span>
                          {order.paymentStatus === 'Pending' && (
                            <button
                              onClick={() => updateStatus(order.id, order.status, 'Paid')}
                              className="text-[10px] underline font-bold text-caramel hover:text-espresso"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Barista Status Workflow Buttons */}
                      <div className="flex gap-2">
                        {isNew && (
                          <button
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="w-full py-2.5 bg-espresso text-ivory text-xs font-semibold rounded-xl hover:bg-coffee transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Coffee size={14} />
                            Start Brewing
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => updateStatus(order.id, 'served')}
                            className="w-full py-2.5 bg-emerald-800 text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 size={14} />
                            Mark as Served to Table {order.tableNumber}
                          </button>
                        )}

                        {isServed && (
                          <div className="w-full py-2 bg-cream text-espresso text-center rounded-xl text-xs font-semibold border border-border/60">
                            ✓ Ticket Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Table QR Generator Modal */}
      <TableQrGeneratorModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </motion.main>
  );
}
