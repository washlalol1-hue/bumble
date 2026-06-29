import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Terminal, CheckCircle, XCircle, User, Image } from 'lucide-react';
import { CreatedAccount, TerminalLog, GmailAccount, ProfileImage } from '../types';
import { simulateAccountCreation, createLog } from '../utils/mockAutomation';
import { generateRandomName, generateRandomAge } from '../utils/nameGenerator';

interface AccountCreationProps {
  gmailAccounts: GmailAccount[];
  proxy: string;
  smsApiKey: string;
  names: string[];
  bios: string[];
  ageMin: number;
  ageMax: number;
  images: ProfileImage[];
  nameMode: 'auto' | 'manual';
}

export function AccountCreation({
  gmailAccounts,
  proxy,
  smsApiKey,
  names,
  bios,
  ageMin,
  ageMax,
  images,
  nameMode,
}: AccountCreationProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [createdAccounts, setCreatedAccounts] = useState<CreatedAccount[]>([]);
  const [progress, setProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (log: TerminalLog) => {
    setLogs(prev => [...prev, log]);
  };

  const handleStart = async () => {
    if (gmailAccounts.length === 0) return;

    setIsRunning(true);
    stopRef.current = false;
    setLogs([]);
    setCreatedAccounts([]);
    setProgress(0);

    addLog(createLog('system', '───────────────────────────────────────────────'));
    addLog(createLog('info', `[QUEUE] ${gmailAccounts.length} account(s) in queue`));
    addLog(createLog('info', `[CONFIG] Proxy: ${proxy ? '✓ Set' : '✗ None'}`));
    addLog(createLog('info', `[CONFIG] SMS API: ${smsApiKey ? '✓ Connected' : '✗ None'}`));
    addLog(createLog('info', `[CONFIG] Images: ${images.length} loaded`));
    addLog(createLog('system', '───────────────────────────────────────────────'));

    await new Promise(r => setTimeout(r, 800));

    for (let i = 0; i < gmailAccounts.length; i++) {
      if (stopRef.current) {
        addLog(createLog('warning', '[ABORT] Process stopped by user'));
        break;
      }

      const account = gmailAccounts[i];
      const name = nameMode === 'manual' && names[i] ? names[i] : generateRandomName();
      const age = generateRandomAge(ageMin, ageMax);
      const accountImages = images.map(img => img.preview);

      addLog(createLog('system', `\n▶ Account ${i + 1}/${gmailAccounts.length}: ${account.email}`));

      const result = await simulateAccountCreation(
        account.email,
        name,
        age,
        accountImages,
        addLog
      );

      setCreatedAccounts(prev => [...prev, result]);
      setProgress(Math.round(((i + 1) / gmailAccounts.length) * 100));

      if (i < gmailAccounts.length - 1) {
        addLog(createLog('info', `[WAIT] Cooling down before next account...`));
        await new Promise(r => setTimeout(r, 2500 + Math.random() * 2000));
      }
    }

    addLog(createLog('system', '───────────────────────────────────────────────'));
    addLog(createLog('success', `[COMPLETE] All accounts processed!`));
    setIsRunning(false);
  };

  const handleStop = () => {
    stopRef.current = true;
    setIsRunning(false);
  };

  const getLogColor = (level: TerminalLog['level']) => {
    switch (level) {
      case 'system': return 'text-purple-400';
      case 'info': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-dark-300';
    }
  };

  return (
    <div id="create-accounts" className="space-y-4">
      {/* Create Button */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Play className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100">Create Accounts</h3>
              <p className="text-sm text-dark-400">
                {gmailAccounts.length} account(s) ready to create
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={gmailAccounts.length === 0}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Create {gmailAccounts.length} Account{gmailAccounts.length !== 1 ? 's' : ''}
              </button>
            ) : (
              <button onClick={handleStop} className="btn-danger flex items-center gap-2">
                <Square className="w-4 h-4" />
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {(isRunning || progress > 0) && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-dark-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Terminal */}
        <div className="bg-dark-950 rounded-lg border border-dark-700 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 border-b border-dark-700">
            <Terminal className="w-4 h-4 text-dark-400" />
            <span className="text-xs text-dark-400 font-mono">account-creation-engine</span>
            {isRunning && (
              <motion.div
                className="ml-auto w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <div
            ref={terminalRef}
            className="p-4 h-72 overflow-y-auto font-mono text-xs leading-relaxed terminal-scroll"
          >
            {logs.length === 0 ? (
              <div className="text-dark-500 flex items-center gap-2">
                <span className="animate-pulse">▌</span>
                <span>Waiting for command...</span>
              </div>
            ) : (
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`${getLogColor(log.level)} whitespace-pre-wrap`}
                  >
                    {log.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {isRunning && (
              <motion.span
                className="text-green-400"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ▌
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Created Accounts Display */}
      {createdAccounts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Created Accounts ({createdAccounts.filter(a => a.status === 'success').length}/{createdAccounts.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {createdAccounts.map((account, idx) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    account.status === 'success'
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        account.status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {account.status === 'success' ? (
                          <User className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-dark-100">{account.name}</span>
                          <span className="text-dark-400 text-sm">• {account.age} years</span>
                        </div>
                        <span className="text-xs text-dark-400">{account.email}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {account.status === 'success' ? (
                        <>
                          <div className="text-xs text-dark-400 font-mono">
                            ID: {account.accountId}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Image className="w-3 h-3 text-dark-500" />
                            <span className="text-xs text-dark-500">{account.images.length} pics</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-red-400">Failed</span>
                      )}
                    </div>
                  </div>
                  {account.status === 'success' && account.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {account.images.slice(0, 4).map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="w-10 h-10 rounded-md overflow-hidden border border-dark-600"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {account.images.length > 4 && (
                        <div className="w-10 h-10 rounded-md bg-dark-700 flex items-center justify-center text-xs text-dark-400">
                          +{account.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
