import React, { useState } from 'react';
import { ShieldCheck, Zap, Lock, Sparkles, ChevronDown, CheckCircle, Globe2, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SeoSection: React.FC = () => {
  const { setActiveToolId } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is ToolSphere 100% free to use with no limits?',
      a: 'Yes, ToolSphere is completely free with zero subscription fees, no credit card required, and no hidden trial limits. You can merge, split, compress, and convert as many files as you need without any restrictions.'
    },
    {
      q: 'Are my uploaded PDF documents and personal data private and secure?',
      a: 'Absolutely. Unlike legacy online tools that upload your sensitive documents to remote third-party cloud servers, ToolSphere processes everything 100% client-side inside your browser sandbox using WebAssembly and HTML5 APIs. Your files never leave your device.'
    },
    {
      q: 'Do I need to register, create an account, or provide an email?',
      a: 'No account, sign-up, or email address is needed. You get instant one-click access to all 42+ tools immediately upon opening the website.'
    },
    {
      q: 'Can ToolSphere convert PDF to Word, Excel, PowerPoint, and JPG?',
      a: 'Yes! ToolSphere features a complete document conversion suite supporting two-way conversions: Convert to PDF (JPG to PDF, Word to PDF, PowerPoint to PDF, Excel to PDF, HTML to PDF) and Convert from PDF (PDF to JPG, PDF to Word, PDF to PowerPoint, PDF to Excel, PDF to PDF/A).'
    },
    {
      q: 'Does ToolSphere work on mobile phones and tablets?',
      a: 'Yes! ToolSphere is fully responsive and optimized for all devices, including iPhones, iPads, Android smartphones, Windows laptops, and Macs. It works in all modern browsers including Chrome, Safari, Firefox, and Edge.'
    }
  ];

  const popularKeywords = [
    { name: 'Merge PDF Online', id: 'merge-pdf' },
    { name: 'Split PDF Pages', id: 'split-pdf' },
    { name: 'Compress PDF File', id: 'compress-pdf' },
    { name: 'PDF to Word Doc', id: 'pdf-to-word' },
    { name: 'Word to PDF Converter', id: 'word-to-pdf' },
    { name: 'QR Code Generator', id: 'qr-generator' },
    { name: 'Strong Password Maker', id: 'password-generator' },
    { name: 'Free Image Compressor', id: 'image-compressor' },
    { name: 'Word & Character Counter', id: 'word-counter' },
    { name: 'JSON Formatter & Validator', id: 'json-formatter' },
    { name: 'Age Calculator by DOB', id: 'age-calculator' },
    { name: 'Body Mass Index (BMI)', id: 'bmi-calculator' }
  ];

  return (
    <section className="mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800/80 space-y-16">
      {/* Value Pillars */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why People Love ToolSphere</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          The Fastest, Most Secure Online Utility Suite
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Engineered for privacy, speed, and unlimited workflow productivity. No servers, no file limits, no ads tracking you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your documents and data are processed entirely on your local machine using modern WebAssembly. Nothing is ever uploaded to remote servers or stored in third-party clouds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Upload Lag & Instant Speed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Skip slow file uploads and waiting queues. High-throughput in-memory processing delivers instant results, even for heavy multi-page PDF documents and images.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Works Everywhere, Offline Capable</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Enjoy full desktop and mobile compatibility across Windows, Mac, Linux, iOS, and Android. Run tools offline without interruption anytime, anywhere.
          </p>
        </div>
      </div>

      {/* SEO Keyword Cloud */}
      <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Popular Online Utility Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularKeywords.map(k => (
            <button
              key={k.id}
              type="button"
              onClick={() => setActiveToolId(k.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200/80 dark:border-slate-700 transition-all hover:scale-105"
            >
              {k.name} →
            </button>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (Matching JSON-LD FAQ Schema) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in-50 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
