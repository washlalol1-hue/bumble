import { useState, useRef, useEffect } from 'react';
import { Heart, Clock, Gauge, Play, Square, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SwipeAction = 'liked' | 'disliked' | 'matched';

interface SwipeEntry {
  id: string;
  name: string;
  age: number;
  action: SwipeAction;
  timestamp: string;
}

const manNames = [
  'James', 'Michael', 'Robert', 'David', 'William', 'John', 'Daniel', 'Matthew',
  'Andrew', 'Ryan', 'Tyler', 'Brandon', 'Nathan', 'Justin', 'Chris', 'Kevin',
  'Jason', 'Aaron', 'Jake', 'Ethan', 'Dylan', 'Noah', 'Liam', 'Mason',
  'Logan', 'Lucas', 'Alexander', 'Jack', 'Ben', 'Marcus', 'Adam', 'Kyle',
  'Eric', 'Josh', 'Patrick', 'Ian', 'Trevor', 'Connor', 'Derek', 'Caleb',
  'Brody', 'Gavin', 'Hunter', 'Cole', 'Blake', 'Chase', 'Owen', 'Max',
  'Carter', 'Sean', 'Nolan', 'Kai', 'Zach', 'Leo', 'Austin', 'Finn',
  'Jared', 'Trent', 'Colton', 'Weston', 'Miles', 'Grant', 'Reed', 'Spencer',
];

function getRandomName(): string {
  return manNames[Math.floor(Math.random() * manNames.length)];
}

function getRandomAge(): number {
  return Math.floor(Math.random() * 15) + 21; // 21-35
}

export function AutoSwiper() {
  const [swipesPerMinute, setSwipesPerMinute] = useState(15);
  const [duration, setDuration] = useState(30);
  const [likeRatio, setLikeRatio] = useState(80);
  const [isRunning, setIsRunning] = useState(false);
  const [swipes, setSwipes] = useState<SwipeEntry[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const likedCount = swipes.filter(s => s.action === 'liked').length;
  const dislikedCount = swipes.filter(s => s.action === 'disliked').length;
  const matchedCount = swipes.filter(s => s.action === 'matched').length;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [swipes]);

  const handleToggle = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    } else {
      setIsRunning(true);
      setSwipes([]);

      const intervalMs = (60 / swipesPerMinute) * 1000;
      const maxSwipes = swipesPerMinute * duration;
      let count = 0;

      intervalRef.current = setInterval(() => {
        count++;
        const rand = Math.random() * 100;
        let action: SwipeAction;

        if (rand < likeRatio) {
          // Within likes, 15% chance of match
          action = Math.random() < 0.15 ? 'matched' : 'liked';
        } else {
          action = 'disliked';
        }

        const entry: SwipeEntry = {
          id: `swipe-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: getRandomName(),
          age: getRandomAge(),
          action,
          timestamp: new Date().toLocaleTimeString(),
        };

        setSwipes(prev => [...prev, entry]);

        if (count >= maxSwipes) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
        }
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getActionIcon = (action: SwipeAction) => {
    switch (action) {
      case 'liked': return <ThumbsUp className="w-3.5 h-3.5 text-green-400" />;
      case 'disliked': return <ThumbsDown className="w-3.5 h-3.5 text-red-400" />;
      case 'matched': return <Sparkles className="w-3.5 h-3.5 text-yellow-400" />;
    }
  };

  const getActionColor = (action: SwipeAction) => {
    switch (action) {
      case 'liked': return 'border-green-500/20 bg-green-500/5';
      case 'disliked': return 'border-red-500/20 bg-red-500/5';
      case 'matched': return 'border-yellow-500/20 bg-yellow-500/5';
    }
  };

  const getActionLabel = (action: SwipeAction) => {
    switch (action) {
      case 'liked': return 'LIKED';
      case 'disliked': return 'NOPE';
      case 'matched': return 'MATCH!';
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

        {/* Stats */}
        {swipes.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/5 border border-green-500/20 rounded-lg">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-sm font-bold text-green-400">{likedCount}</div>
                <div className="text-[10px] text-dark-500">Liked</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg">
              <ThumbsDown className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-sm font-bold text-red-400">{dislikedCount}</div>
                <div className="text-[10px] text-dark-500">Disliked</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-sm font-bold text-yellow-400">{matchedCount}</div>
                <div className="text-[10px] text-dark-500">Matched</div>
              </div>
            </div>
          </div>
        )}

        {/* Swipe Feed */}
        {swipes.length > 0 && (
          <div
            ref={listRef}
            className="max-h-52 overflow-y-auto space-y-1.5 terminal-scroll"
          >
            <AnimatePresence>
              {swipes.map((swipe) => (
                <motion.div
                  key={swipe.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border ${getActionColor(swipe.action)}`}
                >
                  <div className="flex items-center gap-2.5">
                    {getActionIcon(swipe.action)}
                    <span className="text-sm text-dark-200 font-medium">{swipe.name}</span>
                    <span className="text-xs text-dark-500">{swipe.age}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${
                      swipe.action === 'liked' ? 'text-green-400' :
                      swipe.action === 'disliked' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {getActionLabel(swipe.action)}
                    </span>
                    <span className="text-[10px] text-dark-600">{swipe.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

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
                Swiping... ({swipes.length} done)
              </span>
            ) : swipes.length > 0 ? (
              <span>Completed: {swipes.length} swipes</span>
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
