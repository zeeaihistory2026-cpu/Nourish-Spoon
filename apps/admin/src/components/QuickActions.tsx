import React from 'react';
import { Plus, HelpCircle, Image as ImageIcon, Send, Download } from 'lucide-react';

interface QuickActionsProps {
  onAddProduct: () => void;
  onManageFAQ: () => void;
  onPublishBanner: () => void;
  onSendNotification: () => void;
  onExportReport: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddProduct,
  onManageFAQ,
  onPublishBanner,
  onSendNotification,
  onExportReport
}) => {
  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex flex-col justify-between h-full">
      <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5] mb-3">
        Quick Actions
      </h3>

      <div className="flex flex-col space-y-2">
        {/* + Add Product (Deep Green) */}
        <button
          onClick={onAddProduct}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#0D5428] hover:bg-[#083E1C] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>

        {/* Manage FAQ (Gold) */}
        <button
          onClick={onManageFAQ}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#C99B36] hover:bg-[#B3872A] text-white text-xs font-semibold transition shadow-sm"
        >
          <HelpCircle size={15} />
          <span>Manage FAQ</span>
        </button>

        {/* Publish Banner (Gold) */}
        <button
          onClick={onPublishBanner}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#C99B36]/90 hover:bg-[#C99B36] text-white text-xs font-semibold transition shadow-sm"
        >
          <ImageIcon size={15} />
          <span>Publish Banner</span>
        </button>

        {/* Send Notifications (Gold) */}
        <button
          onClick={onSendNotification}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#C99B36]/90 hover:bg-[#C99B36] text-white text-xs font-semibold transition shadow-sm"
        >
          <Send size={15} />
          <span>Send Notifications</span>
        </button>

        {/* Export Report (Gold) */}
        <button
          onClick={onExportReport}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#C99B36]/80 hover:bg-[#C99B36] text-white text-xs font-semibold transition shadow-sm"
        >
          <Download size={15} />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
};
