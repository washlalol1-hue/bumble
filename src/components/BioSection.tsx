import { useState } from 'react';
import { FileText, Plus, Trash2, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Bio } from '../types';
import { rewriteBio } from '../utils/bioRewriter';

interface BioSectionProps {
  bios: Bio[];
  onBiosChange: (bios: Bio[]) => void;
}

export function BioSection({ bios, onBiosChange }: BioSectionProps) {
  const [newBio, setNewBio] = useState('');

  const handleAdd = () => {
    if (!newBio.trim()) {
      toast.error('Please enter a bio');
      return;
    }
    const bio: Bio = {
      id: crypto.randomUUID(),
      text: newBio.trim(),
    };
    onBiosChange([...bios, bio]);
    setNewBio('');
    toast.success('Bio added');
  };

  const handleDelete = (id: string) => {
    onBiosChange(bios.filter(b => b.id !== id));
  };

  const handleRewrite = async (id: string) => {
    onBiosChange(bios.map(b => b.id === id ? { ...b, isRewriting: true } : b));
    await new Promise(resolve => setTimeout(resolve, 800));
    onBiosChange(bios.map(b => {
      if (b.id === id) {
        return { ...b, text: rewriteBio(b.text), isRewriting: false };
      }
      return b;
    }));
    toast.success('Bio rewritten');
  };

  const handleRewriteAll = async () => {
    if (bios.length === 0) {
      toast.error('No bios to rewrite');
      return;
    }
    onBiosChange(bios.map(b => ({ ...b, isRewriting: true })));
    await new Promise(resolve => setTimeout(resolve, 1200));
    onBiosChange(bios.map(b => ({
      ...b,
      text: rewriteBio(b.text),
      isRewriting: false,
    })));
    toast.success(`Rewrote ${bios.length} bio(s)`);
  };

  return (
    <motion.section
      id="bios"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-100">Profile Bios</h2>
          {bios.length > 0 && (
            <span className="badge bg-amber-500/20 text-amber-300">{bios.length}</span>
          )}
        </div>
        {bios.length > 0 && (
          <button onClick={handleRewriteAll} className="btn-secondary text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Rewrite All
          </button>
        )}
      </div>

      {/* Add bio */}
      <div className="mb-4">
        <textarea
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          placeholder="Write a bio for your profile... (e.g., 'Love hiking, coffee, and good conversations. Looking for someone who enjoys adventure.')"
          className="input-field h-24 resize-y text-sm"
        />
        <button onClick={handleAdd} className="btn-primary text-sm flex items-center gap-1.5 mt-2">
          <Plus className="w-4 h-4" /> Add Bio
        </button>
      </div>

      {/* Bio list */}
      {bios.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {bios.map((bio) => (
              <motion.div
                key={bio.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-dark-800 rounded-lg border border-dark-700"
              >
                <p className="text-sm text-dark-200 mb-3 leading-relaxed">
                  {bio.isRewriting ? (
                    <span className="flex items-center gap-2 text-accent-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Rewriting...
                    </span>
                  ) : (
                    bio.text
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRewrite(bio.id)}
                    disabled={bio.isRewriting}
                    className="btn-secondary text-xs flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Rewrite
                  </button>
                  <button
                    onClick={() => handleDelete(bio.id)}
                    className="text-xs px-3 py-1.5 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}
