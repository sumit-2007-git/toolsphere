import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import confetti from 'canvas-confetti';
import { Clock, Play, Pause, RotateCcw, Bell } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const { addToast } = useApp();
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 mins default
  const [remaining, setRemaining] = useState(300);
  const [isRunning, setIsRunning] = useState(false);

  // Custom preset minutes
  const [customMins, setCustomMins] = useState(5);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880; // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } else if (remaining === 0 && isRunning) {
      setIsRunning(false);
      playBeep();
      confetti({ particleCount: 100, spread: 80 });
      addToast('success', 'Timer completed!');
    }
    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  };

  const setPreset = (mins: number) => {
    setIsRunning(false);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemaining(secs);
  };

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Presets Bar */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[1, 5, 10, 15, 25, 45, 60].map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setPreset(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              totalSeconds === m * 60
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            {m}m
          </button>
        ))}
      </div>

      {/* Clock Display Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-8">
        <div className="flex items-center justify-center gap-3 sm:gap-6 font-mono font-black text-slate-900 dark:text-white select-none">
          {hours > 0 && (
            <>
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-7xl">{pad(hours)}</span>
                <span className="text-[10px] font-sans uppercase font-bold text-slate-400 mt-1">Hours</span>
              </div>
              <span className="text-4xl sm:text-6xl text-slate-300 dark:text-slate-700 -mt-4">:</span>
            </>
          )}

          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl">{pad(minutes)}</span>
            <span className="text-[10px] font-sans uppercase font-bold text-slate-400 mt-1">Minutes</span>
          </div>

          <span className="text-4xl sm:text-6xl text-slate-300 dark:text-slate-700 -mt-4">:</span>

          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl text-brand-600 dark:text-brand-400">{pad(seconds)}</span>
            <span className="text-[10px] font-sans uppercase font-bold text-slate-400 mt-1">Seconds</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleStartPause}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
