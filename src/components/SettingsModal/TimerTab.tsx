import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SimpleSelect } from '../SimpleSelect';

type Props = {
  mode: 'duration' | 'target';
  setMode: (mode: 'duration' | 'target') => void;
  hours: number;
  setHours: (hours: number) => void;
  minutes: number;
  setMinutes: (minutes: number) => void;
  targetTime: string;
  setTargetTime: (time: string) => void;
  countdownActive: boolean;
  remainingTime?: string;
  countdownStartTime?: Date | null;
  targetDate?: Date | null;
};

export default function TimerTab({ mode, setMode, hours, setHours, minutes, setMinutes, targetTime, setTargetTime, countdownActive, remainingTime, countdownStartTime, targetDate }: Props) {
  const settings = useSettings();

  return (
    <>
      <style>{`
        /* Hide default number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="space-y-6">
        {/* Schedule Item Selection */}
        <div>
        <label className="block mb-1">Phase auswählen:</label>
        <SimpleSelect
          options={settings.scheduleItems.map((item, index) => ({
            value: String(index + 1),
            label: item.label,
          }))}
          value={String(settings.currentGame)}
          onChange={(v) => settings.setCurrentGame(Number(v))}
        />
      </div>

      {/* Mode Selection and Info Box Layout */}
      <div className="flex gap-4">
        {/* Left Side - Controls */}
        <div className="flex-1 space-y-6">
          {/* Mode Selection */}
          <div>
            <div className="mb-1">Countdown-Modus:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('duration')}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  mode === 'duration'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 text-white'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 text-white/80 hover:text-white hover:from-zinc-700/70 hover:to-zinc-600/70'
                } focus:outline-none`}
              >
                Nach Dauer
              </button>
              <button
                onClick={() => setMode('target')}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  mode === 'target'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 text-white'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 text-white/80 hover:text-white hover:from-zinc-700/70 hover:to-zinc-600/70'
                } focus:outline-none`}
              >
                Bis Uhrzeit
              </button>
            </div>
          </div>

          {/* Duration Mode Inputs */}
          {mode === 'duration' && (
            <div className="flex gap-4 items-end">
          <div>
            <label className="block mb-1">Stunden:</label>
            <div className="relative w-20">
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-9 px-2 pr-8 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                style={{ lineHeight: '36px' }}
              />
              <div className="absolute right-1 top-0 h-full flex flex-col justify-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setHours(Math.min(23, hours + 1))}
                  className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setHours(Math.max(0, hours - 1))}
                  className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-1">Minuten:</label>
            <div className="relative w-20">
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full h-9 px-2 pr-8 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                style={{ lineHeight: '36px' }}
              />
              <div className="absolute right-1 top-0 h-full flex flex-col justify-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setMinutes(Math.min(59, minutes + 1))}
                  className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setMinutes(Math.max(0, minutes - 1))}
                  className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

          {/* Target Time Mode Input */}
          {mode === 'target' && (
            <div>
              <label className="block mb-1">Zielzeit:</label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-32 h-9 px-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          )}
        </div>

        {/* Right Side - Info Display */}
        <InfoBox
          countdownActive={countdownActive}
          mode={mode}
          hours={hours}
          minutes={minutes}
          targetTime={targetTime}
          remainingTime={remainingTime}
          countdownStartTime={countdownStartTime}
          targetDate={targetDate}
        />
      </div>
      </div>
    </>
  );
}

// Info Box Component
function InfoBox({ countdownActive, mode, hours, minutes, targetTime, remainingTime, countdownStartTime, targetDate }: {
  countdownActive: boolean;
  mode: 'duration' | 'target';
  hours: number;
  minutes: number;
  targetTime: string;
  remainingTime?: string;
  countdownStartTime?: Date | null;
  targetDate?: Date | null;
}) {
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate target time
  const calculateTargetTime = () => {
    const now = new Date();
    if (mode === 'duration') {
      const target = new Date(now.getTime() + (hours * 60 * 60 + minutes * 60) * 1000);
      return target.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } else {
      return targetTime;
    }
  };

  return (
    <div className="w-52 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3 flex-shrink-0">
      <div className="text-sm font-semibold text-white/80 mb-3">Info</div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Aktuelle Uhrzeit:</span>
          <span className="font-medium">{currentTime}</span>
        </div>

        {!countdownActive && (
          <div className="flex justify-between">
            <span className="text-white/60">Voraussichtl. Ziel:</span>
            <span className="font-medium">{calculateTargetTime()}</span>
          </div>
        )}

        {countdownActive && (
          <>
            <div className="flex justify-between">
              <span className="text-white/60">Countdown:</span>
              <span className="font-medium">{remainingTime || '--:--:--'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Startzeit:</span>
              <span className="font-medium">
                {countdownStartTime ? countdownStartTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Zielzeit:</span>
              <span className="font-medium">
                {targetDate ? targetDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
