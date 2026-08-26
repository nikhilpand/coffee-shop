import { motion } from 'framer-motion';

/**
 * PageTransition – wraps every route so pages glide in/out smoothly.
 * Used inside <AnimatePresence mode="wait"> in App.jsx.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
      transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
