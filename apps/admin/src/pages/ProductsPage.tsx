import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { Product } from '@packages/types';
import { formatPKR, formatPer100g } from '@packages/utils';
import { Plus, Star, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AddProductModal } from '../components/Modals/AddProductModal';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => storeService.getProducts());
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    return storeService.subscribe(() => {
      setProducts([...storeService.getProducts()]);
    });
  }, []);

  const handleToggleActive = (id: string, active: boolean) => {
    storeService.updateProduct(id, { active: !active });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      storeService.deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Product Catalog Management
          </h2>
          <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
            Manage prices, 250g/500g weights, ingredients, nutrition facts, and stock availability.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#0D5428] hover:bg-[#073B21] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(prod => (
          <div
            key={prod.id}
            className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Product Hero Banner */}
              <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={prod.featured_image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#0D5428] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                  {prod.badge_label || 'Handcrafted'}
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 dark:bg-black/80 px-2.5 py-1 rounded-full text-xs font-bold text-[#C99B36] shadow">
                  <Star size={13} className="fill-[#C99B36]" />
                  <span>{prod.rating}</span>
                  <span className="text-neutral-500 font-normal">({prod.review_count})</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99] mt-1 leading-relaxed">
                    {prod.short_description}
                  </p>
                </div>

                {/* Variants Box */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#5A6D60] dark:text-[#8CAE99]">
                    Variants & Live Pricing (PKR)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {prod.variants?.map(v => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115]"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-[#0D5428] dark:text-[#77A76A]">{v.weight}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">Stock: {v.stock}</span>
                        </div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-base font-black text-[#10271A] dark:text-[#F7F1E5]">
                            {formatPKR(v.sale_price || v.regular_price)}
                          </span>
                          {v.sale_price && v.sale_price < v.regular_price && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatPKR(v.regular_price)}
                            </span>
                          )}
                        </div>
                        {v.price_per_100g && (
                          <span className="text-[10px] text-[#7A9383] block">
                            {formatPer100g(v.price_per_100g)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits / Trust chips */}
                {prod.benefits && (
                  <div className="space-y-1.5 pt-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#5A6D60] dark:text-[#8CAE99]">
                      Key Benefits
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {prod.benefits.slice(0, 3).map((b, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E8DFC8]/40 dark:bg-[#23422E] text-[#10271A] dark:text-[#C7DACF]">
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 bg-neutral-50 dark:bg-[#0D2115] border-t border-[#E8DFC8] dark:border-[#24422F] flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleActive(prod.id, prod.active)}
                className={`flex items-center space-x-1.5 font-semibold ${
                  prod.active ? 'text-[#0D5428] dark:text-[#77A76A]' : 'text-neutral-400'
                }`}
              >
                {prod.active ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{prod.active ? 'Active & Published' : 'Disabled (Draft)'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(newP) => storeService.addProduct(newP as any)}
      />
    </div>
  );
};
