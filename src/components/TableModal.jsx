import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, UtensilsCrossed } from 'lucide-react';
import { useTable } from '../context/TableContext';

const TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  zone: i < 4 ? 'Window View' : i < 8 ? 'Main Lounge' : 'Courtyard / Patio',
}));

export default function TableModal() {
  const { tableNumber, setTableNumber, isTableModalOpen, closeTableModal } = useTable();

  return (
    <AnimatePresence>
      {isTableModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-overlay backdrop-blur-xs"
            onClick={closeTableModal}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed z-[130] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-ivory rounded-3xl p-6 md:p-8 border border-border shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="Select Table Number"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-espresso">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-espresso">Where are you seated?</h3>
                  <p className="text-xs text-warm-gray">Orders will be freshly served right to your table</p>
                </div>
              </div>
              <button
                onClick={closeTableModal}
                className="p-2 rounded-full hover:bg-cream text-warm-gray hover:text-espresso transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Table Grid */}
            <div className="py-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {TABLES.map((t) => {
                  const isSelected = tableNumber === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTableNumber(t.id);
                        closeTableModal();
                      }}
                      className={`relative p-3.5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-espresso text-ivory border-espresso shadow-md'
                          : 'bg-white border-border/60 hover:border-caramel/60 hover:bg-cream/40 text-charcoal'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-caramel rounded-full flex items-center justify-center text-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <span className="font-display text-lg font-semibold">{t.id}</span>
                      <span className={`text-[10px] tracking-wide uppercase ${isSelected ? 'text-ivory/70' : 'text-warm-gray'}`}>
                        {t.zone}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer info */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-warm-gray">
              <span>Currently seated at: <strong className="text-espresso">Table {tableNumber}</strong></span>
              <button
                onClick={closeTableModal}
                className="px-5 py-2 bg-espresso text-ivory rounded-full text-xs font-medium hover:bg-coffee transition-colors"
              >
                Confirm Table {tableNumber}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
