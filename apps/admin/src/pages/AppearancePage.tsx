import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Sun, Moon, Check } from 'lucide-react';

export const AppearancePage: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  const lightTokens = [
    { name: 'Primary Forest Green', val: '#0D5428' },
    { name: 'Dark Green', val: '#073B21' },
    { name: 'Warm Cream Background', val: '#FFF9EC' },
    { name: 'Pure White Surface', val: '#FFFFFF' },
    { name: 'Restrained Gold Accent', val: '#C99B36' },
    { name: 'Deep Botanical Text', val: '#10271A' },
  ];

  const darkTokens = [
    { name: 'Primary Sage Green', val: '#77A76A' },
    { name: 'Deep Midnight Green', val: '#0C1B12' },
    { name: 'Dark Surface Card', val: '#14291C' },
    { name: 'Forest Border', val: '#24422F' },
    { name: 'Warm Gold Glow', val: '#D4AA52' },
    { name: 'Parchment Text', val: '#F7F1E5' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Appearance & Theme Tokens
        </h2>
        <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
          Manage light and dark mode design system tokens for both the Mobile App and Admin Dashboard.
        </p>
      </div>

      {/* Current Theme Selector */}
      <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Active Theme
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-start justify-between transition ${
              theme === 'light'
                ? 'border-[#0D5428] ring-2 ring-[#0D5428]/20 bg-[#FFF9EC]'
                : 'border-[#E8DFC8] dark:border-[#2B4B36]'
            }`}
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0D5428] text-white flex items-center justify-center">
                <Sun size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#10271A]">Light Warm Theme</h4>
                <p className="text-xs text-[#5A6D60]">Parchment cream, deep forest green, and gold</p>
              </div>
            </div>
            {theme === 'light' && <Check size={18} className="text-[#0D5428]" />}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-start justify-between transition ${
              theme === 'dark'
                ? 'border-[#77A76A] ring-2 ring-[#77A76A]/20 bg-[#0C1B12]'
                : 'border-[#E8DFC8] dark:border-[#2B4B36]'
            }`}
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#77A76A] text-[#0C1B12] flex items-center justify-center">
                <Moon size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#F7F1E5]">Dark Forest Theme</h4>
                <p className="text-xs text-[#8CAE99]">Deep botanical midnight, sage green, and warm gold</p>
              </div>
            </div>
            {theme === 'dark' && <Check size={18} className="text-[#77A76A]" />}
          </button>
        </div>
      </div>

      {/* Design System Tokens Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Light Mode Tokens */}
        <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0D5428] dark:text-[#77A76A]">
            Light Mode Tokens
          </h4>
          <div className="space-y-2">
            {lightTokens.map(tok => (
              <div key={tok.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50 dark:bg-[#0D2115]">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: tok.val }} />
                  <span className="font-medium text-[#10271A] dark:text-[#F7F1E5]">{tok.name}</span>
                </div>
                <code className="text-[11px] text-neutral-500 font-mono">{tok.val}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Mode Tokens */}
        <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#C99B36] dark:text-[#D4AA52]">
            Dark Mode Tokens
          </h4>
          <div className="space-y-2">
            {darkTokens.map(tok => (
              <div key={tok.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50 dark:bg-[#0D2115]">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: tok.val }} />
                  <span className="font-medium text-[#10271A] dark:text-[#F7F1E5]">{tok.name}</span>
                </div>
                <code className="text-[11px] text-neutral-500 font-mono">{tok.val}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
