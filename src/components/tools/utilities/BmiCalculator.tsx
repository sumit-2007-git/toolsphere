import React, { useState } from 'react';
import { Activity, HeartPulse, Sparkles } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Metric
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);

  // Imperial
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(9);
  const [weightLbs, setWeightLbs] = useState(154);

  // Calculate BMI
  let bmi = 0;
  let healthyMinKg = 0;
  let healthyMaxKg = 0;

  if (unit === 'metric') {
    const heightM = heightCm / 100;
    if (heightM > 0) {
      bmi = weightKg / (heightM * heightM);
      healthyMinKg = 18.5 * (heightM * heightM);
      healthyMaxKg = 24.9 * (heightM * heightM);
    }
  } else {
    const totalInches = heightFeet * 12 + heightInches;
    if (totalInches > 0) {
      bmi = (weightLbs / (totalInches * totalInches)) * 703;
      const minLbs = (18.5 * (totalInches * totalInches)) / 703;
      const maxLbs = (24.9 * (totalInches * totalInches)) / 703;
      healthyMinKg = minLbs * 0.453592;
      healthyMaxKg = maxLbs * 0.453592;
    }
  }

  const roundedBmi = parseFloat(bmi.toFixed(1));

  let category = 'Normal Weight';
  let badgeColor = 'bg-emerald-500 text-white';
  let gaugePercent = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));

  if (bmi < 18.5) {
    category = 'Underweight';
    badgeColor = 'bg-sky-500 text-white';
  } else if (bmi < 25) {
    category = 'Normal (Healthy)';
    badgeColor = 'bg-emerald-500 text-white';
  } else if (bmi < 30) {
    category = 'Overweight';
    badgeColor = 'bg-amber-500 text-white';
  } else {
    category = 'Obese';
    badgeColor = 'bg-red-500 text-white';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-center">
        <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center">
          <button
            type="button"
            onClick={() => setUnit('metric')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              unit === 'metric' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Metric (cm, kg)
          </button>
          <button
            type="button"
            onClick={() => setUnit('imperial')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              unit === 'imperial' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Imperial (ft, in, lbs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {unit === 'metric' ? (
            <>
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Height</span>
                  <span className="font-mono text-brand-600 font-bold">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Weight</span>
                  <span className="font-mono text-brand-600 font-bold">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Feet
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Inches
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Weight (Pounds)</span>
                  <span className="font-mono text-brand-600 font-bold">{weightLbs} lbs</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="350"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>
            </>
          )}

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
            Healthy Target Range for your height: <strong className="text-slate-800 dark:text-slate-200">{healthyMinKg.toFixed(1)} kg - {healthyMaxKg.toFixed(1)} kg</strong>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-between text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Your Body Mass Index (BMI)
          </span>

          <div className="my-6">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono">
              {roundedBmi}
            </span>
            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                {category}
              </span>
            </div>
          </div>

          {/* Color-coded Gauge Bar */}
          <div className="w-full space-y-2">
            <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-red-500">
              <div
                className="absolute -top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white shadow-md transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${gaugePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>18.5 (Under)</span>
              <span>25 (Normal)</span>
              <span>30 (Over)</span>
              <span>35+ (Obese)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
