import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Printer, Download, ExternalLink, UtensilsCrossed } from 'lucide-react';

export default function TableQrGeneratorModal({ isOpen, onClose }) {
  const [selectedTable, setSelectedTable] = useState(1);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://coffee-shop-np.vercel.app';
  const tableLink = `${siteUrl}/?table=${selectedTable}`;
  // Generate QR Code image using quick QR server API
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableLink)}&bgcolor=FAF7F2&color=2C1810&margin=10`;

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-ivory rounded-3xl p-6 md:p-8 border border-border shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream text-espresso flex items-center justify-center">
                <QrCode size={16} className="text-caramel" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-espresso">Table QR Standee Generator</h3>
                <p className="text-xs text-warm-gray">Print table-top QR codes for customer self-ordering</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cream text-warm-gray hover:text-espresso transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Table Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray mb-2">
              Select Table Number:
            </label>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedTable(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedTable === num
                      ? 'bg-espresso text-ivory border-espresso shadow-xs'
                      : 'bg-white text-charcoal border-border/60 hover:border-caramel/60'
                  }`}
                >
                  T{num}
                </button>
              ))}
            </div>
          </div>

          {/* QR Standee Preview (Print Target) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-border text-center mb-6 shadow-sm">
            <div className="max-w-[240px] mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream border border-border text-[10px] font-bold text-espresso uppercase tracking-wider mb-3">
                <UtensilsCrossed size={12} className="text-caramel" /> Table {selectedTable}
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-border/50 mb-3 shadow-inner">
                <img
                  src={qrImageUrl}
                  alt={`QR Code for Table ${selectedTable}`}
                  className="w-48 h-48 mx-auto rounded-xl"
                />
              </div>

              <p className="font-display text-xl font-bold text-espresso mb-0.5">Slow Pour Café</p>
              <p className="text-[11px] text-warm-gray font-medium">Scan to order & pay right from your table</p>
              <p className="font-mono text-[9px] text-caramel/90 mt-1.5 truncate">{tableLink}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-espresso text-ivory text-xs font-semibold rounded-full hover:bg-coffee transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Printer size={15} /> Print Standee
            </button>
            <a
              href={tableLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 bg-cream border border-border text-espresso hover:bg-sand/30 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} /> Open Link
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
