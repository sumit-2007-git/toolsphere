import React, { useState } from 'react';
import { Percent, ArrowUpRight, ArrowDownRight, GraduationCap } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  // Calc 1: X% of Y
  const [c1Percent, setC1Percent] = useState('18');
  const [c1Total, setC1Total] = useState('500');

  // Calc 2: X is what % of Y
  const [c2Val, setC2Val] = useState('45');
  const [c2Total, setC2Total] = useState('180');

  // Calc 3: Percentage change from A to B
  const [c3From, setC3From] = useState('80');
  const [c3To, setC3To] = useState('120');

  // Calc 4: Marks Percentage
  const [marksObtained, setMarksObtained] = useState('435');
  const [totalMarks, setTotalMarks] = useState('500');

  // Results calculation
  const c1Result = ((parseFloat(c1Percent) || 0) * (parseFloat(c1Total) || 0)) / 100;
  const c2Result = (parseFloat(c2Total) || 0) !== 0 ? ((parseFloat(c2Val) || 0) / (parseFloat(c2Total) || 1)) * 100 : 0;
  const c3Diff = (parseFloat(c3To) || 0) - (parseFloat(c3From) || 0);
  const c3Percent = (parseFloat(c3From) || 0) !== 0 ? (c3Diff / (parseFloat(c3From) || 1)) * 100 : 0;
  const marksPercent = (parseFloat(totalMarks) || 0) !== 0 ? ((parseFloat(marksObtained) || 0) / (parseFloat(totalMarks) || 1)) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calculator 1: What is X% of Y? */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">What is X% of Y?</h3>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-500">What is</span>
            <input
              type="number"
              value={c1Percent}
              onChange={(e) => setC1Percent(e.target.value)}
              className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">% of</span>
            <input
              type="number"
              value={c1Total}
              onChange={(e) => setC1Total(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">?</span>
          </div>

          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-800 dark:text-brand-300">Answer:</span>
            <span className="text-lg font-black text-brand-600 dark:text-brand-400 font-mono">
              {parseFloat(c1Result.toFixed(4))}
            </span>
          </div>
        </div>

        {/* Calculator 2: X is what % of Y? */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">X is what % of Y?</h3>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <input
              type="number"
              value={c2Val}
              onChange={(e) => setC2Val(e.target.value)}
              className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">is what % of</span>
            <input
              type="number"
              value={c2Total}
              onChange={(e) => setC2Total(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">?</span>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">Percentage:</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {parseFloat(c2Result.toFixed(2))}%
            </span>
          </div>
        </div>

        {/* Calculator 3: Percentage Change */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            {c3Percent >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            )}
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Percentage Increase / Decrease</h3>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-500">From</span>
            <input
              type="number"
              value={c3From}
              onChange={(e) => setC3From(e.target.value)}
              className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">to</span>
            <input
              type="number"
              value={c3To}
              onChange={(e) => setC3To(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            c3Percent >= 0
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60'
          }`}>
            <span className="text-xs font-semibold">
              {c3Percent >= 0 ? 'Increase (+):' : 'Decrease (-):'}
            </span>
            <span className="text-lg font-black font-mono">
              {c3Percent >= 0 ? `+${parseFloat(c3Percent.toFixed(2))}%` : `${parseFloat(c3Percent.toFixed(2))}%`}
            </span>
          </div>
        </div>

        {/* Calculator 4: Student Exam Marks Percentage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Exam Marks Percentage</h3>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-500">Marks:</span>
            <input
              type="number"
              value={marksObtained}
              onChange={(e) => setMarksObtained(e.target.value)}
              className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">out of</span>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-800 dark:text-purple-300">Grade Score:</span>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
              {parseFloat(marksPercent.toFixed(2))}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
