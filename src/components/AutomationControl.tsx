import { useEffect, useRef } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { AutomationLog } from '../types';

interface AutomationControlProps {
  isRunning: boolean;
  progress: number;
  currentAccount: number;
  totalAccounts: number;
  logs: AutomationLog[];
  proxyCount: number;
  accountCount: number;
  imageCount: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function AutomationControl({
  isRunning,
  progress,
  currentAccount,
  totalAccounts,
  logs,
  proxyCount,
  accountCount,
  imageCount,
  onStart,
  onStop,
  onReset,
}: AutomationControlProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const successCount = logs.filter(l => l.level === 'success').length;
  const errorCount = logs.filter(l => l.level === 'error').length;

  const getLogColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-dark-300';
    }
  };

  return (
    <motion.section
      id="automation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dark-100">Automation Control</h2>
        {progress > 0 && !isRunning && (
          <button onClick={onReset} className="btn-secondary text-sm flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-dark-800 rounded-lg text-center">
          <p className="text-xs text-dark-400">Accounts</p>
          <p className="text-lg font-bold text-dark-100">{accountCount}</p>
        </div>
        <div className="p-3 bg-dark-800 rounded-lg text-center">
          <p className="text-xs text-dark-400">Proxies</p>
          <p className="text-lg font-bold text-dark-100">{proxyCount}</p>
        </div>
        <div className="p-3 bg-dark-800 rounded-lg text-center">
          <p className="text-xs text-dark-400">Images</p>
          <p className="text-lg font-bold text-dark-100">{imageCount}</p>
        </div>
        <div className="p-3 bg-dark-800 rounded-lg text-center">
          <p className="text-xs text-dark-400">Success Rate</p>
          <p className="text-lg font-bold text-dark-100">
            {totalAccounts > 0 ? Math.round((successCount / Math.max(currentAccount, 1)) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-dark-400 mb-1.5">
          <span>Progress</span>
          <span>{currentAccount}/{totalAccounts} ({progress}%)</span>
        </div>
        <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Start/Stop button */}
      <div className="flex gap-3 mb-4">
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={accountCount === 0}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" /> Start Automation
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Square className="w-5 h-5" /> Stop
          </button>
        )}
      </div>

      {/* Log output */}
      <div className="rounded-lg border border-dark-700 overflow-hidden">
        <div className="px-3 py-2 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
          <span className="text-xs text-dark-400 font-medium">Logs</span>
          <div className="flex gap-2 text-xs">
            <span className="text-green-400">{successCount} ok</span>
            <span className="text-red-400">{errorCount} err</span>
          </div>
        </div>
        <div
          ref={logRef}
          className="h-48 overflow-y-auto bg-dark-950 p-3 font-mono text-xs space-y-0.5"
        >
          {logs.length === 0 ? (
            <p className="text-dark-600">Waiting for automation to start...</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="text-dark-600 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={getLogColor(log.level)}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
