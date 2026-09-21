import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Sparkles, Wifi, Link, Mail, Phone } from 'lucide-react';

export const QrGenerator: React.FC = () => {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'url' | 'wifi' | 'email' | 'phone'>('url');

  // Input states
  const [text, setText] = useState('https://toolsphere.app');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // QR custom styling
  const [darkColor, setDarkColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [size, setSize] = useState(300);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getComputedPayload = (): string => {
    if (tab === 'url') return text;
    if (tab === 'wifi') return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
    if (tab === 'email') return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
    if (tab === 'phone') return `tel:${phoneNumber}`;
    return text;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const payload = getComputedPayload() || 'https://toolsphere.app';
    QRCode.toCanvas(canvas, payload, {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'H',
    }, (err) => {
      if (err) console.error(err);
    });
  }, [tab, text, wifiSsid, wifiPassword, wifiEncryption, emailTo, emailSubject, phoneNumber, darkColor, lightColor, size]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
    addToast('success', 'QR Code PNG downloaded!');
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard?.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          addToast('success', 'QR Code copied to clipboard!');
        }
      });
    } catch {
      addToast('error', 'Clipboard copy not supported on this browser.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'url', label: 'URL / Text', icon: <Link className="w-3.5 h-3.5" /> },
          { id: 'wifi', label: 'WiFi Network', icon: <Wifi className="w-3.5 h-3.5" /> },
          { id: 'email', label: 'Email Address', icon: <Mail className="w-3.5 h-3.5" /> },
          { id: 'phone', label: 'Phone Call', icon: <Phone className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          {tab === 'url' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Website URL or Plain Text
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://yourwebsite.com or any text content..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
          )}

          {tab === 'wifi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  WiFi Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="Home_WiFi_5G"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="WiFi Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Security Type
                  </label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Inquiry regarding services"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          )}

          {tab === 'phone' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number with Country Code
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          )}

          {/* Color & Styling Options */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                QR Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{darkColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{lightColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right QR Preview & Action Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-between text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Real-time QR Preview
          </span>

          <div className="p-4 rounded-2xl bg-white shadow-md border border-slate-200/80 my-4">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
          </div>

          <div className="w-full space-y-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Code (PNG)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
