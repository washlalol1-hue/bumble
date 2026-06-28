import { useState } from 'react';
import { Wrench, Play, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GmailAccount, TerminalLog } from '../types';
import { simulateShadowbanFix, createLog } from '../utils/mockAutomation';

interface ShadowbanRemoverProps {
  accounts: GmailAccount[];
}

export function ShadowbanRemover({ accounts }: ShadowbanRemoverProps) {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<{ email: string; fixed: boolean }[]>([]);
  const [logs, setLogs] = useState<TerminalLog[]>([]);

  const handleFix = async () => {
    if (accounts.length === 0) return;
    setIsFixing(true);
    setFixResults([]);
    setLogs([]);

    for (const account of accounts) {
      const fixed = await simulateShadowbanFix(account.email, (log) => {
        setLogs(prev => [...prev, log]);
      });

      setFixResults(prev => [...prev, { email: account.email, fixed }]);
    }

    setIsFixing(false);
  };

  return (
    <div id="shadowban-remover" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-teal-500/10 rounded-lg">
          <Wrench className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Shadowban Remover</h3>
          <p className="text-sm text-dark-400">Attempt to remove shadowban from accounts</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleFix}
          disabled={isFixing || accounts.length === 0}
          className="btn-primary flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isFixing ? 'Fixing...' : `Fix ${accounts.length} Account${accounts.length !== 1 ? 's' : ''}`}
        </button>

        {accounts.length === 0 && (
          <p className="text-sm text-dark-500">Add Gmail accounts first to fix</p>
        )}

        {/* Terminal Log */}
        {logs.length > 0 && (
          <div className="bg-dark-950 rounded-lg border border-dark-700 p-3 h-40 overflow-y-auto font-mono text-xs terminal-scroll">
            {logs.map((log) => (
              <div
                key={log.id}
                className={
                  log.level === 'success' ? 'text-green-400' :
                  log.level === 'error' ? 'text-red-400' :
                  log.level === 'system' ? 'text-purple-400' :
                  'text-blue-400'
                }
              >
                {log.message}
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {fixResults.length > 0 && (
            <div className="space-y-2">
              {fixResults.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                    result.fixed
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.fixed ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm text-dark-200 font-mono">{result.email}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    result.fixed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.fixed ? 'FIXED' : 'FAILED'}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
