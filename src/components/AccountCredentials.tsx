import { useState } from 'react';
import { Users, Plus, Trash2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Account, AccountType } from '../types';

interface AccountCredentialsProps {
  accounts: Account[];
  onAccountsChange: (accounts: Account[]) => void;
}

export function AccountCredentials({ accounts, onAccountsChange }: AccountCredentialsProps) {
  const [accountType, setAccountType] = useState<AccountType>('facebook');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdd = () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in both email and password');
      return;
    }
    const newAccount: Account = {
      id: crypto.randomUUID(),
      type: accountType,
      email: email.trim(),
      password: password.trim(),
    };
    onAccountsChange([...accounts, newAccount]);
    setEmail('');
    setPassword('');
    toast.success('Account added');
  };

  const handleDelete = (id: string) => {
    onAccountsChange(accounts.filter(a => a.id !== id));
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          const lines = content.split('\n').filter(l => l.trim());
          const newAccounts: Account[] = lines.map(line => {
            const parts = line.split(/[:|;,\t]/);
            return {
              id: crypto.randomUUID(),
              type: accountType,
              email: parts[0]?.trim() || '',
              password: parts[1]?.trim() || '',
            };
          }).filter(a => a.email && a.password);
          onAccountsChange([...accounts, ...newAccounts]);
          toast.success(`Imported ${newAccounts.length} accounts`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <motion.section
      id="accounts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/20 rounded-lg">
            <Users className="w-5 h-5 text-brand-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-100">Accounts</h2>
          {accounts.length > 0 && (
            <span className="badge bg-brand-500/20 text-brand-300">{accounts.length}</span>
          )}
        </div>
        <button onClick={handleImport} className="btn-secondary text-sm flex items-center gap-1.5">
          <Upload className="w-4 h-4" /> Import
        </button>
      </div>

      {/* Account type toggle */}
      <div className="flex bg-dark-800 rounded-lg p-1 mb-4">
        <button
          onClick={() => setAccountType('facebook')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            accountType === 'facebook' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          Facebook
        </button>
        <button
          onClick={() => setAccountType('gmail')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            accountType === 'gmail' 
              ? 'bg-red-600 text-white shadow-md' 
              : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          Gmail
        </button>
      </div>

      {/* Add account form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={accountType === 'facebook' ? 'Facebook email/username' : 'Gmail address'}
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
      <button onClick={handleAdd} className="btn-primary text-sm flex items-center gap-1.5">
        <Plus className="w-4 h-4" /> Add Account
      </button>

      {/* Account list */}
      {accounts.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          <AnimatePresence>
            {accounts.map((account, idx) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg border border-dark-700"
              >
                <span className="text-xs text-dark-500 w-6">#{idx + 1}</span>
                <span className={`badge ${account.type === 'facebook' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                  {account.type === 'facebook' ? 'FB' : 'GM'}
                </span>
                <span className="text-sm text-dark-200 flex-1 truncate">{account.email}</span>
                <span className="text-sm text-dark-500 font-mono">{'*'.repeat(8)}</span>
                <button onClick={() => handleDelete(account.id)} className="p-1 text-dark-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}
