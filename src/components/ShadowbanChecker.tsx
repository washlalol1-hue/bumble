import { useState } from 'react';
import { Shield, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GmailAccount, TerminalLog, ShadowbanResult } from '../types';
import { simulateShadowbanCheck, createLog } from '../utils/mockAutomation';

interface ShadowbanCheckerProps {
  accounts: GmailAccount[];
}

export function ShadowbanChecker({ accounts }: ShadowbanCheckerProps) {
  const [results, setResults] = useState<ShadowbanResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);

  const handleCheck = async () => {
    if (accounts.length === 0) return;
    setIsChecking(true);
    setResults([]);
    setLogs([]);

    for (const account of accounts) {
      const status = await simulateShadowbanCheck(account.email, (log) => {
        setLogs(prev => [...prev, log]);
      });

      setResults(prev => [...prev, {
        accountId: account.id,
        email: account.email,
        status,
        details: status === 'shadowbanned' ? 'Low visibility detected' : 'Normal exposure rate',
      }]);
    }

    setIsChecking(false);
  };

  return (
    <div id="shadowban-checker" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Shield className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Shadowban Checker</h3>
          <p className="text-sm text-dark-400">Check if accounts are shadowbanned</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleCheck}
          disabled={isChecking || accounts.length === 0}
          className="btn-primary flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isChecking ? 'Checking...' : `Check ${accounts.length} Account${accounts.length !== 1 ? 's' : ''}`}
        </button>

        {accounts.length === 0 && (
          <p className="text-sm text-dark-500">Add Gmail accounts first to check</p>
        )}

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <div className="space-y-2 mt-3">
              {results.map((result, idx) => (
                <motion.div
                  key={result.accountId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                    result.status === 'clean'
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.status === 'clean' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm text-dark-200 font-mono">{result.email}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    result.status === 'clean' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.status === 'clean' ? 'CLEAN' : 'SHADOWBANNED'}
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
