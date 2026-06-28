import { useState } from 'react';
import { FileText, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { Bio } from '../types';
import { rewriteBio } from '../utils/bioRewriter';

interface BioSectionProps {
  bios: Bio[];
  onBiosChange: (bios: Bio[]) => void;
}

export function BioSection({ bios, onBiosChange }: BioSectionProps) {
  const [newBio, setNewBio] = useState('');

  const addBio = () => {
    if (!newBio.trim()) return;
    const bio: Bio = {
      id: `bio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: newBio.trim(),
    };
    onBiosChange([...bios, bio]);
    setNewBio('');
  };

  const removeBio = (id: string) => {
    onBiosChange(bios.filter(b => b.id !== id));
  };

  const rewriteAll = () => {
    const rewritten = bios.map(b => ({
      ...b,
      text: rewriteBio(b.text),
    }));
    onBiosChange(rewritten);
  };

  return (
    <div id="bios" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <FileText className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Bio Templates</h3>
          <p className="text-sm text-dark-400">Add bios — they'll be randomly assigned & spun</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <textarea
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Write a bio template..."
            className="input-field h-20 text-sm resize-none flex-1"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={addBio} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            Add Bio
          </button>
          {bios.length > 0 && (
            <button onClick={rewriteAll} className="btn-secondary text-sm flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Spin All
            </button>
          )}
        </div>

        {bios.length > 0 && (
          <div className="space-y-2 mt-3">
            {bios.map((bio, idx) => (
              <div
                key={bio.id}
                className="flex items-start gap-3 p-3 bg-dark-800 rounded-lg border border-dark-700 group"
              >
                <span className="text-xs text-dark-500 mt-1">#{idx + 1}</span>
                <p className="text-sm text-dark-200 flex-1">{bio.text}</p>
                <button
                  onClick={() => removeBio(bio.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-dark-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
