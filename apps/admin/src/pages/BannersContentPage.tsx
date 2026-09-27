import React, { useState } from 'react';
import { Image as ImageIcon, Save, Check } from 'lucide-react';
import { FOUNDER_STORY } from '../services/mockData';

export const BannersContentPage: React.FC = () => {
  const [headline, setHeadline] = useState('Handcrafted Nutrition. Real Ingredients. Pure Love.');
  const [subheading, setSubheading] = useState('Premium Panjeeri & Date-Nut Energy Balls made with pure, natural ingredients for your family’s well-being.');
  const [founderQuote, setFounderQuote] = useState(FOUNDER_STORY.quote);
  const [storyBody, setStoryBody] = useState(FOUNDER_STORY.story_body);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Banners & Dynamic Brand Copy
          </h2>
          <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
            Update hero headlines, founder story quotes, and promotional banners across the mobile app.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-[#0D5428] hover:bg-[#073B21] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          <span>{saved ? 'Changes Saved!' : 'Save Content'}</span>
        </button>
      </div>

      {/* Hero Section Banner */}
      <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Mobile Home Hero Banner
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Headline Text *</label>
            <input
              type="text"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Subheading Copy *</label>
            <textarea
              rows={2}
              value={subheading}
              onChange={e => setSubheading(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="mt-4 p-4 rounded-xl border border-[#C99B36]/30 bg-[#FFF9EC] dark:bg-[#0D2115] flex items-center space-x-4">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-[#C99B36] uppercase tracking-wider block">Live Mobile Preview</span>
            <h4 className="font-serif text-base font-bold text-[#10271A] dark:text-white leading-tight mt-1">
              {headline}
            </h4>
            <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99] mt-1">
              {subheading}
            </p>
          </div>
          <img
            src="/assets/products/home_hero_food.jpg"
            alt=""
            className="w-20 h-20 rounded-xl object-cover shrink-0 border"
          />
        </div>
      </div>

      {/* Founder Story Management */}
      <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Founder Story & Values (Tayyaba)
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Founder Featured Quote *</label>
            <input
              type="text"
              value={founderQuote}
              onChange={e => setFounderQuote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Our Story Narrative *</label>
            <textarea
              rows={4}
              value={storyBody}
              onChange={e => setStoryBody(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
