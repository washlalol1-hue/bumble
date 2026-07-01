import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  accountCount: number;
  isRunning: boolean;
}

export function Header({ accountCount, isRunning }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">💜</div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              BADOO MAKER
            </h1>
            <p className="text-[10px] text-dark-500 uppercase tracking-wider">Account Creator</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1 border border-dark-700">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-purple-500/30 to-violet-500/30 text-white border border-purple-500/40">
            <span>💜</span>
            <span>Badoo</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {accountCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg">
              <span className="text-xs text-dark-400">Accounts:</span>
              <span className="text-sm font-bold text-purple-400">{accountCount}</span>
            </div>
          )}

          <motion.div
            animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
            className="flex items-center gap-2"
          >
            <Zap className={`w-4 h-4 ${isRunning ? 'text-green-400' : 'text-dark-400'}`} />
            <span className={`badge text-xs ${isRunning ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-dark-300'}`}>
              {isRunning ? 'Running' : 'Ready'}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
