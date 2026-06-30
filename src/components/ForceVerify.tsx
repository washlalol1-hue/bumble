import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Upload, ShieldCheck, ChevronDown, Loader2 } from 'lucide-react';
import { CreatedAccount, TerminalLog } from '../types';
import { createLog } from '../utils/mockAutomation';

interface ForceVerifyProps {
  createdAccounts: CreatedAccount[];
  onAccountVerified: (accountId: string) => void;
}

export function ForceVerify({ createdAccounts, onAccountVerified }: ForceVerifyProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [verifyImage, setVerifyImage] = useState<string | null>(null);
  const [verifyImageName, setVerifyImageName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const successfulAccounts = createdAccounts.filter(a => a.status === 'success');
  const selectedAccount = successfulAccounts.find(a => a.id === selectedAccountId);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      setVerifyImage(preview);
      setVerifyImageName(file.name);
    }
  };

  const handleVerify = async () => {
    if (!selectedAccountId || !verifyImage) return;

    setIsVerifying(true);
    setLogs([]);
    setShowSuccess(false);

    const account = successfulAccounts.find(a => a.id === selectedAccountId);
    if (!account) return;

    const steps = [
      { msg: `[VERIFY] Starting force verification for ${account.name}...`, level: 'system' as const, delay: 800 },
      { msg: `[VERIFY] Uploading verification selfie...`, level: 'info' as const, delay: 1500 },
      { msg: `[VERIFY] Image uploaded: ${verifyImageName}`, level: 'info' as const, delay: 1000 },
      { msg: `[VERIFY] Submitting to verification API...`, level: 'info' as const, delay: 2000 },
      { msg: `[VERIFY] Analyzing facial match...`, level: 'info' as const, delay: 2500 },
      { msg: `[VERIFY] Match confidence: ${(Math.random() * 5 + 95).toFixed(1)}%`, level: 'info' as const, delay: 1200 },
      { msg: `[VERIFY] Applying verified badge to account ${account.accountId}...`, level: 'info' as const, delay: 1500 },
      { msg: `[VERIFY] ✓ Account successfully verified!`, level: 'success' as const, delay: 800 },
      { msg: `[VERIFY] ✓ Verified badge is now active on ${account.name}'s profile`, level: 'success' as const, delay: 500 },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      setLogs(prev => [...prev, createLog(step.level, step.msg)]);
    }

    onAccountVerified(selectedAccountId);
    setIsVerifying(false);
    setShowSuccess(true);

    // Clear after showing success
    setTimeout(() => {
      setVerifyImage(null);
      setVerifyImageName('');
    }, 3000);
  };

  if (successfulAccounts.length === 0) return null;

  return (
    <div id="force-verify" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <BadgeCheck className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Force Verify</h3>
          <p className="text-sm text-dark-400">Verify accounts with a selfie photo to get the verified badge</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Account Selector */}
        <div>
          <label className="text-sm text-dark-300 mb-2 block">Select Account to Verify</label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="input-field flex items-center justify-between cursor-pointer"
            >
              {selectedAccount ? (
                <div className="flex items-center gap-2">
                  <span className="text-dark-100">{selectedAccount.name}</span>
                  <span className="text-dark-500 text-xs">({selectedAccount.email})</span>
                  {selectedAccount.verified && (
                    <BadgeCheck className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              ) : (
                <span className="text-dark-400">Choose an account...</span>
              )}
              <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-600 rounded-lg overflow-hidden shadow-xl"
                >
                  {successfulAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setSelectedAccountId(acc.id);
                        setDropdownOpen(false);
                        setShowSuccess(false);
                        setLogs([]);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-dark-700 transition-colors text-left ${
                        selectedAccountId === acc.id ? 'bg-dark-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-dark-100">{acc.name}</span>
                        <span className="text-xs text-dark-500">{acc.age}y</span>
                        <span className="text-xs text-dark-500">• {acc.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {acc.verified && (
                          <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        <span className="text-[10px] text-dark-600 font-mono">{acc.accountId}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Image Upload for Verification */}
        {selectedAccountId && (
          <div>
            <label className="text-sm text-dark-300 mb-2 block">Upload Verification Selfie</label>
            {!verifyImage ? (
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-dark-600 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer">
                <Upload className="w-6 h-6 text-dark-500 mb-1" />
                <span className="text-sm text-dark-400">Click to upload verification photo</span>
                <span className="text-xs text-dark-500 mt-0.5">This image will be sent to verify</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-dark-800 rounded-lg border border-dark-600">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-dark-500">
                  <img src={verifyImage} alt="Verification" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark-200">{verifyImageName}</p>
                  <p className="text-xs text-dark-500">Ready to submit for verification</p>
                </div>
                <button
                  onClick={() => { setVerifyImage(null); setVerifyImageName(''); }}
                  className="text-xs text-dark-500 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}

        {/* Verify Button */}
        {selectedAccountId && verifyImage && !isVerifying && !showSuccess && (
          <button
            onClick={handleVerify}
            disabled={selectedAccount?.verified}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              selectedAccount?.verified
                ? 'bg-dark-800 text-dark-500 cursor-not-allowed border border-dark-700'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg'
            }`}
          >
            {selectedAccount?.verified ? (
              <>
                <BadgeCheck className="w-4 h-4" />
                Already Verified
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Force Verify Account
              </>
            )}
          </button>
        )}

        {/* Verifying State */}
        {isVerifying && (
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-sm text-blue-300">Verifying account...</span>
          </div>
        )}

        {/* Terminal Logs */}
        {logs.length > 0 && (
          <div className="bg-dark-950 rounded-lg border border-dark-700 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 border-b border-dark-700">
              <ShieldCheck className="w-3.5 h-3.5 text-dark-400" />
              <span className="text-[10px] text-dark-400 font-mono">verification-engine</span>
              {isVerifying && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full bg-blue-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div
              ref={terminalRef}
              className="p-3 h-44 overflow-y-auto font-mono text-xs leading-relaxed terminal-scroll"
            >
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`${
                      log.level === 'system' ? 'text-purple-400' :
                      log.level === 'info' ? 'text-blue-400' :
                      log.level === 'success' ? 'text-green-400' :
                      'text-dark-300'
                    } whitespace-pre-wrap`}
                  >
                    {log.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && selectedAccount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <BadgeCheck className="w-8 h-8 text-blue-400" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-blue-300">
                  {selectedAccount.name}'s account has been successfully verified!
                </p>
                <p className="text-xs text-dark-400 mt-0.5">
                  Verified badge is now active on this profile
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
