import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Platform } from './Header';

interface ShadowbanCheckerProps {
  platform: Platform;
}

type CheckStatus = 'idle' | 'checking' | 'clean' | 'shadowbanned';

export function ShadowbanChecker({ platform }: ShadowbanCheckerProps) {
  const [accountId, setAccountId] = useState('');
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [details, setDetails] = useState<string[]>([]);

  const handleCheck = () => {
    if (!accountId.trim()) return;
    setStatus('checking');
    setDetails([]);

    // Simulate shadowban check
    setTimeout(() => {
      const isBanned = Math.random() > 0.5;
      setStatus(isBanned ? 'shadowbanned' : 'clean');
      if (isBanned) {
        setDetails([
          'Profile visibility reduced by ~80%',
          'Swipe reach limited to low-priority queue',
          'Messages may not be delivered to matches',
          `Detected on ${platform.charAt(0).toUpperCase() + platform.slice(1)} servers`,
        ]);
      } else {
        setDetails([
          'Profile is fully visible',
          'Normal swipe distribution active',
          'No restrictions detected',
        ]);
      }
    }, 2500);
  };

  return (
    <motion.section
      id="shadowban-checker"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent-400" />
        <h2 className="text-lg font-semibold text-dark-100">Shadowban Checker</h2>
      </div>

      <p className="text-sm text-dark-400 mb-4">
        Check if your {platform.charAt(0).toUpperCase() + platform.slice(1)} account has been shadowbanned or restricted.
      </p>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Enter account ID or email..."
          className="input-field flex-1"
        />
        <button
          onClick={handleCheck}
          disabled={status === 'checking' || !accountId.trim()}
          className="btn-primary flex items-center gap-2"
        >
          {status === 'checking' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          Check
        </button>
      </div>

      {status !== 'idle' && status !== 'checking' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            status === 'clean'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {status === 'clean' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-semibold ${status === 'clean' ? 'text-green-400' : 'text-red-400'}`}>
              {status === 'clean' ? 'Account is Clean' : 'Shadowban Detected'}
            </span>
          </div>
          <ul className="space-y-1">
            {details.map((detail, i) => (
              <li key={i} className="text-sm text-dark-300 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-dark-500" />
                {detail}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {status === 'checking' && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
            <p className="text-sm text-dark-400">Analyzing account status...</p>
          </div>
        </div>
      )}
    </motion.section>
  );
}
