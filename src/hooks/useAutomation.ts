import { useState, useCallback, useRef } from 'react';
import { Account, AutomationLog, TokenResult, LogLevel } from '../types';
import { simulateAccountCreation, createLogEntry } from '../utils/mockAutomation';

export function useAutomation() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(0);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [results, setResults] = useState<TokenResult[]>([]);
  const stopRef = useRef(false);

  const addLog = useCallback((level: LogLevel, message: string) => {
    const log = createLogEntry(level, message);
    setLogs(prev => [...prev, log]);
  }, []);

  const start = useCallback(async (accounts: Account[]) => {
    if (accounts.length === 0) return;

    setIsRunning(true);
    stopRef.current = false;
    setProgress(0);
    setCurrentAccount(0);
    setLogs([]);
    setResults([]);

    addLog('info', `Starting automation for ${accounts.length} account(s)...`);

    for (let i = 0; i < accounts.length; i++) {
      if (stopRef.current) {
        addLog('warning', 'Automation stopped by user');
        break;
      }

      setCurrentAccount(i + 1);
      addLog('info', `--- Processing account ${i + 1}/${accounts.length} ---`);

      const result = await simulateAccountCreation(
        accounts[i].email,
        (log) => setLogs(prev => [...prev, log])
      );

      setResults(prev => [...prev, result]);
      setProgress(Math.round(((i + 1) / accounts.length) * 100));
    }

    if (!stopRef.current) {
      addLog('success', 'All accounts processed!');
    }

    setIsRunning(false);
  }, [addLog]);

  const stop = useCallback(() => {
    stopRef.current = true;
    addLog('warning', 'Stopping automation...');
  }, [addLog]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setProgress(0);
    setCurrentAccount(0);
    setLogs([]);
    setResults([]);
    stopRef.current = false;
  }, []);

  return {
    isRunning,
    progress,
    currentAccount,
    logs,
    results,
    start,
    stop,
    reset,
  };
}
