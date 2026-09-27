import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { DeliveryMethod } from '@packages/types';
import { formatPKR } from '@packages/utils';
import { MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export const DeliveryLocationsPage: React.FC = () => {
  const [methods, setMethods] = useState<DeliveryMethod[]>(() => storeService.getDeliveryMethods());

  useEffect(() => {
    return storeService.subscribe(() => {
      setMethods([...storeService.getDeliveryMethods()]);
    });
  }, []);

  const handleToggle = (id: string) => {
    storeService.toggleDeliveryMethod(id);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Delivery Methods & Regional Settings
        </h2>
        <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
          Configure same-day delivery in Sargodha, TCS nationwide shipping, and local pickup points.
        </p>
      </div>

      <div className="space-y-4">
        {methods.map(dm => (
          <div
            key={dm.id}
            className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {dm.icon && (
                <img
                  src={dm.icon}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DFC8] dark:border-[#2B4B36] shrink-0"
                />
              )}
              <div>
                <h4 className="font-serif text-base font-bold text-[#10271A] dark:text-[#F7F1E5]">
                  {dm.title}
                </h4>
                <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
                  {dm.subtitle}
                </p>
                <div className="flex items-center space-x-3 mt-1 text-[11px] text-[#7A9383]">
                  <span>⏱ Estimated: <strong>{dm.estimated_time}</strong></span>
                  <span>•</span>
                  <span>Delivery Fee: <strong>{dm.fee === 0 ? 'Free' : formatPKR(dm.fee)}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleToggle(dm.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                dm.active
                  ? 'bg-[#0D5428] text-white hover:bg-[#073B21]'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
              }`}
            >
              {dm.active ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{dm.active ? 'Active' : 'Disabled'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
