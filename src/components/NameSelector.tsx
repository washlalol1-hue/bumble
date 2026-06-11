import { useState } from 'react';
import { Type, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateMultipleNames } from '../utils/nameGenerator';

interface NameSelectorProps {
  mode: 'auto' | 'manual';
  manualNames: string;
  onModeChange: (mode: 'auto' | 'manual') => void;
  onManualNamesChange: (names: string) => void;
}

export function NameSelector({ mode, manualNames, onModeChange, onManualNamesChange }: NameSelectorProps) {
  const [previewNames, setPreviewNames] = useState(() => generateMultipleNames(3));

  const refreshNames = () => {
    setPreviewNames(generateMultipleNames(3));
  };

  const manualCount = manualNames.trim() ? manualNames.trim().split('\n').filter(l => l.trim()).length : 0;

  return (
    <motion.section
      id="names"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Type className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-100">Name Generator</h2>
          {mode === 'manual' && manualCount > 0 && (
            <span className="badge bg-cyan-500/20 text-cyan-300">{manualCount}</span>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex bg-dark-800 rounded-lg p-1 mb-4">
        <button
          onClick={() => onModeChange('auto')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'auto'
              ? 'bg-accent-600 text-white shadow-md'
              : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          Auto Generate
        </button>
        <button
          onClick={() => onModeChange('manual')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'manual'
              ? 'bg-accent-600 text-white shadow-md'
              : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          Manual List
        </button>
      </div>

      {mode === 'auto' ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-dark-300">Preview of generated names:</p>
            <button onClick={refreshNames} className="btn-secondary text-sm flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          <div className="space-y-2">
            {previewNames.map((name, idx) => (
              <div key={idx} className="p-3 bg-dark-800 rounded-lg border border-dark-700 flex items-center gap-2">
                <span className="text-xs text-dark-500 w-6">#{idx + 1}</span>
                <span className="text-sm text-dark-100">{name.first} {name.last}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-dark-500 mt-3">
            Names will be randomly generated for each account during automation.
          </p>
        </div>
      ) : (
        <div>
          <textarea
            value={manualNames}
            onChange={(e) => onManualNamesChange(e.target.value)}
            placeholder={`Enter names, one per line:\nJane Smith\nEmily Johnson\nSarah Williams`}
            className="input-field h-32 resize-y font-mono text-sm"
          />
          <p className="text-xs text-dark-500 mt-2">
            Format: First Last (one per line). Names will be assigned to accounts in order.
          </p>
        </div>
      )}
    </motion.section>
  );
}
