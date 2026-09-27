import React, { useState } from 'react';
import { X, CheckCircle, Package, Truck, Clock, Ban } from 'lucide-react';
import { Order, OrderStatus } from '@packages/types';
import { formatPKR } from '@packages/utils';

interface EditOrderStatusModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const EditOrderStatusModal: React.FC<EditOrderStatusModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  if (!isOpen || !order) return null;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

  const statuses: Array<{ value: OrderStatus; label: string; icon: any; color: string }> = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-500' },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-yellow-600' },
    { value: 'preparing', label: 'Preparing', icon: Package, color: 'text-purple-600' },
    { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'text-blue-500' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-emerald-600' },
    { value: 'cancelled', label: 'Cancelled', icon: Ban, color: 'text-rose-500' },
  ];

  const handleSave = () => {
    onUpdateStatus(order.id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#14291C] rounded-2xl w-full max-w-lg p-6 border border-[#E8DFC8] dark:border-[#24422F] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8] dark:border-[#24422F]">
          <div>
            <span className="text-xs font-bold text-[#C99B36] uppercase tracking-wider">Order Management</span>
            <h3 className="font-serif text-xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
              Order #{order.order_number}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-[#23422E] text-[#5A6D60] dark:text-[#8CAE99]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Customer & Delivery details */}
        <div className="mt-4 p-3.5 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#5A6D60] dark:text-[#8CAE99]">Customer:</span>
            <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">{order.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A6D60] dark:text-[#8CAE99]">Phone:</span>
            <span className="font-medium text-[#10271A] dark:text-[#F7F1E5]">{order.customer_phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A6D60] dark:text-[#8CAE99]">City / Address:</span>
            <span className="font-medium text-[#10271A] dark:text-[#F7F1E5] text-right max-w-[220px]">
              {order.delivery_city}, {order.delivery_address}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A6D60] dark:text-[#8CAE99]">Payment / Delivery:</span>
            <span className="font-medium text-[#10271A] dark:text-[#F7F1E5] capitalize">
              {order.payment_method_code.replace('_', ' ')} • {order.delivery_method_code.replace('_', ' ')}
            </span>
          </div>
          {order.is_gift && (
            <div className="pt-2 border-t border-[#E8DFC8] dark:border-[#2B4B36] text-[#C99B36]">
              🎁 <strong>Gift Order:</strong> "{order.gift_message || 'Gift packaging requested'}"
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-bold text-[#5A6D60] dark:text-[#8CAE99] uppercase tracking-wider">
            Order Items
          </h4>
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-[#1A3625] text-xs"
            >
              <div className="flex items-center space-x-2">
                {item.product_image && (
                  <img src={item.product_image} alt="" className="w-8 h-8 rounded object-cover" />
                )}
                <div>
                  <p className="font-bold text-[#10271A] dark:text-[#F7F1E5]">{item.product_name}</p>
                  <p className="text-[10px] text-[#7A9383]">{item.variant_weight} × {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-[#0D5428] dark:text-[#77A76A]">
                {formatPKR(item.total_price)}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-xs font-bold pt-2 border-t border-[#E8DFC8] dark:border-[#24422F]">
            <span>Total Amount:</span>
            <span className="text-sm text-[#0D5428] dark:text-[#77A76A]">{formatPKR(order.total)}</span>
          </div>
        </div>

        {/* Change Status Options */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-[#10271A] dark:text-[#F7F1E5] mb-2">
            Update Order Status
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {statuses.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedStatus === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSelectedStatus(s.value)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border transition text-left ${
                    isSelected
                      ? 'border-[#0D5428] bg-[#0D5428]/10 dark:bg-[#77A76A]/20 font-bold'
                      : 'border-[#E8DFC8] dark:border-[#2B4B36] hover:bg-neutral-50 dark:hover:bg-[#1A3625]'
                  }`}
                >
                  <Icon size={16} className={s.color} />
                  <span className="text-[#10271A] dark:text-[#F7F1E5]">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#E8DFC8] dark:border-[#24422F]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] text-[#5A6D60] dark:text-[#8CAE99] hover:bg-neutral-100 dark:hover:bg-[#23422E]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs rounded-xl bg-[#0D5428] hover:bg-[#073B21] text-white font-bold transition shadow-sm"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};
