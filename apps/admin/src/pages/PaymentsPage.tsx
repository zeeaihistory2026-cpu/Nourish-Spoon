import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { PaymentMethod } from '@packages/types';
import { CreditCard, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>(() => storeService.getPaymentMethods());

  useEffect(() => {
    return storeService.subscribe(() => {
      setMethods([...storeService.getPaymentMethods()]);
    });
  }, []);

  const handleToggle = (id: string) => {
    storeService.togglePaymentMethod(id);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Payment Methods (Advance Payment Only)
        </h2>
        <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
          Manage accepted wallets and bank accounts for orders. Cash on Delivery is strictly disabled by brand policy.
        </p>
      </div>

      {/* Advance payment notice */}
      <div className="p-4 rounded-2xl bg-[#FFF3D6] dark:bg-[#3E2D07] border border-[#C99B36]/50 flex items-start space-x-3 text-xs text-[#7A5B0B] dark:text-[#F1D79E]">
        <Info size={18} className="shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Brand Policy: Advance Payment Only</span>
          Nourish Spoon products are handcrafted in small batches. To maintain fresh preparation and minimize wastage, orders are confirmed strictly after receiving payment screenshots on WhatsApp.
        </div>
      </div>

      <div className="space-y-4">
        {methods.map(pm => (
          <div
            key={pm.id}
            className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {pm.icon && (
                <img
                  src={pm.icon}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DFC8] dark:border-[#2B4B36] shrink-0"
                />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif text-base font-bold text-[#10271A] dark:text-[#F7F1E5]">
                    {pm.name}
                  </h4>
                  {pm.advance_only && (
                    <span className="text-[10px] font-bold bg-[#C99B36]/15 text-[#C99B36] px-2 py-0.5 rounded-full">
                      Advance Only
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
                  {pm.subtext}
                </p>
                <div className="mt-1 text-[11px] text-[#10271A] dark:text-[#C7DACF] font-mono">
                  Account: <strong>{pm.account_title}</strong> ({pm.account_number}) {pm.bank_name ? `• ${pm.bank_name}` : ''}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleToggle(pm.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                pm.active
                  ? 'bg-[#0D5428] text-white hover:bg-[#073B21]'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
              }`}
            >
              {pm.active ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{pm.active ? 'Active' : 'Disabled'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
