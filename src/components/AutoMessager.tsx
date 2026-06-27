import { useState } from 'react';
import { Bot, MessageCircle, Power } from 'lucide-react';
import { motion } from 'framer-motion';
import { Platform } from './Header';

interface AutoMessagerProps {
  platform: Platform;
}

export function AutoMessager({ platform }: AutoMessagerProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [messageStyle, setMessageStyle] = useState<'casual' | 'flirty' | 'funny' | 'direct'>('casual');
  const [responseDelay, setResponseDelay] = useState(30);
  const [messagesSent, setMessagesSent] = useState(0);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (newState) {
      // Simulate messages being sent
      const interval = setInterval(() => {
        setMessagesSent(prev => prev + 1);
      }, 5000 + Math.random() * 10000);
      (window as any).__messagerInterval = interval;
    } else {
      if ((window as any).__messagerInterval) {
        clearInterval((window as any).__messagerInterval);
      }
    }
  };

  const styles = [
    { id: 'casual' as const, label: 'Casual', desc: 'Friendly and relaxed' },
    { id: 'flirty' as const, label: 'Flirty', desc: 'Playful and teasing' },
    { id: 'funny' as const, label: 'Funny', desc: 'Humor-focused openers' },
    { id: 'direct' as const, label: 'Direct', desc: 'Straight to the point' },
  ];

  return (
    <motion.section
      id="auto-messager"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-dark-100">Auto AI Messager</h2>
        </div>
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            isEnabled
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-600'
          }`}
        >
          <Power className="w-4 h-4" />
          <span className="text-sm font-medium">{isEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <p className="text-sm text-dark-400 mb-4">
        AI-powered auto messaging for your {platform.charAt(0).toUpperCase() + platform.slice(1)} matches.
        Generates contextual openers and responses.
      </p>


      {/* Stats */}
      {isEnabled && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-dark-800 rounded-lg text-center">
            <p className="text-xs text-dark-400">Messages Sent</p>
            <p className="text-lg font-bold text-blue-400">{messagesSent}</p>
          </div>
          <div className="p-3 bg-dark-800 rounded-lg text-center">
            <p className="text-xs text-dark-400">Response Delay</p>
            <p className="text-lg font-bold text-dark-100">{responseDelay}s</p>
          </div>
        </div>
      )}

      {/* Message Style */}
      <div className="mb-4">
        <label className="text-sm text-dark-300 mb-2 block">Message Style</label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setMessageStyle(style.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                messageStyle === style.id
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                  : 'border-dark-700 bg-dark-800 text-dark-400 hover:border-dark-600'
              }`}
            >
              <p className="text-sm font-medium">{style.label}</p>
              <p className="text-xs opacity-70">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Response Delay */}
      <div className="mb-4">
        <label className="flex items-center justify-between text-sm text-dark-300 mb-1.5">
          <span>Response Delay</span>
          <span className="text-blue-400 font-medium">{responseDelay} seconds</span>
        </label>
        <input
          type="range"
          min="5"
          max="300"
          step="5"
          value={responseDelay}
          onChange={(e) => setResponseDelay(Number(e.target.value))}
          className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-dark-500 mt-1">
          <span>Instant</span>
          <span>5 min</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-dark-800/50 rounded-lg border border-dark-700">
        <div className="flex items-start gap-2">
          <MessageCircle className="w-4 h-4 text-dark-500 mt-0.5" />
          <p className="text-xs text-dark-500">
            AI reads match profiles and generates personalized openers. Responses adapt based on conversation context.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
