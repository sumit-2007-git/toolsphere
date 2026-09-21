import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Heart, Star } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) {
      setStats(null);
      return;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Next birthday calculation
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Western Zodiac
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    let zodiac = 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiac = 'Aquarius';
    else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) zodiac = 'Pisces';
    else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiac = 'Aries';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiac = 'Taurus';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiac = 'Gemini';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiac = 'Cancer';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiac = 'Leo';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiac = 'Virgo';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiac = 'Libra';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiac = 'Scorpio';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiac = 'Sagittarius';

    // Chinese Zodiac
    const chineseZodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const chineseZodiac = chineseZodiacs[(birth.getFullYear() - 4) % 12];

    setStats({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      daysUntilNext,
      zodiac,
      chineseZodiac
    });
  }, [birthDate]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Date Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Select Your Date of Birth
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="date"
            value={birthDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-xs text-slate-400">
            Real-time calculation of exact age and lifetime milestones
          </span>
        </div>
      </div>

      {stats && (
        <div className="space-y-6 animate-in fade-in">
          {/* Primary Age Display */}
          <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-brand-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-100 mb-2">
              Your Current Exact Age
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                <span className="text-3xl sm:text-5xl font-black">{stats.years}</span>
                <p className="text-xs font-semibold text-brand-100 mt-1">Years</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                <span className="text-3xl sm:text-5xl font-black">{stats.months}</span>
                <p className="text-xs font-semibold text-brand-100 mt-1">Months</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                <span className="text-3xl sm:text-5xl font-black">{stats.days}</span>
                <p className="text-xs font-semibold text-brand-100 mt-1">Days</p>
              </div>
            </div>
          </div>

          {/* Next Birthday Banner */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Next Birthday Celebration</p>
                <p className="text-xs text-slate-500">
                  Only <span className="font-bold text-amber-600 dark:text-amber-400">{stats.daysUntilNext} days</span> left until your next milestone!
                </p>
              </div>
            </div>
            <span className="text-2xl">🎂</span>
          </div>

          {/* Detailed Lifetime Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Days', value: stats.totalDays.toLocaleString() },
              { label: 'Total Weeks', value: stats.totalWeeks.toLocaleString() },
              { label: 'Total Hours', value: stats.totalHours.toLocaleString() },
              { label: 'Total Minutes', value: stats.totalMinutes.toLocaleString() },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Zodiac & Astrological details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Sun Sign (Zodiac)</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{stats.zodiac}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Chinese Zodiac Animal</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">Year of the {stats.chineseZodiac}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
