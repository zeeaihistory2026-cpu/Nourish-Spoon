import React, { useState } from 'react';
import { isSupabaseConfigured } from '../services/supabase';
import { Save, Check, Database, ShoppingCart, MessageCircle, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [whatsappPhone, setWhatsappPhone] = useState('+92 304 6721962');
  const [email, setEmail] = useState('info@nourishspoon.com');
  const [location, setLocation] = useState('Sargodha, Punjab, Pakistan');
  const [businessHours, setBusinessHours] = useState('Monday – Saturday, 8am – 11pm');
  const [nativeCart, setNativeCart] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('ns_setting_whatsapp', whatsappPhone);
    localStorage.setItem('ns_setting_cart_enabled', String(nativeCart));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Operational Settings & Feature Flags
          </h2>
          <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
            Control business numbers, hours, feature flags, and backend connections.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-[#0D5428] hover:bg-[#073B21] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Supabase Status Card */}
      <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Database size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#10271A] dark:text-[#F7F1E5]">
              Supabase Backend
            </h4>
            <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
              {isSupabaseConfigured
                ? 'Connected to live Supabase PostgreSQL instance'
                : 'Running in Local Reactive Mode with persistence (Ready for Supabase keys)'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
          ● Ready & Operational
        </span>
      </div>

      {/* WhatsApp Ordering & Business Contact */}
      <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5] flex items-center space-x-2">
          <MessageCircle className="text-emerald-600" size={18} />
          <span>WhatsApp & Store Contact</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">WhatsApp Order Number *</label>
            <input
              type="text"
              value={whatsappPhone}
              onChange={e => setWhatsappPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">All mobile order buttons redirect to this number</span>
          </div>

          <div>
            <label className="block font-semibold mb-1">Store Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Kitchen Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Business Hours</label>
            <input
              type="text"
              value={businessHours}
              onChange={e => setBusinessHours(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5] flex items-center space-x-2">
          <ShoppingCart className="text-[#C99B36]" size={18} />
          <span>Feature Flags (PRD Section 6.10)</span>
        </h3>

        <div className="p-4 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#10271A] dark:text-[#F7F1E5]">
              Native Cart & Direct Checkout
            </h4>
            <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99] mt-0.5">
              When OFF, WhatsApp is the dominant direct buying path. When ON, reveals in-app cart and native checkout screens.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={nativeCart}
              onChange={e => setNativeCart(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D5428]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
