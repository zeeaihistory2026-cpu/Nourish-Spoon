import React, { useState } from 'react';
import { KPICards } from '../components/KPICards';
import { SalesChart } from '../components/SalesChart';
import { OrdersDonutChart } from '../components/OrdersDonutChart';
import { TopProducts } from '../components/TopProducts';
import { RecentOrdersTable } from '../components/RecentOrdersTable';
import { RecentReviewsList } from '../components/RecentReviewsList';
import { ContentManagementCards } from '../components/ContentManagementCards';
import { PaymentDeliveryStats } from '../components/PaymentDeliveryStats';
import { QuickActions } from '../components/QuickActions';
import { AddProductModal } from '../components/Modals/AddProductModal';
import { EditOrderStatusModal } from '../components/Modals/EditOrderStatusModal';
import { AddFAQModal } from '../components/Modals/AddFAQModal';
import { NotificationModal } from '../components/Modals/NotificationModal';
import { storeService } from '../services/storeService';
import { Order, OrderStatus } from '@packages/types';
import { AdminTab } from '../components/Sidebar';

interface DashboardPageProps {
  onNavigateTab: (tab: AdminTab) => void;
  searchQuery?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab, searchQuery = '' }) => {
  const [orders, setOrders] = useState(() => storeService.getOrders());
  const [reviews, setReviews] = useState(() => storeService.getReviews());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modals state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    storeService.updateOrderStatus(orderId, status);
    setOrders([...storeService.getOrders()]);
    showToast(`Order status updated to ${status}`);
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.order_number.toLowerCase().includes(q) ||
           o.customer_name.toLowerCase().includes(q) ||
           o.delivery_city.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D5428] text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-sm font-semibold animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Row 1: KPI Cards */}
      <KPICards
        totalOrders={orders.length > 5 ? orders.length : 428}
        revenue={214350}
        customers={312}
        rating={4.8}
        reviewCount={122}
        repeatRate={37}
      />

      {/* Row 2: Sales Overview (5 cols) + Orders by Status (3.5 cols) + Top Products (3.5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 h-[320px]">
          <SalesChart />
        </div>
        <div className="lg:col-span-3 h-[320px]">
          <OrdersDonutChart />
        </div>
        <div className="lg:col-span-4 h-[320px]">
          <TopProducts onViewAll={() => onNavigateTab('products')} />
        </div>
      </div>

      {/* Row 3: Recent Orders Table (8 cols) + Recent Reviews (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <RecentOrdersTable
            orders={filteredOrders}
            onViewAll={() => onNavigateTab('orders')}
            onSelectOrder={setSelectedOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
        <div className="lg:col-span-4">
          <RecentReviewsList
            reviews={reviews}
            onViewAll={() => onNavigateTab('reviews')}
          />
        </div>
      </div>

      {/* Row 4: Content Management (4.5 cols) + Payments & Delivery (4.5 cols) + Quick Actions (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <ContentManagementCards
            onEditBanner={() => onNavigateTab('banners')}
            onEditStory={() => onNavigateTab('banners')}
            onManageFAQ={() => onNavigateTab('faq')}
            onEditContact={() => onNavigateTab('inquiries')}
          />
        </div>
        <div className="lg:col-span-4">
          <PaymentDeliveryStats
            onManage={() => onNavigateTab('delivery')}
          />
        </div>
        <div className="lg:col-span-3">
          <QuickActions
            onAddProduct={() => setShowAddProduct(true)}
            onManageFAQ={() => setShowAddFAQ(true)}
            onPublishBanner={() => {
              onNavigateTab('banners');
              showToast('Navigated to Banner Management');
            }}
            onSendNotification={() => setShowNotification(true)}
            onExportReport={() => {
              showToast('Exporting monthly order reports to CSV...');
              setTimeout(() => showToast('Report downloaded: Nourish_Spoon_May_2025.csv'), 1000);
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSave={(newProduct) => {
          storeService.addProduct(newProduct as any);
          showToast(`Added product: ${newProduct.name}`);
        }}
      />

      <EditOrderStatusModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      <AddFAQModal
        isOpen={showAddFAQ}
        onClose={() => setShowAddFAQ(false)}
        onSave={(newFaq) => {
          storeService.addFAQ(newFaq);
          showToast('Added FAQ successfully!');
        }}
      />

      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        onSend={({ title, audience }) => {
          showToast(`Broadcasted "${title}" to ${audience}`);
        }}
      />
    </div>
  );
};
