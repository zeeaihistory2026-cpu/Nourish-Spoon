import React from 'react';
import { Order, OrderStatus } from '@packages/types';
import { formatPKR } from '@packages/utils';
import { ArrowRight, Eye, MoreVertical } from 'lucide-react';

interface RecentOrdersTableProps {
  orders: Order[];
  onViewAll?: () => void;
  onSelectOrder?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  onViewAll,
  onSelectOrder,
  onUpdateStatus
}) => {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E3F5EC] text-[#0D5428] dark:bg-[#133C24] dark:text-[#84C276]">
            ● Delivered
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0C2D48] dark:text-[#38BDF8]">
            ● Out for Delivery
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] dark:bg-[#452205] dark:text-[#FBBF24]">
            ● Confirmed
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#341258] dark:text-[#C084FC]">
            ● Preparing
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#991B1B] dark:bg-[#450A0A] dark:text-[#F87171]">
            ● Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentIcon = (code: string) => {
    switch (code) {
      case 'jazzcash':
        return <img src="/assets/icons/icon_jazzcash.png" alt="JazzCash" className="w-5 h-5 rounded-full inline mr-1.5 object-cover" />;
      case 'easypaisa':
        return <img src="/assets/icons/icon_easypaisa.png" alt="EasyPaisa" className="w-5 h-5 rounded-full inline mr-1.5 object-cover" />;
      case 'bank_transfer':
        return <img src="/assets/icons/icon_bank.png" alt="Bank" className="w-5 h-5 rounded-full inline mr-1.5 object-cover" />;
      default:
        return null;
    }
  };

  const getDeliveryIcon = (code: string) => {
    switch (code) {
      case 'sargodha_sameday':
        return <img src="/assets/icons/icon_delivery_sargodha.png" alt="Sargodha" className="w-5 h-5 rounded inline mr-1.5 object-cover" />;
      case 'tcs_nationwide':
        return <img src="/assets/icons/icon_delivery_tcs.png" alt="TCS" className="w-5 h-5 rounded inline mr-1.5 object-cover" />;
      case 'foodpanda_sargodha':
        return <img src="/assets/icons/icon_delivery_foodpanda.png" alt="Foodpanda" className="w-5 h-5 rounded inline mr-1.5 object-cover" />;
      case 'self_pickup':
        return <img src="/assets/icons/icon_delivery_pickup.png" alt="Pickup" className="w-5 h-5 rounded inline mr-1.5 object-cover" />;
      default:
        return null;
    }
  };

  const displayOrders = orders.slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Recent Orders
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8DFC8] dark:border-[#24422F] text-[#5A6D60] dark:text-[#8CAE99] font-medium pb-2">
              <th className="py-2.5 font-semibold">#</th>
              <th className="py-2.5 font-semibold">Customer</th>
              <th className="py-2.5 font-semibold">Product</th>
              <th className="py-2.5 font-semibold">Payment Method</th>
              <th className="py-2.5 font-semibold">Delivery Method</th>
              <th className="py-2.5 font-semibold">Amount</th>
              <th className="py-2.5 font-semibold">Status</th>
              <th className="py-2.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#24422F]/40 text-[#10271A] dark:text-[#F7F1E5]">
            {displayOrders.map((order) => {
              const firstItem = order.items?.[0];
              return (
                <tr key={order.id} className="hover:bg-[#FFF9EC]/40 dark:hover:bg-[#1A3625] transition-colors">
                  <td className="py-3 font-semibold text-[#0D5428] dark:text-[#77A76A]">
                    {order.order_number}
                  </td>
                  <td className="py-3 font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#0D5428]/10 text-[#0D5428] dark:text-[#77A76A] font-bold text-[10px] flex items-center justify-center">
                        {order.customer_name.charAt(0)}
                      </div>
                      <span className="truncate max-w-[100px]">{order.customer_name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      {firstItem?.product_image && (
                        <img
                          src={firstItem.product_image}
                          alt=""
                          className="w-7 h-7 rounded-md object-cover border border-[#E8DFC8] dark:border-[#2B4B36]"
                        />
                      )}
                      <div className="leading-tight">
                        <p className="font-medium truncate max-w-[120px]">{firstItem?.product_name || 'Nourish Jar'}</p>
                        <p className="text-[10px] text-[#7A9383]">{firstItem?.variant_weight || '500g'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center text-xs">
                      {getPaymentIcon(order.payment_method_code)}
                      <span className="capitalize">{order.payment_method_code.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center text-xs">
                      {getDeliveryIcon(order.delivery_method_code)}
                      <span className="truncate max-w-[120px]">
                        {order.delivery_method_code === 'sargodha_sameday' && 'Sargodha (Same Day)'}
                        {order.delivery_method_code === 'tcs_nationwide' && 'TCS (Nationwide)'}
                        {order.delivery_method_code === 'foodpanda_sargodha' && 'Foodpanda (Sargodha)'}
                        {order.delivery_method_code === 'self_pickup' && 'Self Pickup'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-[#10271A] dark:text-[#F7F1E5]">
                    {formatPKR(order.total)}
                  </td>
                  <td className="py-3">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onSelectOrder?.(order)}
                        className="p-1 rounded-md text-[#5A6D60] dark:text-[#8CAE99] hover:bg-neutral-100 dark:hover:bg-[#23422E] transition"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => {
                          const nextStatus: Record<OrderStatus, OrderStatus> = {
                            pending: 'confirmed',
                            confirmed: 'preparing',
                            preparing: 'out_for_delivery',
                            out_for_delivery: 'delivered',
                            delivered: 'delivered',
                            cancelled: 'cancelled'
                          };
                          onUpdateStatus?.(order.id, nextStatus[order.status]);
                        }}
                        className="p-1 rounded-md text-[#5A6D60] dark:text-[#8CAE99] hover:bg-neutral-100 dark:hover:bg-[#23422E] transition"
                        title="Advance Status"
                      >
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
