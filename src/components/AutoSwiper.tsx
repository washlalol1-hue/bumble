import { useState } from 'react';
import { Heart, Play, Square, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Platform } from './Header';

interface AutoSwiperProps {
  platform: Platform;
}

interface SwipeSettings {
  speed: number; // swipes per minute
  minAge: number;
  maxAge: number;
  maxDistance: number; // in miles
  swipeRightRatio: number; // percentage to swipe right
  dailyLimit: number;
  pauseBetweenSessions: number; // minutes
  avoidVerified: boolean;
  preferBioOnly: boolean;
}

export function AutoSwiper({ platform }: AutoSwiperProps) {
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [swipeCount, setSwipeCount] = useState(0);
  const [settings, setSettings] = useState<SwipeSettings>({
    speed: 15,
    minAge: 18,
    maxAge: 35,
    maxDistance: 25,
    swipeRightRatio: 70,
    dailyLimit: 100,
    pauseBetweenSessions: 5,
    avoidVerified: false,
    preferBioOnly: true,
  });

  const handleStart = () => {
    setIsActive(true);
    // Simulate swiping
    const interval = setInterval(() => {
      setSwipeCount(prev => {
        if (prev >= settings.dailyLimit) {
          clearInterval(interval);
          setIsActive(false);
          return prev;
        }
        return prev + 1;
      });
    }, (60 / settings.speed) * 1000);

    // Store interval ID for cleanup
    (window as any).__swipeInterval = interval;
  };

  const handleStop = () => {
    setIsActive(false);
    if ((window as any).__swipeInterval) {
      clearInterval((window as any).__swipeInterval);
    }
  };

  const updateSetting = <K extends keyof SwipeSettings>(key: K, value: SwipeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.section
      id="auto-swiper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-dark-100">Auto Swiper</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-accent-500/20 text-accent-400' : 'bg-dark-800 text-dark-400 hover:text-dark-200'}`}
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-dark-800 rounded-lg text-center">
          <p className="text-xs text-dark-400">Swiped</p>
          <p className="text-lg font-bold text-brand-400">{swipeCount}</p>
        </div>
        <div className="p-3 bg-dark-800 rounded-lg text-center">
          <p className="text-xs text-dark-400">Daily Limit</p>
          <p className="text-lg font-bold text-dark-100">{settings.dailyLimit}</p>
        </div>
        <div className="p-3 bg-dark-800 rounded-lg text-center">
          <p className="text-xs text-dark-400">Speed</p>
          <p className="text-lg font-bold text-dark-100">{settings.speed}/min</p>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 mb-4 p-4 bg-dark-800/50 rounded-lg border border-dark-700"
        >
          {/* Speed */}
          <div>
            <label className="flex items-center justify-between text-sm text-dark-300 mb-1.5">
              <span>Swipe Speed</span>
              <span className="text-accent-400 font-medium">{settings.speed} swipes/min</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={settings.speed}
              onChange={(e) => updateSetting('speed', Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-dark-500 mt-1">
              <span>Slow (safe)</span>
              <span>Fast (risky)</span>
            </div>
          </div>

          {/* Age Range */}
          <div>
            <label className="text-sm text-dark-300 mb-1.5 block">Age Range</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="18"
                max="99"
                value={settings.minAge}
                onChange={(e) => updateSetting('minAge', Number(e.target.value))}
                className="input-field w-20 text-center"
              />
              <span className="text-dark-500">to</span>
              <input
                type="number"
                min="18"
                max="99"
                value={settings.maxAge}
                onChange={(e) => updateSetting('maxAge', Number(e.target.value))}
                className="input-field w-20 text-center"
              />
            </div>
          </div>

          {/* Max Distance */}
          <div>
            <label className="flex items-center justify-between text-sm text-dark-300 mb-1.5">
              <span>Max Distance</span>
              <span className="text-accent-400 font-medium">{settings.maxDistance} miles</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.maxDistance}
              onChange={(e) => updateSetting('maxDistance', Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-accent-500"
            />
          </div>

          {/* Swipe Right Ratio */}
          <div>
            <label className="flex items-center justify-between text-sm text-dark-300 mb-1.5">
              <span>Swipe Right Ratio</span>
              <span className="text-accent-400 font-medium">{settings.swipeRightRatio}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.swipeRightRatio}
              onChange={(e) => updateSetting('swipeRightRatio', Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-accent-500"
            />
          </div>

          {/* Daily Limit */}
          <div>
            <label className="flex items-center justify-between text-sm text-dark-300 mb-1.5">
              <span>Daily Limit</span>
              <span className="text-accent-400 font-medium">{settings.dailyLimit} swipes</span>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={settings.dailyLimit}
              onChange={(e) => updateSetting('dailyLimit', Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-accent-500"
            />
          </div>

          {/* Pause Between Sessions */}
          <div>
            <label className="flex items-center justify-between text-sm text-dark-300 mb-1.5">
              <span>Pause Between Sessions</span>
              <span className="text-accent-400 font-medium">{settings.pauseBetweenSessions} min</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={settings.pauseBetweenSessions}
              onChange={(e) => updateSetting('pauseBetweenSessions', Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-accent-500"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-dark-300">Only profiles with bio</span>
              <div
                onClick={() => updateSetting('preferBioOnly', !settings.preferBioOnly)}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center ${
                  settings.preferBioOnly ? 'bg-accent-500' : 'bg-dark-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.preferBioOnly ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-dark-300">Avoid verified profiles</span>
              <div
                onClick={() => updateSetting('avoidVerified', !settings.avoidVerified)}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center ${
                  settings.avoidVerified ? 'bg-accent-500' : 'bg-dark-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.avoidVerified ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>
        </motion.div>
      )}

      {/* Start/Stop Button */}
      {!isActive ? (
        <button
          onClick={handleStart}
          className="w-full py-3 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold rounded-lg hover:from-brand-600 hover:to-accent-600 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" /> Start Auto Swiping
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          <Square className="w-5 h-5" /> Stop Swiping
        </button>
      )}
    </motion.section>
  );
}
