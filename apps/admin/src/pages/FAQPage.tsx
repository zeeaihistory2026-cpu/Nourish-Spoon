import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { FAQ } from '@packages/types';
import { Plus, Trash2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AddFAQModal } from '../components/Modals/AddFAQModal';

export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(() => storeService.getFAQs());
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    return storeService.subscribe(() => {
      setFaqs([...storeService.getFAQs()]);
    });
  }, []);

  const categories = ['All', 'General', 'Products', 'Ordering', 'Delivery', 'Gifting'];

  const filtered = faqs.filter(f => selectedCat === 'All' || f.category === selectedCat);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this FAQ entry?')) {
      storeService.deleteFAQ(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Frequently Asked Questions Management
          </h2>
          <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
            Manage questions and answers displayed on the mobile app FAQ screen.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#C99B36] hover:bg-[#B3872A] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex space-x-2 border-b border-[#E8DFC8] dark:border-[#24422F] pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCat === cat
                ? 'bg-[#0D5428] text-white shadow-sm'
                : 'bg-white dark:bg-[#14291C] border border-[#E8DFC8] dark:border-[#24422F] text-[#5A6D60] dark:text-[#8CAE99]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordions List */}
      <div className="space-y-3">
        {filtered.map(f => {
          const isExpanded = expandedId === f.id;
          return (
            <div
              key={f.id}
              className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-4 shadow-sm"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : f.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF9EC] dark:bg-[#0D2115] text-[#0D5428] dark:text-[#77A76A] border border-[#E8DFC8]/60 dark:border-[#24422F]">
                    {f.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#10271A] dark:text-[#F7F1E5]">
                    {f.question}
                  </h4>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(f.id);
                    }}
                    className="p-1 rounded text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 size={15} />
                  </button>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#E8DFC8]/50 dark:border-[#24422F]/50 text-xs text-[#5A6D60] dark:text-[#C7DACF] leading-relaxed">
                  {f.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddFAQModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(newFaq) => storeService.addFAQ(newFaq)}
      />
    </div>
  );
};
