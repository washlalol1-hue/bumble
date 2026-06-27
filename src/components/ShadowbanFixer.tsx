import { useState } from 'react';
import { Wrench, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Platform } from './Header';

interface ShadowbanFixerProps {
  platform: Platform;
}

type FixStatus = 'idle' | 'fixing' | 'success' | 'partial';

interface FixStep {
  label: string;
  status: 'pending' | 'running' | 'done' | 'warning';
}

export function ShadowbanFixer({ platform }: ShadowbanFixerProps) {
  const [status, setStatus] = useState<FixStatus>('idle');
  const [steps, setSteps] = useState<FixStep[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'soft' | 'hard'>('soft');

  const fixStepsSoft: string[] = [
    'Clearing device fingerprint...',
    'Rotating IP address via proxy...',
    'Resetting advertising ID...',
    'Rebuilding profile metadata...',
    'Re-verifying phone number...',
    'Requesting algorithm reset...',
  ];

  const fixStepsHard: string[] = [
    'Wiping all account traces...',
    'Generating new device signature...',
    'Assigning fresh IP pool...',
    'Creating new verification chain...',
    'Rebuilding ELO score from scratch...',
    'Injecting fresh profile into queue...',
    'Verifying unban status...',
  ];

  const handleFix = async () => {
    const currentSteps = selectedMethod === 'soft' ? fixStepsSoft : fixStepsHard;
    setStatus('fixing');
    setSteps(currentSteps.map(label => ({ label, status: 'pending' })));

    for (let i = 0; i < currentSteps.length; i++) {
      setSteps(prev =>
        prev.map((step, idx) => ({
          ...step,
          status: idx === i ? 'running' : idx < i ? 'done' : 'pending',
        }))
      );
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
    }

    setSteps(prev => prev.map(step => ({ ...step, status: 'done' })));
    setStatus(Math.random() > 0.3 ? 'success' : 'partial');
  };

  return (
    <motion.section
      id="shadowban-fixer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-semibold text-dark-100">Shadowban Fixer</h2>
        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-bold">
          BETA
        </span>
      </div>

      <p className="text-sm text-dark-400 mb-4">
        Attempt to remove shadowban restrictions on your {platform.charAt(0).toUpperCase() + platform.slice(1)} account.
      </p>

      {/* Method selector */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setSelectedMethod('soft')}
          className={`flex-1 p-3 rounded-lg border transition-all ${
            selectedMethod === 'soft'
              ? 'border-accent-500/50 bg-accent-500/10 text-accent-300'
              : 'border-dark-700 bg-dark-800 text-dark-400 hover:border-dark-600'
          }`}
        >
          <p className="font-medium text-sm">Soft Reset</p>
          <p className="text-xs mt-1 opacity-70">Keeps profile, resets visibility</p>
        </button>
        <button
          onClick={() => setSelectedMethod('hard')}
          className={`flex-1 p-3 rounded-lg border transition-all ${
            selectedMethod === 'hard'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-dark-700 bg-dark-800 text-dark-400 hover:border-dark-600'
          }`}
        >
          <p className="font-medium text-sm">Hard Reset</p>
          <p className="text-xs mt-1 opacity-70">Nukes everything, fresh start</p>
        </button>
      </div>

      {status === 'idle' && (
        <button onClick={handleFix} className="btn-primary w-full flex items-center justify-center gap-2">
          <Wrench className="w-4 h-4" />
          Start {selectedMethod === 'soft' ? 'Soft' : 'Hard'} Fix
        </button>
      )}

      {steps.length > 0 && (
        <div className="mt-4 space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              {step.status === 'pending' && <div className="w-4 h-4 rounded-full border border-dark-600" />}
              {step.status === 'running' && <Loader2 className="w-4 h-4 text-accent-400 animate-spin" />}
              {step.status === 'done' && <CheckCircle className="w-4 h-4 text-green-400" />}
              {step.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
              <span className={step.status === 'pending' ? 'text-dark-500' : 'text-dark-200'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400"
        >
          Shadowban successfully removed! Your profile should regain full visibility within 1-2 hours.
        </motion.div>
      )}

      {status === 'partial' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400"
        >
          Partial fix applied. Some restrictions may persist. Try running again in 24 hours or use Hard Reset.
        </motion.div>
      )}
    </motion.section>
  );
}
