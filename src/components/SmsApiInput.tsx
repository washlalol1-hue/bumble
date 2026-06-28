import { MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { SmsProvider } from '../types';

interface SmsApiInputProps {
  provider: SmsProvider;
  apiKey: string;
  onProviderChange: (provider: SmsProvider) => void;
  onApiKeyChange: (key: string) => void;
}

const providers: { id: SmsProvider; label: string }[] = [
  { id: 'smspool', label: 'SMSPool' },
  { id: 'sms-activate', label: 'SMS-Activate' },
  { id: 'textverified', label: 'TextVerified' },
  { id: 'custom', label: 'Custom' },
];

export function SmsApiInput({ provider, apiKey, onProviderChange, onApiKeyChange }: SmsApiInputProps) {
  return (
    <div id="sms" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">SMS Verification</h3>
          <p className="text-sm text-dark-400">Connect SMS provider for phone verification</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => onProviderChange(p.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                provider === p.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter API key..."
          className="input-field font-mono text-sm"
        />

        <div className="flex items-center gap-2">
          {apiKey ? (
            <>
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">API key set</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-dark-500" />
              <span className="text-sm text-dark-500">No API key</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
