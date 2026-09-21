import React, { useState } from 'react';
import { ArrowLeftRight, Ruler, Scale, Thermometer, Gauge, Box, HardDrive } from 'lucide-react';

type UnitType = 'length' | 'weight' | 'temperature' | 'speed' | 'digital';

interface UnitDef {
  id: string;
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNIT_CATEGORIES: { id: UnitType; name: string; icon: any; units: UnitDef[] }[] = [
  {
    id: 'length',
    name: 'Length',
    icon: <Ruler className="w-4 h-4" />,
    units: [
      { id: 'm', name: 'Meters (m)', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Kilometers (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', name: 'Centimeters (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'mm', name: 'Millimeters (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mi', name: 'Miles (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'yd', name: 'Yards (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'ft', name: 'Feet (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'in', name: 'Inches (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ]
  },
  {
    id: 'weight',
    name: 'Weight & Mass',
    icon: <Scale className="w-4 h-4" />,
    units: [
      { id: 'kg', name: 'Kilograms (kg)', toBase: v => v, fromBase: v => v },
      { id: 'g', name: 'Grams (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mg', name: 'Milligrams (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { id: 'ton', name: 'Metric Tons (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'lb', name: 'Pounds (lb)', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', toBase: v => v * 0.028349523, fromBase: v => v / 0.028349523 },
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: <Thermometer className="w-4 h-4" />,
    units: [
      { id: 'c', name: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Fahrenheit (°F)', toBase: v => (v - 32) * (5 / 9), fromBase: v => v * (9 / 5) + 32 },
      { id: 'k', name: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: <Gauge className="w-4 h-4" />,
    units: [
      { id: 'kmh', name: 'Kilometers per hour (km/h)', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', name: 'Miles per hour (mph)', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'ms', name: 'Meters per second (m/s)', toBase: v => v, fromBase: v => v },
      { id: 'knot', name: 'Knots (kn)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ]
  },
  {
    id: 'digital',
    name: 'Digital Storage',
    icon: <HardDrive className="w-4 h-4" />,
    units: [
      { id: 'b', name: 'Bytes (B)', toBase: v => v, fromBase: v => v },
      { id: 'kb', name: 'Kilobytes (KB)', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', name: 'Megabytes (MB)', toBase: v => v * 1024 ** 2, fromBase: v => v / 1024 ** 2 },
      { id: 'gb', name: 'Gigabytes (GB)', toBase: v => v * 1024 ** 3, fromBase: v => v / 1024 ** 3 },
      { id: 'tb', name: 'Terabytes (TB)', toBase: v => v * 1024 ** 4, fromBase: v => v / 1024 ** 4 },
    ]
  }
];

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitType>('length');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('mi');
  const [value, setValue] = useState('1');

  const currentCategory = UNIT_CATEGORIES.find(c => c.id === category)!;

  const handleCategorySelect = (cat: UnitType) => {
    setCategory(cat);
    const c = UNIT_CATEGORIES.find(x => x.id === cat)!;
    setFromUnit(c.units[0].id);
    setToUnit(c.units[1] ? c.units[1].id : c.units[0].id);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const calculateResult = (): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';

    const fromDef = currentCategory.units.find(u => u.id === fromUnit);
    const toDef = currentCategory.units.find(u => u.id === toUnit);

    if (!fromDef || !toDef) return '0';

    const baseVal = fromDef.toBase(num);
    const converted = toDef.fromBase(baseVal);

    if (Math.abs(converted) < 0.0001 && converted !== 0) {
      return converted.toExponential(4);
    }
    return parseFloat(converted.toFixed(6)).toString();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {UNIT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategorySelect(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Converter Board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
          {/* From Side */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              From
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            >
              {currentCategory.units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:col-span-1">
            <button
              type="button"
              onClick={swapUnits}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              title="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Side */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              To (Result)
            </label>
            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-brand-600 dark:text-brand-400 text-lg font-bold truncate">
              {calculateResult()}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            >
              {currentCategory.units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Reference Equivalency Banner */}
        <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/60 text-center text-xs font-semibold text-brand-900 dark:text-brand-200">
          1 {currentCategory.units.find(u => u.id === fromUnit)?.name.split('(')[0].trim()} ={' '}
          {(() => {
            const f = currentCategory.units.find(u => u.id === fromUnit)!;
            const t = currentCategory.units.find(u => u.id === toUnit)!;
            return parseFloat(t.fromBase(f.toBase(1)).toFixed(6)).toString();
          })()}{' '}
          {currentCategory.units.find(u => u.id === toUnit)?.name.split('(')[0].trim()}
        </div>
      </div>
    </div>
  );
};
