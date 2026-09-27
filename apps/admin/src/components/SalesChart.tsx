import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const SALES_DATA = [
  { day: '1 May', orders: 12, revenue: 16000 },
  { day: '3 May', orders: 18, revenue: 22000 },
  { day: '5 May', orders: 15, revenue: 21000 },
  { day: '7 May', orders: 20, revenue: 24000 },
  { day: '10 May', orders: 14, revenue: 19000 },
  { day: '12 May', orders: 22, revenue: 26000 },
  { day: '15 May', orders: 16, revenue: 20000 },
  { day: '18 May', orders: 24, revenue: 28000 },
  { day: '20 May', orders: 19, revenue: 23000 },
  { day: '22 May', orders: 26, revenue: 31000 },
  { day: '25 May', orders: 22, revenue: 27000 },
  { day: '28 May', orders: 30, revenue: 36000 },
  { day: '31 May', orders: 35, revenue: 42000 }
];

export const SalesChart: React.FC = () => {
  const [period, setPeriod] = useState<'Daily' | 'Weekly'>('Daily');

  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Sales Overview
        </h3>

        <div className="flex items-center space-x-4">
          {/* Legend */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3D7453]" />
              <span className="text-[#5A6D60] dark:text-[#8CAE99]">Orders</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C99B36]" />
              <span className="text-[#5A6D60] dark:text-[#8CAE99]">Revenue (PKR)</span>
            </div>
          </div>

          {/* Period selector */}
          <button
            onClick={() => setPeriod(p => p === 'Daily' ? 'Weekly' : 'Daily')}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5] hover:bg-[#FFF9EC]"
          >
            <span>{period}</span>
            <ChevronDown size={12} className="text-[#8CAE99]" />
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE7D5" opacity={0.5} />
            <XAxis
              dataKey="day"
              stroke="#8CAE99"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="orders"
              stroke="#8CAE99"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              yAxisId="revenue"
              orientation="right"
              stroke="#C99B36"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0A2616',
                borderColor: '#C99B36',
                borderRadius: '8px',
                color: '#FFF9EC',
                fontSize: '12px'
              }}
              formatter={(value: any, name: any) => [
                name === 'revenue' ? `Rs. ${Number(value).toLocaleString()}` : `${value} orders`,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
            />
            <Bar
              yAxisId="orders"
              dataKey="orders"
              fill="#528564"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#C99B36"
              strokeWidth={2.5}
              dot={{ fill: '#C99B36', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
