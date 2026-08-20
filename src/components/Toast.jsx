import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast}
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 z-[100] bg-espresso text-ivory px-6 py-3 rounded-full text-sm font-medium shadow-lg"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
