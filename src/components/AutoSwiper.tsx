import { useState } from 'react';
import { Heart, Clock, Gauge, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';

export function AutoSwiper() {
  const [enabled, setEnabled] = useState(false);
  const [swipesPerMinute, setSwipesPerMinute] = useState(15);
  const [duration, setDuration] = useState(30);
  const [likeRatio, setLikeRatio] = useState(80);
  const [isRunning, setIsRunning] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      setSwipeCount(0);
      // Simulate swipe counting
      const interval = setInterval(() => {
        setSwipeCount(prev => {
          const next = prev + 1;
          if (next >= swipesPerMinute * duration) {
            clearInterval(interval);
            setIsRunning(false);
            return next;
          }
          return next;
        });
      }, (60 / swipesPerMinute) * 1000);
    }
  };

  return (
    <div id="auto-swiper" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-500/10 rounded-lg">
          <Heart className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Auto Swiper</h3>
          <p className="text-sm text-dark-400">Automatically swipe on profiles with time control</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Speed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-dark-300 flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Swipes per minute
            </label>
            <span className="text-sm font-mono text-rose-400">{swipesPerMinute}/min</span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            value={swipesPerMinute}
            onChange={(e) => setSwipesPerMinute(parseInt(e.target.value))}
            className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-xs text-dark-500 mt-1">
            <span>5</span>
            <span>Slow</span>
            <span>Fast</span>
            <span>40</span>
          </div>
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-dark-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration
            </label>
            <span className="text-sm font-mono text-rose-400">{duration} min</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 60, 120].map((mins) => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  duration === mins
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-500'
                }`}
              >
                {mins < 60 ? `${mins}m` : `${mins / 60}h`}
              </button>
            ))}
          </div>
        </div>

        {/* Like Ratio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-dark-300">Like Ratio</label>
            <span className="text-sm font-mono text-rose-400">{likeRatio}% right swipes</span>
          </div>
          <input
            type="range"
            min={30}
            max={100}
            value={likeRatio}
            onChange={(e) => setLikeRatio(parseInt(e.target.value))}
            className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-700">
          <div className="text-sm text-dark-400">
            {isRunning ? (
              <span className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Swiping... ({swipeCount} done)
              </span>
            ) : swipeCount > 0 ? (
              <span>Completed: {swipeCount} swipes</span>
            ) : (
              <span>Ready to swipe</span>
            )}
          </div>
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isRunning
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Swiping
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
