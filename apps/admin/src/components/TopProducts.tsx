import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TopProductsProps {
  onViewAll?: () => void;
}

export const TopProducts: React.FC<TopProductsProps> = ({ onViewAll }) => {
  const products = [
    {
      name: 'Date & Nuts Energy Balls',
      variants: '250g | 500g',
      unitsSold: 215,
      totalUnits: 300,
      image: '/assets/products/energy_balls_card.jpg'
    },
    {
      name: 'Homemade Panjeeri',
      variants: '250g | 500g',
      unitsSold: 178,
      totalUnits: 300,
      image: '/assets/products/panjeeri_card.jpg'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Top Products
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-4">
        {products.map((item, idx) => {
          const pct = Math.round((item.unitsSold / item.totalUnits) * 100);
          return (
            <div key={idx} className="flex items-center space-x-3.5">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#E8DFC8] dark:border-[#2B4B36] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#10271A] dark:text-[#F7F1E5] truncate">
                    {item.name}
                  </h4>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#10271A] dark:text-[#F7F1E5]">
                      {item.unitsSold}
                    </span>
                    <span className="text-[10px] text-[#7A9383] block leading-none">
                      units sold
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99] mb-1.5">
                  {item.variants}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-[#E8DFC8]/50 dark:bg-[#23422E] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0D5428] dark:bg-[#77A76A] h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
