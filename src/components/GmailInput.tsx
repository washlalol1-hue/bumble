import { useState } from 'react';
import { Mail, Plus, Trash2, AlertCircle } from 'lucide-react';
import { GmailAccount } from '../types';

interface GmailInputProps {
  accounts: GmailAccount[];
  onAccountsChange: (accounts: GmailAccount[]) => void;
}

export function GmailInput({ accounts, onAccountsChange }: GmailInputProps) {
  const [bulkInput, setBulkInput] = useState('');

  const handleBulkPaste = () => {
    if (!bulkInput.trim()) return;

    const lines = bulkInput.trim().split('\n').filter(l => l.trim());
    const newAccounts: GmailAccount[] = [];

    for (const line of lines) {
      // Support formats: email:password or email|password or email password
      const parts = line.trim().split(/[:||\s]+/);
      if (parts.length >= 2) {
        const email = parts[0].trim();
        const password = parts.slice(1).join('');
        if (email && password) {
          newAccounts.push({
            id: `gmail-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email,
            password,
          });
        }
      }
    }

    if (newAccounts.length > 0) {
      onAccountsChange([...accounts, ...newAccounts]);
      setBulkInput('');
    }
  };

  const removeAccount = (id: string) => {
    onAccountsChange(accounts.filter(a => a.id !== id));
  };

  const clearAll = () => {
    onAccountsChange([]);
  };

  return (
    <div id="gmail" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <Mail className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Gmail & Password</h3>
          <p className="text-sm text-dark-400">
            Paste email:password (one per line) — each line = one account to create
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder={`email1@gmail.com:password123\nemail2@gmail.com:mypass456\nemail3@gmail.com:securepass`}
          className="input-field h-32 font-mono text-sm resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-dark-400">
            <AlertCircle className="w-4 h-4" />
            <span>Format: email:password or email|password</span>
          </div>
          <button onClick={handleBulkPaste} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Accounts
          </button>
        </div>

        {accounts.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dark-200">
                {accounts.length} account{accounts.length !== 1 ? 's' : ''} loaded
              </span>
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 terminal-scroll">
              {accounts.map((account, idx) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between px-3 py-2 bg-dark-800 rounded-lg border border-dark-700 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-dark-500 w-6">#{idx + 1}</span>
                    <span className="text-sm text-dark-200 font-mono">{account.email}</span>
                    <span className="text-xs text-dark-500">•••••</span>
                  </div>
                  <button
                    onClick={() => removeAccount(account.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-dark-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
