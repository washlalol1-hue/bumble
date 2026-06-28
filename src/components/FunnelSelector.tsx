import { useState } from 'react';
import { ArrowRightLeft, Send, ToggleLeft, ToggleRight } from 'lucide-react';
import { FunnelPlatform } from '../types';

interface FunnelItem {
  id: FunnelPlatform;
  label: string;
  emoji: string;
  placeholder: string;
  color: string;
}

const funnelPlatforms: FunnelItem[] = [
  { id: 'telegram', label: 'Telegram', emoji: '✈️', placeholder: '@username', color: 'blue' },
  { id: 'whatsapp', label: 'WhatsApp', emoji: '📱', placeholder: '+1234567890', color: 'green' },
  { id: 'instagram', label: 'Instagram', emoji: '📸', placeholder: '@username', color: 'pink' },
];

export function FunnelSelector() {
  const [activePlatform, setActivePlatform] = useState<FunnelPlatform>('telegram');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [enabled, setEnabled] = useState(false);

  const getColorClasses = (platform: FunnelPlatform, isActive: boolean) => {
    if (!isActive) return 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-500';
    switch (platform) {
      case 'telegram': return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
      case 'whatsapp': return 'bg-green-500/20 text-green-300 border border-green-500/40';
      case 'instagram': return 'bg-pink-500/20 text-pink-300 border border-pink-500/40';
    }
  };

  return (
    <div id="funnel" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <ArrowRightLeft className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Funnel</h3>
          <p className="text-sm text-dark-400">Route matches to Telegram, WhatsApp, or Instagram</p>
        </div>
        <button onClick={() => setEnabled(!enabled)} className="ml-auto">
          {enabled ? (
            <ToggleRight className="w-8 h-8 text-amber-400" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-dark-500" />
          )}
        </button>
      </div>

      {enabled && (
        <div className="space-y-4">
          {/* Platform Selector */}
          <div className="grid grid-cols-3 gap-2">
            {funnelPlatforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${getColorClasses(p.id, activePlatform === p.id)}`}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Username/Contact */}
          <div>
            <label className="text-sm text-dark-300 mb-1 block">
              Your {funnelPlatforms.find(p => p.id === activePlatform)?.label} handle
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={funnelPlatforms.find(p => p.id === activePlatform)?.placeholder}
              className="input-field font-mono text-sm"
            />
          </div>

          {/* Message Template */}
          <div>
            <label className="text-sm text-dark-300 mb-1 block">
              Funnel message (sent after matching)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hey! Let's chat on ${funnelPlatforms.find(p => p.id === activePlatform)?.label} — I'm more active there 😊`}
              className="input-field h-20 text-sm resize-none"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <Send className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">
              Funneling to {funnelPlatforms.find(p => p.id === activePlatform)?.label}: {username || 'not set'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
