import { Calendar } from 'lucide-react';

interface AgeSelectorProps {
  ageMin: number;
  ageMax: number;
  onAgeMinChange: (age: number) => void;
  onAgeMaxChange: (age: number) => void;
}

export function AgeSelector({ ageMin, ageMax, onAgeMinChange, onAgeMaxChange }: AgeSelectorProps) {
  return (
    <div id="age" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <Calendar className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Age Selector</h3>
          <p className="text-sm text-dark-400">Set age range for profiles (random within range)</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-dark-300 mb-1 block">Min Age</label>
            <input
              type="number"
              value={ageMin}
              onChange={(e) => onAgeMinChange(Math.max(18, parseInt(e.target.value) || 18))}
              min={18}
              max={55}
              className="input-field text-center text-lg font-semibold"
            />
          </div>
          <div>
            <label className="text-sm text-dark-300 mb-1 block">Max Age</label>
            <input
              type="number"
              value={ageMax}
              onChange={(e) => onAgeMaxChange(Math.min(55, parseInt(e.target.value) || 30))}
              min={18}
              max={55}
              className="input-field text-center text-lg font-semibold"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 py-3 bg-dark-800 rounded-lg border border-dark-700">
          <span className="text-dark-400 text-sm">Profiles will be</span>
          <span className="text-lg font-bold text-orange-400">{ageMin}</span>
          <span className="text-dark-400">—</span>
          <span className="text-lg font-bold text-orange-400">{ageMax}</span>
          <span className="text-dark-400 text-sm">years old</span>
        </div>

        <div className="w-full">
          <div className="relative h-2 bg-dark-700 rounded-full">
            <div
              className="absolute h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
              style={{
                left: `${((ageMin - 18) / (55 - 18)) * 100}%`,
                width: `${((ageMax - ageMin) / (55 - 18)) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-dark-500 mt-1">
            <span>18</span>
            <span>55</span>
          </div>
        </div>
      </div>
    </div>
  );
}
