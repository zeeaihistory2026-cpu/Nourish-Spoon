import React from 'react';
import { ShoppingCart, Coins, Users, Star, RefreshCw, TrendingUp } from 'lucide-react';

interface KPICardsProps {
  totalOrders?: number;
  revenue?: number;
  customers?: number;
  rating?: number;
  reviewCount?: number;
  repeatRate?: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalOrders = 428,
  revenue = 214350,
  customers = 312,
  rating = 4.8,
  reviewCount = 122,
  repeatRate = 37,
}) => {
  const cards = [
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '↑ 12%',
      comparison: 'vs last month',
      icon: ShoppingCart,
      iconBg: 'bg-[#0D5428]',
      iconColor: 'text-white'
    },
    {
      title: 'Revenue',
      value: `Rs. ${revenue.toLocaleString()}`,
      change: '↑ 18%',
      comparison: 'vs last month',
      icon: Coins,
      iconBg: 'bg-[#C99B36]',
      iconColor: 'text-white'
    },
    {
      title: 'Customers',
      value: customers.toLocaleString(),
      change: '↑ 16%',
      comparison: 'vs last month',
      icon: Users,
      iconBg: 'bg-[#073B21]',
      iconColor: 'text-white'
    },
    {
      title: 'Reviews',
      value: `${rating} (${reviewCount} reviews)`,
      change: '↑ 8%',
      comparison: 'vs last month',
      icon: Star,
      iconBg: 'bg-[#C99B36]',
      iconColor: 'text-white'
    },
    {
      title: 'Repeat Orders',
      value: `${repeatRate}%`,
      change: '↑ 5%',
      comparison: 'vs last month',
      icon: RefreshCw,
      iconBg: 'bg-[#1E5D36]',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-[#14291C] rounded-2xl p-4 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex items-center space-x-3.5 transition hover:shadow-md"
          >
            <div className={`w-12 h-12 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 shadow-sm`}>
              <Icon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#5A6D60] dark:text-[#8CAE99] truncate">
                {card.title}
              </p>
              <h3 className="text-lg font-bold text-[#10271A] dark:text-[#F7F1E5] tracking-tight leading-tight mt-0.5 truncate">
                {card.value}
              </h3>
              <p className="text-[11px] text-[#0D5428] dark:text-[#77A76A] font-semibold flex items-center space-x-1 mt-0.5">
                <span>{card.change}</span>
                <span className="text-[#889B8D] dark:text-[#708878] font-normal">{card.comparison}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
