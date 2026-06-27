import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export type Platform = 'bumble' | 'hinge' | 'tinder';

interface HeaderProps {
  isRunning: boolean;
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

const platforms: { id: Platform; label: string; emoji: string; beta?: boolean }[] = [
  { id: 'bumble', label: 'Bumble', emoji: '🐝' },
  { id: 'hinge', label: 'Hinge', emoji: '💜' },
  { id: 'tinder', label: 'Tinder', emoji: '🔥', beta: true },
];

export function Header({ isRunning, activePlatform, onPlatformChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">⚡</div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              DA PANEL
            </h1>
            <p className="text-xs text-dark-400">Automation Suite v2.0</p>
          </div>
        </div>

        {/* Platform Switcher */}
        <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1 border border-dark-700">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => onPlatformChange(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activePlatform === p.id
                  ? 'bg-gradient-to-r from-brand-500/30 to-accent-500/30 text-white border border-brand-500/40'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700'
              }`}
            >
              <span>{p.emoji}</span>
              <span className="hidden md:inline">{p.label}</span>
              {p.beta && (
                <span className="text-[10px] px-1 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-bold">
                  BETA
                </span>
              )}
            </button>
          ))}
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
