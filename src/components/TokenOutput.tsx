import { Trophy, Copy, Download, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TokenResult } from '../types';

interface TokenOutputProps {
  results: TokenResult[];
}

export function TokenOutput({ results }: TokenOutputProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const copyAll = () => {
    const json = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(json);
    toast.success('All results copied as JSON');
  };

  const exportCSV = () => {
    const headers = ['Email', 'Status', 'Token', 'Account ID', 'User ID', 'Created At', 'Message'];
    const rows = results.map(r => [r.email, r.status, r.token, r.accountId, r.userId, r.createdAt, r.message]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bumblemaker-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  return (
    <motion.section
      id="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-100">Results & Tokens</h2>
          {results.length > 0 && (
            <div className="flex gap-1.5">
              <span className="badge bg-green-500/20 text-green-300">{successCount} ok</span>
              {failedCount > 0 && (
                <span className="badge bg-red-500/20 text-red-300">{failedCount} failed</span>
              )}
            </div>
          )}
        </div>
        {results.length > 0 && (
          <div className="flex gap-2">
            <button onClick={copyAll} className="btn-secondary text-sm flex items-center gap-1.5">
              <Copy className="w-4 h-4" /> Copy All
            </button>
            <button onClick={exportCSV} className="btn-secondary text-sm flex items-center gap-1.5">
              <Download className="w-4 h-4" /> CSV
            </button>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="py-12 text-center">
          <Inbox className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400 text-sm">No results yet</p>
          <p className="text-dark-500 text-xs mt-1">Start the automation to see results here</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result, idx) => (
            <div
              key={result.id}
              className={`p-3 rounded-lg border ${
                result.status === 'success' 
                  ? 'bg-green-500/5 border-green-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-dark-500 w-6">#{idx + 1}</span>
                <span className="text-sm text-dark-200 truncate max-w-[180px]">{result.email}</span>
                <span className={`badge ${
                  result.status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {result.status}
                </span>
                {result.status === 'success' && (
                  <>
                    <span className="text-xs text-dark-400 font-mono truncate max-w-[120px]">
                      {result.token.substring(0, 16)}...
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.token, 'Token')}
                      className="p-1 text-dark-400 hover:text-accent-400 transition-colors"
                      title="Copy Token"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.accountId, 'Account ID')}
                      className="p-1 text-dark-400 hover:text-accent-400 transition-colors"
                      title="Copy Account ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
              {result.status === 'failed' && (
                <p className="text-xs text-red-400 mt-1 ml-9">{result.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
