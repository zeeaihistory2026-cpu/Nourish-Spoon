import React from 'react';

interface PaymentDeliveryStatsProps {
  onManage?: () => void;
}

export const PaymentDeliveryStats: React.FC<PaymentDeliveryStatsProps> = ({ onManage }) => {
  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Payments & Delivery
        </h3>
        <button
          onClick={onManage}
          className="text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] hover:underline"
        >
          Manage
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        {/* Payment Methods */}
        <div className="space-y-2.5">
          <p className="font-bold text-[#5A6D60] dark:text-[#8CAE99] text-[11px] uppercase tracking-wider">
            Payment Methods
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <img src="/assets/icons/icon_bank.png" alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
              <span className="text-[#10271A] dark:text-[#F7F1E5] truncate">Bank Transfer</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">42%</span>
              <span className="text-[10px] text-[#7A9383] block">Rs. 89,600</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <img src="/assets/icons/icon_easypaisa.png" alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
              <span className="text-[#10271A] dark:text-[#F7F1E5] truncate">EasyPaisa</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">28%</span>
              <span className="text-[10px] text-[#7A9383] block">Rs. 59,950</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <img src="/assets/icons/icon_jazzcash.png" alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
              <span className="text-[#10271A] dark:text-[#F7F1E5] truncate">JazzCash</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">30%</span>
              <span className="text-[10px] text-[#7A9383] block">Rs. 64,800</span>
            </div>
          </div>
        </div>

        {/* Delivery Methods */}
        <div className="space-y-2.5 border-l border-[#E8DFC8]/60 dark:border-[#24422F]/60 pl-4">
          <p className="font-bold text-[#5A6D60] dark:text-[#8CAE99] text-[11px] uppercase tracking-wider">
            Delivery Methods
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <img src="/assets/icons/icon_delivery_sargodha.png" alt="" className="w-5 h-5 rounded object-cover shrink-0" />
              <span className="text-[#10271A] dark:text-[#F7F1E5] truncate">Sargodha (Same Day)</span>
            </div>
            <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">40%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <img src="/assets/icons/icon_delivery_tcs.png" alt="" className="w-5 h-5 rounded object-cover shrink-0" />
              <span className="text-[#10271A] dark:text-[#F7F1E5] truncate">TCS (Nationwide)</span>
            </div>
            <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">35%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <img src="/assets/icons/icon_delivery_foodpanda.png" alt="" className="w-5 h-5 rounded object-cover shrink-0" />
              <span className="text-[#10271A] dark:text-[#F7F1E5] truncate">Foodpanda</span>
            </div>
            <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">15%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <img src="/assets/icons/icon_delivery_pickup.png" alt="" className="w-5 h-5 rounded object-cover shrink-0" />
              <span className="text-[#10271A] dark:text-[#F7F1E5] truncate">Self Pickup</span>
            </div>
            <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">10%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
