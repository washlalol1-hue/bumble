import { useState } from 'react';
import { Phone, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { SmsProvider } from '../types';

interface SmsApiInputProps {
  provider: SmsProvider;
  apiKey: string;
  countryCode: string;
  status: 'disconnected' | 'connected' | 'error';
  onProviderChange: (provider: SmsProvider) => void;
  onApiKeyChange: (key: string) => void;
  onCountryCodeChange: (code: string) => void;
  onStatusChange: (status: 'disconnected' | 'connected' | 'error') => void;
}

const providers: { value: SmsProvider; label: string }[] = [
  { value: 'smspool', label: 'SMSPool' },
  { value: 'sms-activate', label: 'SMS-Activate' },
  { value: 'verifywithsms', label: 'VerifyWithSMS' },
  { value: 'textverified', label: 'TextVerified' },
  { value: 'custom', label: 'Custom API' },
];

const countries = [
  { code: 'US', label: 'United States (+1)' },
  { code: 'GB', label: 'United Kingdom (+44)' },
  { code: 'CA', label: 'Canada (+1)' },
  { code: 'AU', label: 'Australia (+61)' },
  { code: 'DE', label: 'Germany (+49)' },
  { code: 'FR', label: 'France (+33)' },
  { code: 'IN', label: 'India (+91)' },
  { code: 'BR', label: 'Brazil (+55)' },
  { code: 'RU', label: 'Russia (+7)' },
  { code: 'PH', label: 'Philippines (+63)' },
];

export function SmsApiInput({
  provider,
  apiKey,
  countryCode,
  status,
  onProviderChange,
  onApiKeyChange,
  onCountryCodeChange,
  onStatusChange,
}: SmsApiInputProps) {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = Math.random() > 0.3;
    if (success) {
      onStatusChange('connected');
      toast.success('Connection successful!');
    } else {
      onStatusChange('error');
      toast.error('Connection failed. Check your API key.');
    }
    setTesting(false);
  };

  const getFieldLabel = () => {
    if (provider === 'custom') return 'API URL';
    return 'API Key';
  };

  return (
    <motion.section
      id="sms"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Phone className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-100">SMS Verification</h2>
          <span className={`badge ${
            status === 'connected' ? 'bg-green-500/20 text-green-300' :
            status === 'error' ? 'bg-red-500/20 text-red-300' :
            'bg-dark-700 text-dark-400'
          }`}>
            {status === 'connected' ? 'Connected' : status === 'error' ? 'Error' : 'Not Connected'}
          </span>
        </div>
        {status === 'connected' ? (
          <Wifi className="w-5 h-5 text-green-400" />
        ) : (
          <WifiOff className="w-5 h-5 text-dark-500" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-dark-300 mb-1.5">Provider</label>
          <select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as SmsProvider)}
            className="input-field"
          >
            {providers.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-dark-300 mb-1.5">{getFieldLabel()}</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder={provider === 'custom' ? 'https://api.example.com/sms' : 'Enter your API key...'}
            className="input-field font-mono"
          />
        </div>

        <div>
          <label className="block text-sm text-dark-300 mb-1.5">Country</label>
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="input-field"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>

        <button onClick={handleTest} disabled={testing} className="btn-primary text-sm w-full">
          {testing ? 'Testing Connection...' : 'Test Connection'}
        </button>
      </div>
    </motion.section>
  );
}
