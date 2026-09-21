import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Palette, Copy, Check, Pipette, Sparkles } from 'lucide-react';

export const ColorPickerTool: React.FC = () => {
  const { addToast } = useApp();
  const [colorHex, setColorHex] = useState('#6366f1');

  // Convert HEX to RGB
  const hex = colorHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  // Convert RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }
  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  // CMYK
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = k === 1 ? 0 : Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = k === 1 ? 0 : Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = k === 1 ? 0 : Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  const kPct = Math.round(k * 100);

  // Luminance & WCAG Contrast
  const getLuminance = (red: number, green: number, blue: number) => {
    const a = [red, green, blue].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(r, g, b);
  const contrastWithWhite = ((1.0 + 0.05) / (lum + 0.05)).toFixed(2);
  const contrastWithBlack = ((lum + 0.05) / (0.0 + 0.05)).toFixed(2);

  const copyVal = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    addToast('success', `${label} copied!`);
  };

  // Complementary color
  const compHDeg = (hDeg + 180) % 360;
  const compColor = `hsl(${compHDeg}, ${sPct}%, ${lPct}%)`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visual Canvas Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-36 h-36 rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center transition-colors"
            style={{ backgroundColor: colorHex }}
          >
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <span className="text-xs font-semibold text-slate-400">Click swatch to pick color</span>
        </div>

        <div className="md:col-span-2 space-y-3">
          {[
            { label: 'HEX', value: colorHex.toUpperCase() },
            { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
            { label: 'HSL', value: `hsl(${hDeg}, ${sPct}%, ${lPct}%)` },
            { label: 'CMYK', value: `cmyk(${c}%, ${m}%, ${y}%, ${kPct}%)` },
          ].map(fmt => (
            <div
              key={fmt.label}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <span className="w-12 text-xs font-bold text-slate-400">{fmt.label}</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{fmt.value}</span>
              </div>
              <button
                type="button"
                onClick={() => copyVal(fmt.value, fmt.label)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* WCAG Contrast & Harmony */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contrast Checker */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">WCAG Accessibility Contrast</h4>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-4 rounded-xl text-center font-bold"
              style={{ backgroundColor: colorHex, color: '#ffffff' }}
            >
              <p className="text-xs">White Text</p>
              <p className="text-lg font-black">{contrastWithWhite}:1</p>
              <span className="text-[10px] uppercase font-bold">
                {parseFloat(contrastWithWhite) >= 4.5 ? '✓ Passes AA' : '✕ Poor'}
              </span>
            </div>

            <div
              className="p-4 rounded-xl text-center font-bold"
              style={{ backgroundColor: colorHex, color: '#000000' }}
            >
              <p className="text-xs">Black Text</p>
              <p className="text-lg font-black">{contrastWithBlack}:1</p>
              <span className="text-[10px] uppercase font-bold">
                {parseFloat(contrastWithBlack) >= 4.5 ? '✓ Passes AA' : '✕ Poor'}
              </span>
            </div>
          </div>
        </div>

        {/* Color Palette Presets */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Complementary Palette</h4>
          <div className="flex items-center gap-2 h-20 rounded-xl overflow-hidden p-1 bg-slate-100 dark:bg-slate-800">
            <div
              className="flex-1 h-full rounded-lg flex items-end p-2 cursor-pointer"
              style={{ backgroundColor: colorHex }}
              onClick={() => copyVal(colorHex, 'Base Color')}
            >
              <span className="text-[10px] font-mono text-white/90 drop-shadow">Base</span>
            </div>
            <div
              className="flex-1 h-full rounded-lg flex items-end p-2 cursor-pointer"
              style={{ backgroundColor: compColor }}
              onClick={() => copyVal(compColor, 'Complementary')}
            >
              <span className="text-[10px] font-mono text-white/90 drop-shadow">Opposite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
