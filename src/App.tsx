import { motion, AnimatePresence } from 'motion/react';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Dashboard />
      </motion.div>
    </AnimatePresence>
  );
}
