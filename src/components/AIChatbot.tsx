import { useState } from 'react';
import { Bot, Zap, MessageCircle, ToggleLeft, ToggleRight } from 'lucide-react';

type Personality = 'flirty' | 'chill' | 'funny' | 'deep';

const personalities: { id: Personality; label: string; emoji: string; desc: string }[] = [
  { id: 'flirty', label: 'Flirty', emoji: '😘', desc: 'Playful & romantic vibes' },
  { id: 'chill', label: 'Chill', emoji: '😎', desc: 'Relaxed & casual' },
  { id: 'funny', label: 'Funny', emoji: '😂', desc: 'Humorous & witty' },
  { id: 'deep', label: 'Deep', emoji: '🧠', desc: 'Thoughtful & meaningful' },
];

export function AIChatbot() {
  const [enabled, setEnabled] = useState(false);
  const [personality, setPersonality] = useState<Personality>('flirty');
  const [responseDelay, setResponseDelay] = useState(30);
  const [autoReply, setAutoReply] = useState(true);

  return (
    <div id="ai-chatbot" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <Bot className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">AI Chatbot</h3>
          <p className="text-sm text-dark-400">Auto-reply to matches with AI-powered messages</p>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          className="ml-auto"
        >
          {enabled ? (
            <ToggleRight className="w-8 h-8 text-cyan-400" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-dark-500" />
          )}
        </button>
      </div>

      {enabled && (
        <div className="space-y-4">
          {/* Personality Selector */}
          <div>
            <label className="text-sm text-dark-300 mb-2 block">Personality</label>
            <div className="grid grid-cols-2 gap-2">
              {personalities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                    personality === p.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-500'
                  }`}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <div>
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-dark-500">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Response Delay */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-dark-300 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Response Delay
              </label>
              <span className="text-sm font-mono text-cyan-400">{responseDelay}s</span>
            </div>
            <input
              type="range"
              min={5}
              max={120}
              value={responseDelay}
              onChange={(e) => setResponseDelay(parseInt(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-dark-500 mt-1">
              <span>5s (instant)</span>
              <span>120s (natural)</span>
            </div>
          </div>

          {/* Auto Reply Toggle */}
          <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-700">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-dark-400" />
              <div>
                <div className="text-sm text-dark-200">Auto Reply to All</div>
                <div className="text-xs text-dark-500">Respond to every new message</div>
              </div>
            </div>
            <button onClick={() => setAutoReply(!autoReply)}>
              {autoReply ? (
                <ToggleRight className="w-7 h-7 text-cyan-400" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-dark-500" />
              )}
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-300">AI Chatbot active — {personality} mode</span>
          </div>
        </div>
      )}
    </div>
  );
}
