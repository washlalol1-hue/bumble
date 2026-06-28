import { useState } from 'react';
import { Type, Shuffle, Edit3 } from 'lucide-react';
import { generateMultipleNames } from '../utils/nameGenerator';

interface NameSelectorProps {
  mode: 'auto' | 'manual';
  manualNames: string;
  accountCount: number;
  onModeChange: (mode: 'auto' | 'manual') => void;
  onManualNamesChange: (names: string) => void;
}

export function NameSelector({ mode, manualNames, accountCount, onModeChange, onManualNamesChange }: NameSelectorProps) {
  const [previewNames, setPreviewNames] = useState<string[]>([]);

  const generatePreview = () => {
    const count = Math.max(accountCount, 3);
    setPreviewNames(generateMultipleNames(count));
  };

  return (
    <div id="names" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-pink-500/10 rounded-lg">
          <Type className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Profile Names</h3>
          <p className="text-sm text-dark-400">Auto-generate or set custom names</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange('auto')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'auto'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-500'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            Auto Generate
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'manual'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-500'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Manual Names
          </button>
        </div>

        {mode === 'manual' ? (
          <textarea
            value={manualNames}
            onChange={(e) => onManualNamesChange(e.target.value)}
            placeholder={`Enter one name per line (match with gmail order):\nEmma\nSophia\nOlivia`}
            className="input-field h-28 font-mono text-sm resize-none"
          />
        ) : (
          <div className="space-y-2">
            <button onClick={generatePreview} className="btn-secondary text-sm flex items-center gap-2">
              <Shuffle className="w-3.5 h-3.5" />
              Preview Names
            </button>
            {previewNames.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-dark-800 border border-dark-600 rounded-md text-sm text-dark-200"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
