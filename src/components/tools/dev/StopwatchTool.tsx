import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { Watch, Play, Pause, RotateCcw, Flag, Copy } from 'lucide-react';

interface Lap {
  index: number;
  lapTime: number;
  overallTime: number;
}

export const StopwatchTool: React.FC = () => {
  const { addToast } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - elapsedTime;
      const update = () => {
        setElapsedTime(performance.now() - startTimeRef.current);
        animationFrameRef.current = requestAnimationFrame(update);
      };
      animationFrameRef.current = requestAnimationFrame(update);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;
    const lastLapOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const lapTime = elapsedTime - lastLapOverall;
    const newLap: Lap = {
      index: laps.length + 1,
      lapTime,
      overallTime: elapsedTime,
    };
    setLaps([newLap, ...laps]);
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const fastestLap = laps.length > 1 ? Math.min(...laps.map(l => l.lapTime)) : null;
  const slowestLap = laps.length > 1 ? Math.max(...laps.map(l => l.lapTime)) : null;

  const copyLaps = () => {
    if (laps.length === 0) return;
    const text = laps.map(l => `Lap ${l.index}: ${formatTime(l.lapTime)} (Total: ${formatTime(l.overallTime)})`).join('\n');
    navigator.clipboard.writeText(text);
    addToast('success', 'Laps copied to clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stopwatch Main Display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-8">
        <div className="font-mono font-black text-5xl sm:text-7xl text-slate-900 dark:text-white select-none">
          {formatTime(elapsedTime)}
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
                <span>{elapsedTime > 0 ? 'Resume' : 'Start'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleLap}
            disabled={!isRunning}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Record Lap"
          >
            <Flag className="w-5 h-5" />
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

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recorded Laps ({laps.length})
            </span>
            <button
              type="button"
              onClick={copyLaps}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Table</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
            {laps.map(lap => {
              let tag = '';
              let tagColor = '';
              if (fastestLap && lap.lapTime === fastestLap) {
                tag = 'Fastest';
                tagColor = 'text-emerald-600 dark:text-emerald-400 font-bold';
              } else if (slowestLap && lap.lapTime === slowestLap) {
                tag = 'Slowest';
                tagColor = 'text-amber-600 dark:text-amber-400 font-bold';
              }

              return (
                <div key={lap.index} className="py-2.5 flex items-center justify-between font-mono text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-sans font-semibold w-14">Lap {lap.index}</span>
                    <span className={tagColor}>{tag}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      +{formatTime(lap.lapTime)}
                    </span>
                    <span className="text-slate-400">
                      {formatTime(lap.overallTime)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
