import { motion } from 'framer-motion';
import { UtensilsCrossed, ChevronRight } from 'lucide-react';
import { useTable } from '../context/TableContext';

export default function TableBanner() {
  const { tableNumber, openTableModal } = useTable();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream/90 border-b border-border/60 py-2.5 px-5 md:px-8 text-xs text-espresso flex items-center justify-between"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-espresso text-ivory text-[10px] font-semibold">
            {tableNumber}
          </span>
          <span className="text-warm-gray hidden sm:inline">Dine-in Order:</span>
          <span className="font-semibold text-espresso">Seated at Table {tableNumber}</span>
          <span className="text-warm-gray/60 hidden md:inline">· Orders served directly to your table</span>
        </div>
        <button
          onClick={openTableModal}
          className="flex items-center gap-1 font-medium text-caramel hover:text-espresso transition-colors"
        >
          Change Table <ChevronRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}
