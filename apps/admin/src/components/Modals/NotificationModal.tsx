import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (notif: { title: string; body: string; audience: string }) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onSend }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('All Customers');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onSend({ title: title.trim(), body: body.trim(), audience });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#14291C] rounded-2xl w-full max-w-md p-6 border border-[#E8DFC8] dark:border-[#24422F] shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8] dark:border-[#24422F]">
          <h3 className="font-serif text-xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Send App Notification
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-[#23422E] text-[#5A6D60] dark:text-[#8CAE99]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
              Target Audience
            </label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
            >
              <option value="All Customers">All App Customers</option>
              <option value="Sargodha Customers">Sargodha Customers (Same-day Promo)</option>
              <option value="Previous Buyers">Previous Buyers</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
              Notification Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Fresh Batch Alert! Pure Panjeeri Ready"
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
              Message Body *
            </label>
            <textarea
              rows={3}
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Tap to order on WhatsApp with complimentary delivery in Sargodha!"
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8DFC8] dark:border-[#24422F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] text-[#5A6D60] dark:text-[#8CAE99] hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0D5428] hover:bg-[#073B21] text-white font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <Send size={14} />
              <span>Broadcast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
