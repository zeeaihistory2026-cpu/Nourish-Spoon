import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { Order, OrderStatus } from '@packages/types';
import { formatPKR } from '@packages/utils';
import { Search, Filter, Eye, Phone, MessageSquare, Check, X } from 'lucide-react';
import { EditOrderStatusModal } from '../components/Modals/EditOrderStatusModal';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => storeService.getOrders());
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    return storeService.subscribe(() => {
      setOrders([...storeService.getOrders()]);
    });
  }, []);

  const filtered = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = !search ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search) ||
      o.delivery_city.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusTabs: Array<{ id: 'all' | OrderStatus; label: string }> = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Order Management
          </h2>
          <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
            Track and process WhatsApp-assisted orders, customer details, and fulfillment statuses.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8CAE99]" size={16} />
            <input
              type="text"
              placeholder="Search by order #, phone, name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-white dark:bg-[#14291C]"
            />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8DFC8] dark:border-[#24422F] pb-3">
        {statusTabs.map(tab => {
          const count = tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length;
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#0D5428] text-white shadow-sm'
                  : 'bg-white dark:bg-[#14291C] text-[#5A6D60] dark:text-[#8CAE99] border border-[#E8DFC8] dark:border-[#24422F] hover:bg-[#FFF9EC]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-[#23422E] text-[#10271A] dark:text-[#F7F1E5]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9EC]/60 dark:bg-[#0D2115] border-b border-[#E8DFC8] dark:border-[#24422F] text-[#5A6D60] dark:text-[#8CAE99]">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer & Contact</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Product Items</th>
                <th className="py-3 px-4 font-semibold">Payment / Delivery</th>
                <th className="py-3 px-4 font-semibold">Total (PKR)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#24422F]/40">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-[#FFF9EC]/30 dark:hover:bg-[#1A3625]">
                  <td className="py-3.5 px-4 font-bold text-[#0D5428] dark:text-[#77A76A]">
                    {order.order_number}
                    {order.is_gift && (
                      <span className="block text-[10px] text-[#C99B36] font-normal">🎁 Gift Order</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#10271A] dark:text-[#F7F1E5]">{order.customer_name}</p>
                    <p className="text-[11px] text-[#5A6D60] dark:text-[#8CAE99] flex items-center space-x-1">
                      <Phone size={10} />
                      <span>{order.customer_phone}</span>
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#10271A] dark:text-[#F7F1E5]">{order.delivery_city}</p>
                    <p className="text-[11px] text-[#7A9383] truncate max-w-[150px]">{order.delivery_address}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    {order.items?.map(it => (
                      <div key={it.id} className="text-xs">
                        <span className="font-semibold">{it.product_name}</span> ({it.variant_weight} × {it.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="py-3.5 px-4 capitalize">
                    <p className="font-medium">{order.payment_method_code.replace('_', ' ')}</p>
                    <p className="text-[10px] text-[#7A9383]">{order.delivery_method_code.replace('_', ' ')}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#10271A] dark:text-[#F7F1E5]">
                    {formatPKR(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      order.status === 'delivered' ? 'bg-[#E3F5EC] text-[#0D5428]' :
                      order.status === 'out_for_delivery' ? 'bg-[#E0F2FE] text-[#0369A1]' :
                      order.status === 'confirmed' ? 'bg-[#FEF3C7] text-[#92400E]' :
                      order.status === 'preparing' ? 'bg-[#F3E8FF] text-[#6B21A8]' :
                      order.status === 'pending' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 rounded-lg bg-[#0D5428]/10 text-[#0D5428] dark:text-[#77A76A] hover:bg-[#0D5428] hover:text-white font-semibold transition inline-flex items-center space-x-1"
                    >
                      <Eye size={13} />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditOrderStatusModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(id, st) => storeService.updateOrderStatus(id, st)}
      />
    </div>
  );
};
