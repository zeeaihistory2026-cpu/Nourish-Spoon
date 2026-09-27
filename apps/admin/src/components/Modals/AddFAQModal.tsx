import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FAQ } from '@packages/types';

interface AddFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Omit<FAQ, 'id'>) => void;
}

export const AddFAQModal: React.FC<AddFAQModalProps> = ({ isOpen, onClose, onSave }) => {
  const [category, setCategory] = useState<FAQ['category']>('General');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    onSave({
      category,
      question: question.trim(),
      answer: answer.trim(),
      sort_order: 10,
      active: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#14291C] rounded-2xl w-full max-w-lg p-6 border border-[#E8DFC8] dark:border-[#24422F] shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8] dark:border-[#24422F]">
          <h3 className="font-serif text-xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Add FAQ Entry
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
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as FAQ['category'])}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
            >
              <option value="General">General</option>
              <option value="Products">Products</option>
              <option value="Ordering">Ordering</option>
              <option value="Delivery">Delivery</option>
              <option value="Gifting">Gifting</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
              Question *
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. Can I customize the ingredients for dietary needs?"
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
              Answer *
            </label>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Detailed clear response for customers..."
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
              className="px-5 py-2 rounded-xl bg-[#C99B36] hover:bg-[#B3872A] text-white font-bold transition shadow-sm"
            >
              Add FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
