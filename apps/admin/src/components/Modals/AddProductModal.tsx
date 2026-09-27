import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product } from '@packages/types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'energy_balls' | 'panjeeri'>('energy_balls');
  const [tagline, setTagline] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [price250, setPrice250] = useState('1999');
  const [regular250, setRegular250] = useState('2199');
  const [price500, setPrice500] = useState('3899');
  const [regular500, setRegular500] = useState('3899');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newProd: Omit<Product, 'id'> = {
      name,
      slug,
      tagline,
      short_description: shortDesc || 'Handcrafted fresh Pakistani natural superfood.',
      description: description || 'Prepared with pure ingredients and traditional recipes.',
      category,
      featured_image: category === 'panjeeri' ? '/assets/products/panjeeri_detail_hero.jpg' : '/assets/products/energy_balls_detail_hero.jpg',
      rating: 5.0,
      review_count: 0,
      is_featured: true,
      active: true,
      sort_order: 3,
      variants: [
        {
          id: `var_250_${Date.now()}`,
          product_id: '',
          weight: '250g',
          regular_price: Number(regular250) || 2199,
          sale_price: Number(price250) || 1999,
          price_per_100g: (Number(price250) || 1999) / 250 * 100 / 100,
          stock: 50,
          is_default: true,
          active: true,
          sort_order: 1
        },
        {
          id: `var_500_${Date.now()}`,
          product_id: '',
          weight: '500g',
          regular_price: Number(regular500) || 3899,
          sale_price: Number(price500) || 3899,
          price_per_100g: (Number(price500) || 3899) / 500 * 100 / 100,
          stock: 30,
          is_default: false,
          active: true,
          sort_order: 2
        }
      ]
    };

    onSave(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#14291C] rounded-2xl w-full max-w-xl p-6 border border-[#E8DFC8] dark:border-[#24422F] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8] dark:border-[#24422F]">
          <h3 className="font-serif text-xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Add New Handcrafted Product
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
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Pistachio Cardamom Panjeeri"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5] focus:ring-2 focus:ring-[#0D5428]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
              >
                <option value="energy_balls">Energy Balls</option>
                <option value="panjeeri">Panjeeri</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Pure Desi Ghee • Small Batch"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#10271A] dark:text-[#F7F1E5] mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              placeholder="Brief summary for product card"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5]"
            />
          </div>

          {/* Pricing Variants */}
          <div className="p-3.5 rounded-xl border border-[#E8DFC8] dark:border-[#24422F] bg-[#FFF9EC]/30 dark:bg-[#0D2115]/50 space-y-3">
            <h4 className="font-bold text-[#0D5428] dark:text-[#77A76A]">
              Variant Pricing (PKR)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#5A6D60] dark:text-[#8CAE99] mb-1">
                  250g Sale Price (Rs.)
                </label>
                <input
                  type="number"
                  value={price250}
                  onChange={e => setPrice250(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E8DFC8] dark:border-[#2B4B36] bg-white dark:bg-[#14291C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A6D60] dark:text-[#8CAE99] mb-1">
                  250g Regular Price (Rs.)
                </label>
                <input
                  type="number"
                  value={regular250}
                  onChange={e => setRegular250(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E8DFC8] dark:border-[#2B4B36] bg-white dark:bg-[#14291C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A6D60] dark:text-[#8CAE99] mb-1">
                  500g Sale Price (Rs.)
                </label>
                <input
                  type="number"
                  value={price500}
                  onChange={e => setPrice500(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E8DFC8] dark:border-[#2B4B36] bg-white dark:bg-[#14291C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A6D60] dark:text-[#8CAE99] mb-1">
                  500g Regular Price (Rs.)
                </label>
                <input
                  type="number"
                  value={regular500}
                  onChange={e => setRegular500(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E8DFC8] dark:border-[#2B4B36] bg-white dark:bg-[#14291C]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8DFC8] dark:border-[#24422F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] text-[#5A6D60] dark:text-[#8CAE99] hover:bg-neutral-100 dark:hover:bg-[#23422E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0D5428] hover:bg-[#073B21] text-white font-bold transition shadow-sm"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
