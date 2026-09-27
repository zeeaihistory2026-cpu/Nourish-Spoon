import React from 'react';
import { HelpCircle, PhoneCall } from 'lucide-react';

interface ContentManagementCardsProps {
  onEditBanner?: () => void;
  onEditStory?: () => void;
  onManageFAQ?: () => void;
  onEditContact?: () => void;
}

export const ContentManagementCards: React.FC<ContentManagementCardsProps> = ({
  onEditBanner,
  onEditStory,
  onManageFAQ,
  onEditContact
}) => {
  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex flex-col justify-between h-full">
      <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5] mb-3">
        Content Management
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Banner Card */}
        <div className="rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] overflow-hidden flex flex-col bg-[#FFF9EC]/40 dark:bg-[#0D2115]">
          <div className="relative h-20 bg-cover bg-center" style={{ backgroundImage: "url('/assets/admin/banner_healthy_choices.jpg')" }}>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
              <span className="font-serif text-xs text-white font-bold leading-tight">
                Healthy Choices<br />Happier Lives
              </span>
            </div>
          </div>
          <div className="p-2 text-center mt-auto">
            <button
              onClick={onEditBanner}
              className="w-full py-1 text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] bg-white dark:bg-[#14291C] rounded-md border border-[#E8DFC8] dark:border-[#2B4B36] hover:bg-[#0D5428] hover:text-white transition"
            >
              Edit Banner
            </button>
          </div>
        </div>

        {/* Our Story Card */}
        <div className="rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] overflow-hidden flex flex-col bg-[#FFF9EC]/40 dark:bg-[#0D2115]">
          <div className="relative h-20 bg-cover bg-center" style={{ backgroundImage: "url('/assets/admin/thumb_our_story.jpg')" }}>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
              <span className="font-serif text-xs text-white font-bold leading-tight">
                Our Story<br />
                <span className="font-sans text-[9px] font-normal text-[#E2BB62]">Crafted with Love</span>
              </span>
            </div>
          </div>
          <div className="p-2 text-center mt-auto">
            <button
              onClick={onEditStory}
              className="w-full py-1 text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] bg-white dark:bg-[#14291C] rounded-md border border-[#E8DFC8] dark:border-[#2B4B36] hover:bg-[#0D5428] hover:text-white transition"
            >
              Edit Story
            </button>
          </div>
        </div>

        {/* FAQ Card */}
        <div className="rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] overflow-hidden flex flex-col bg-[#FFF9EC]/40 dark:bg-[#0D2115]">
          <div className="h-20 flex flex-col items-center justify-center p-2 text-center">
            <div className="w-8 h-8 rounded-full bg-[#C99B36]/15 text-[#C99B36] flex items-center justify-center mb-1">
              <HelpCircle size={18} />
            </div>
            <span className="text-[11px] font-bold text-[#10271A] dark:text-[#F7F1E5]">
              Frequently Asked Questions
            </span>
          </div>
          <div className="p-2 text-center mt-auto">
            <button
              onClick={onManageFAQ}
              className="w-full py-1 text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] bg-white dark:bg-[#14291C] rounded-md border border-[#E8DFC8] dark:border-[#2B4B36] hover:bg-[#0D5428] hover:text-white transition"
            >
              Manage FAQ
            </button>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] overflow-hidden flex flex-col bg-[#FFF9EC]/40 dark:bg-[#0D2115]">
          <div className="h-20 flex flex-col items-center justify-center p-2 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D5428]/15 text-[#0D5428] dark:text-[#77A76A] flex items-center justify-center mb-1">
              <PhoneCall size={18} />
            </div>
            <span className="text-[11px] font-bold text-[#10271A] dark:text-[#F7F1E5]">
              Contact Information
            </span>
          </div>
          <div className="p-2 text-center mt-auto">
            <button
              onClick={onEditContact}
              className="w-full py-1 text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] bg-white dark:bg-[#14291C] rounded-md border border-[#E8DFC8] dark:border-[#2B4B36] hover:bg-[#0D5428] hover:text-white transition"
            >
              Edit Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
