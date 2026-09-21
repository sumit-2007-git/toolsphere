import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Key, Copy, RefreshCw, Check, ShieldCheck, ShieldAlert } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const { addToast } = useApp();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (includeUpper) chars += upper;
    if (includeLower) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (excludeAmbiguous) {
      // Remove ambiguous characters: I, l, 1, O, 0, o
      chars = chars.replace(/[Il1O0o]/g, '');
    }

    if (!chars) {
      setPassword('');
      return;
    }

    let generated = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += chars[array[i] % chars.length];
    }

    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    addToast('success', 'Password copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate entropy score
  let poolSize = 0;
  if (includeUpper) poolSize += 26;
  if (includeLower) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += 30;
  const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-red-500';
  let strengthTextColor = 'text-red-500';
  let strengthPercent = Math.min(100, Math.round((entropy / 100) * 100));

  if (entropy >= 80) {
    strengthLabel = 'Very Strong / Unbreakable';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-500';
  } else if (entropy >= 60) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-indigo-500';
    strengthTextColor = 'text-indigo-500';
  } else if (entropy >= 40) {
    strengthLabel = 'Moderate';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-500';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Generated Display Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-slate-900 dark:text-white break-all select-all">
            {password || 'Select options below'}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={generatePassword}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm text-xs sm:text-sm transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-500">Security Strength</span>
            <span className={strengthTextColor}>{strengthLabel} ({entropy} bits entropy)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full ${strengthColor} transition-all duration-300`}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>Password Length</span>
            <span className="font-mono text-sm px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold">
              {length} characters
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-brand-600 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Uppercase Letters (A-Z)', state: includeUpper, set: setIncludeUpper },
            { label: 'Lowercase Letters (a-z)', state: includeLower, set: setIncludeLower },
            { label: 'Numbers (0-9)', state: includeNumbers, set: setIncludeNumbers },
            { label: 'Symbols (!@#$%^&*)', state: includeSymbols, set: setIncludeSymbols },
            { label: 'Exclude Ambiguous (0, O, 1, l, I)', state: excludeAmbiguous, set: setExcludeAmbiguous },
          ].map((item, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                item.state
                  ? 'border-brand-500/50 bg-brand-50/40 dark:bg-brand-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={item.state}
                onChange={(e) => item.set(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 accent-brand-600"
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
