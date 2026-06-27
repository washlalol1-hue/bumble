import { useState } from 'react';
import { ArrowRightLeft, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export type FunnelPlatform = 'snapchat' | 'telegram' | 'whatsapp';

interface FunnelSelectorProps {}

interface FunnelConfig {
  platform: FunnelPlatform;
  enabled: boolean;
  username: string;
  autoInsert: boolean;
  messageTemplate: string;
}

const funnelPlatforms: { id: FunnelPlatform; label: string; emoji: string; color: string }[] = [
  { id: 'snapchat', label: 'Snapchat', emoji: '👻', color: 'yellow' },
  { id: 'telegram', label: 'Telegram', emoji: '✈️', color: 'blue' },
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬', color: 'green' },
];

export function FunnelSelector({}: FunnelSelectorProps) {
  const [funnels, setFunnels] = useState<FunnelConfig[]>([
    { platform: 'snapchat', enabled: false, username: '', autoInsert: true, messageTemplate: 'Add me on snap: {username}' },
    { platform: 'telegram', enabled: false, username: '', autoInsert: true, messageTemplate: 'Hmu on telegram: {username}' },
    { platform: 'whatsapp', enabled: false, username: '', autoInsert: true, messageTemplate: 'Text me on whatsapp: {username}' },
  ]);

  const updateFunnel = (platform: FunnelPlatform, updates: Partial<FunnelConfig>) => {
    setFunnels(prev =>
      prev.map(f => f.platform === platform ? { ...f, ...updates } : f)
    );
  };


  const getColorClasses = (color: string, enabled: boolean) => {
    if (!enabled) return 'border-dark-700 bg-dark-800 text-dark-400';
    switch (color) {
      case 'yellow': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300';
      case 'blue': return 'border-blue-500/50 bg-blue-500/10 text-blue-300';
      case 'green': return 'border-green-500/50 bg-green-500/10 text-green-300';
      default: return 'border-dark-700 bg-dark-800 text-dark-400';
    }
  };

  return (
    <motion.section
      id="funnel-selector"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-semibold text-dark-100">Funnel Selector</h2>
      </div>

      <p className="text-sm text-dark-400 mb-4">
        Choose where to redirect matches. Auto-insert your handle into conversations.
      </p>

      <div className="space-y-4">
        {funnelPlatforms.map((fp) => {
          const funnel = funnels.find(f => f.platform === fp.id)!;
          return (
            <div
              key={fp.id}
              className={`p-4 rounded-lg border transition-all ${getColorClasses(fp.color, funnel.enabled)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{fp.emoji}</span>
                  <span className="font-medium text-sm">{fp.label}</span>
                </div>
                <div
                  onClick={() => updateFunnel(fp.id, { enabled: !funnel.enabled })}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center ${
                    funnel.enabled ? 'bg-accent-500' : 'bg-dark-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      funnel.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>


              {funnel.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Username / Handle</label>
                    <input
                      type="text"
                      value={funnel.username}
                      onChange={(e) => updateFunnel(fp.id, { username: e.target.value })}
                      placeholder={`Your ${fp.label} username...`}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Message Template</label>
                    <input
                      type="text"
                      value={funnel.messageTemplate}
                      onChange={(e) => updateFunnel(fp.id, { messageTemplate: e.target.value })}
                      className="input-field text-sm"
                    />
                    <p className="text-xs text-dark-600 mt-1">Use {'{username}'} as placeholder</p>
                  </div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-dark-400">Auto-insert in conversations</span>
                    <div
                      onClick={() => updateFunnel(fp.id, { autoInsert: !funnel.autoInsert })}
                      className={`w-8 h-4 rounded-full transition-colors cursor-pointer flex items-center ${
                        funnel.autoInsert ? 'bg-accent-500' : 'bg-dark-600'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white transition-transform ${
                          funnel.autoInsert ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {funnels.some(f => f.enabled) && (
        <div className="mt-4 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-dark-500 mt-0.5" />
            <p className="text-xs text-dark-500">
              Active funnels: {funnels.filter(f => f.enabled).map(f => f.platform).join(', ')}. 
              Matches will be redirected after 3-5 messages.
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}
