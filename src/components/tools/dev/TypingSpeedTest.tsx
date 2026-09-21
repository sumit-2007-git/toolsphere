import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import confetti from 'canvas-confetti';
import { Gauge, RefreshCw, Trophy, CheckCircle, AlertCircle } from 'lucide-react';

const TEST_TEXT = "The quick brown fox jumps over the lazy dog. Fast keyboard typists master accurate finger placement and rhythmic keystrokes. Developing strong typing speed enhances software development productivity, document drafting efficiency, and general digital workflow fluency. Keep your focus steady and maintain consistent pace.";

export const TypingSpeedTest: React.FC = () => {
  const { addToast } = useApp();
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: any = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      addToast('success', 'Typing test completed!');
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isActive && !isFinished) {
      setIsActive(true);
    }
    setUserInput(val);

    if (val.length >= TEST_TEXT.length) {
      setIsActive(false);
      setIsFinished(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleReset = () => {
    setUserInput('');
    setTimeLeft(60);
    setIsActive(false);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Stats calculation
  const timeElapsed = 60 - timeLeft || 1;
  const correctChars = userInput.split('').filter((c, i) => c === TEST_TEXT[i]).length;
  const wrongChars = userInput.length - correctChars;
  const wordsTyped = correctChars / 5;
  const wpm = Math.round((wordsTyped / (timeElapsed / 60))) || 0;
  const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Live Metrics Header */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">
            {wpm}
          </span>
          <p className="text-xs text-slate-400 mt-0.5">WPM (Speed)</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {accuracy}%
          </span>
          <p className="text-xs text-slate-400 mt-0.5">Accuracy</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
            {timeLeft}s
          </span>
          <p className="text-xs text-slate-400 mt-0.5">Time Left</p>
        </div>
      </div>

      {/* Typing Board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Render characters with coloring */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-mono text-base sm:text-lg leading-relaxed select-none">
          {TEST_TEXT.split('').map((char, index) => {
            let color = 'text-slate-400 dark:text-slate-500';
            let bg = '';
            if (index < userInput.length) {
              if (userInput[index] === char) {
                color = 'text-emerald-600 dark:text-emerald-400 font-semibold';
              } else {
                color = 'text-red-600 dark:text-red-400 font-semibold';
                bg = 'bg-red-100 dark:bg-red-950/60 rounded';
              }
            } else if (index === userInput.length) {
              bg = 'bg-brand-500/30 underline';
            }
            return (
              <span key={index} className={`${color} ${bg}`}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Typing Input */}
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            disabled={isFinished}
            value={userInput}
            onChange={handleInputChange}
            placeholder={isActive ? 'Keep typing fast...' : 'Start typing here to begin 60-second test...'}
            className="w-full px-4 py-3 rounded-xl border-2 border-brand-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base focus:outline-none focus:ring-4 focus:ring-brand-500/20"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {correctChars} correct • {wrongChars} errors
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restart Test</span>
            </button>
          </div>
        </div>

        {/* Completion Modal / Scorecard */}
        {isFinished && (
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white text-center space-y-3 shadow-xl">
            <Trophy className="w-10 h-10 text-yellow-300 mx-auto" />
            <h3 className="text-xl font-extrabold">Typing Test Finished!</h3>
            <p className="text-sm text-brand-100">
              You typed at <strong className="text-white text-lg">{wpm} WPM</strong> with <strong className="text-white text-lg">{accuracy}% accuracy</strong>!
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 px-5 py-2 rounded-xl bg-white text-brand-600 font-bold text-xs hover:bg-brand-50 shadow-md"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
