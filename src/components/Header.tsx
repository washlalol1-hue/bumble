import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  isRunning: boolean;
}

export function Header({ isRunning }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🐝</div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              BumbleMaker
            </h1>
            <p className="text-xs text-dark-400">Automation Panel v1.0</p>
          </div>
        </div>
        <motion.div
          animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          className="flex items-center gap-2"
        >
          <Zap className={`w-4 h-4 ${isRunning ? 'text-green-400' : 'text-dark-400'}`} />
          <span className={`badge ${isRunning ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-dark-300'}`}>
            {isRunning ? 'Running' : 'Ready'}
          </span>
        </motion.div>
      </div>
    </header>
  );
}
