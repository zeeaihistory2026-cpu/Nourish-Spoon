import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const ORDER_STATUS_DATA = [
  { name: 'Pending', count: 28, percentage: '7%', color: '#F59E0B' },
  { name: 'Confirmed', count: 86, percentage: '20%', color: '#C99B36' },
  { name: 'Preparing', count: 64, percentage: '15%', color: '#D4AA52' },
  { name: 'Out for Delivery', count: 112, percentage: '26%', color: '#10B981' },
  { name: 'Delivered', count: 124, percentage: '29%', color: '#0D5428' },
  { name: 'Cancelled', count: 14, percentage: '3%', color: '#EF4444' },
];

export const OrdersDonutChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex flex-col justify-between h-full">
      <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5] mb-2">
        Orders by Status
      </h3>

      <div className="flex items-center gap-3 min-w-0">
        {/* Donut Chart with center label */}
        <div className="relative w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ORDER_STATUS_DATA}
                innerRadius={32}
                outerRadius={48}
                paddingAngle={2}
                dataKey="count"
              >
                {ORDER_STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A2616',
                  borderColor: '#C99B36',
                  borderRadius: '8px',
                  color: '#FFF9EC',
                  fontSize: '11px'
                }}
                formatter={(value: any, name: any) => [`${value} orders`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-[#10271A] dark:text-[#F7F1E5] leading-none">
              428
            </span>
            <span className="text-[10px] text-[#5A6D60] dark:text-[#8CAE99] font-medium mt-0.5">
              Total Orders
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {ORDER_STATUS_DATA.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#3F5447] dark:text-[#C7DACF] min-w-0">
                  {item.name}
                </span>
              </div>
              <span className="shrink-0 whitespace-nowrap font-semibold text-[#10271A] dark:text-[#F7F1E5]">
                {item.count} <span className="text-[10px] font-normal text-[#7E9687]">({item.percentage})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
