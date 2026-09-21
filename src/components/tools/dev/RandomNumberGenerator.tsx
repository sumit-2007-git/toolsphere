import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Dices, Copy, RefreshCw, Sparkles, Coins } from 'lucide-react';

export const RandomNumberGenerator: React.FC = () => {
  const { addToast } = useApp();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);

  // Dice & Coin state
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [coinResult, setCoinResult] = useState<'HEADS' | 'TAILS' | null>(null);

  const handleGenerate = () => {
    if (min >= max) {
      addToast('error', 'Minimum must be less than Maximum.');
      return;
    }

    const availableRange = max - min + 1;
    if (!allowDuplicates && count > availableRange) {
      addToast('error', `Cannot generate ${count} unique numbers from range of size ${availableRange}.`);
      return;
    }

    const nums: number[] = [];
    const used = new Set<number>();

    while (nums.length < count) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const val = min + (array[0] % availableRange);

      if (!allowDuplicates) {
        if (!used.has(val)) {
          used.add(val);
          nums.push(val);
        }
      } else {
        nums.push(val);
      }
    }

    if (sortOrder === 'asc') nums.sort((a, b) => a - b);
    if (sortOrder === 'desc') nums.sort((a, b) => b - a);

    setGeneratedNumbers(nums);
    addToast('success', `Generated ${nums.length} random numbers!`);
  };

  const handleRollDice = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const roll = (array[0] % 6) + 1;
    setDiceRoll(roll);
    addToast('info', `Rolled a ${roll}!`);
  };

  const handleFlipCoin = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const res = array[0] % 2 === 0 ? 'HEADS' : 'TAILS';
    setCoinResult(res);
    addToast('info', `Coin landed on ${res}!`);
  };

  const handleCopyNumbers = () => {
    if (generatedNumbers.length === 0) return;
    navigator.clipboard.writeText(generatedNumbers.join(', '));
    addToast('success', 'Numbers copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Range Config Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Minimum (Min)
            </label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Maximum (Max)
            </label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              How Many Numbers?
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold font-mono"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span>Allow Duplicates</span>
            </label>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Sort:</span>
              {(['none', 'asc', 'desc'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSortOrder(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    sortOrder === s ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Numbers</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      {generatedNumbers.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Results ({generatedNumbers.length} numbers)
            </span>
            <button
              type="button"
              onClick={handleCopyNumbers}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {generatedNumbers.map((num, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-mono font-black text-xl flex items-center justify-center shadow-xs"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bonus Fun Mini-Tools: Dice & Coin Flip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dice Roller */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-2xl">
              {diceRoll !== null ? diceRoll : <Dices className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">6-Sided Dice</h4>
              <p className="text-xs text-slate-400">Standard fair random dice roll</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRollDice}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
          >
            Roll Dice
          </button>
        </div>

        {/* Coin Flip */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-black text-xs">
              {coinResult ? coinResult.substring(0, 1) : <Coins className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Coin Flipper</h4>
              <p className="text-xs text-slate-400">{coinResult ? `Landed on ${coinResult}` : 'Heads or Tails'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFlipCoin}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
          >
            Flip Coin
          </button>
        </div>
      </div>
    </div>
  );
};
