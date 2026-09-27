import React, { useState } from 'react';
import { Sidebar, AdminTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FAQPage } from './pages/FAQPage';
import { BannersContentPage } from './pages/BannersContentPage';
import { DeliveryLocationsPage } from './pages/DeliveryLocationsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { AppearancePage } from './pages/AppearancePage';
import { SettingsPage } from './pages/SettingsPage';
import { Users, Mail, Bell, BarChart2, Shield } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange] = useState('1 May 2025 - 31 May 2025');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigateTab={setCurrentTab} searchQuery={searchQuery} />;
      case 'orders':
        return <OrdersPage />;
      case 'products':
        return <ProductsPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'faq':
        return <FAQPage />;
      case 'banners':
        return <BannersContentPage />;
      case 'delivery':
        return <DeliveryLocationsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'appearance':
        return <AppearancePage />;
      case 'settings':
        return <SettingsPage />;
      case 'customers':
        return (
          <div className="space-y-4 max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">Customer Directory</h2>
            <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm divide-y divide-[#E8DFC8]/50 text-xs">
              {[
                { name: 'Hira Malik', phone: '+92 301 2345678', city: 'Sargodha', orders: 3, spend: 'Rs. 7,420' },
                { name: 'Umeera Ali', phone: '+92 321 9876543', city: 'Lahore', orders: 2, spend: 'Rs. 3,899' },
                { name: 'Ayesha Khan', phone: '+92 333 4567890', city: 'Sargodha', orders: 5, spend: 'Rs. 11,200' },
                { name: 'Bilal Ahmed', phone: '+92 300 7654321', city: 'Sargodha', orders: 1, spend: 'Rs. 2,800' },
                { name: 'Sana Iqbal', phone: '+92 345 1122334', city: 'Islamabad', orders: 2, spend: 'Rs. 4,349' },
              ].map((c, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-[#10271A] dark:text-[#F7F1E5]">{c.name}</p>
                    <p className="text-neutral-500">{c.phone} • {c.city}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0D5428] dark:text-[#77A76A] block">{c.spend}</span>
                    <span className="text-[10px] text-neutral-400">{c.orders} orders placed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'inquiries':
        return (
          <div className="space-y-4 max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">Contact Inquiries</h2>
            <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm space-y-3 text-xs">
              {[
                { name: 'Farhan Zaidi', email: 'farhan@gmail.com', msg: 'Interested in ordering 20 gift jars of Panjeeri for wedding distribution in Lahore.', date: 'Today, 11:20 AM' },
                { name: 'Nida Fatima', email: 'nida@outlook.com', msg: 'Do you make sugar-free energy balls for diabetic patients?', date: 'Yesterday, 4:15 PM' },
                { name: 'Dr. Tariq', email: 'tariq.sargodha@clinic.pk', msg: 'Would like to visit your kitchen in Sargodha for pickup.', date: '3 days ago' },
              ].map((inq, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#10271A] dark:text-[#F7F1E5]">{inq.name} ({inq.email})</span>
                    <span className="text-[10px] text-neutral-400">{inq.date}</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 italic">"{inq.msg}"</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="space-y-4 max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">Admins & Staff Access</h2>
            <div className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm divide-y divide-[#E8DFC8]/50 text-xs">
              {[
                { name: 'Tayyaba', role: 'Super Admin / Founder', email: 'tayyaba@nourishspoon.com', status: 'Active' },
                { name: 'Areeba Khan', role: 'Administrator', email: 'areeba@nourishspoon.com', status: 'Active' },
                { name: 'Hamza Tariq', role: 'Order Manager', email: 'hamza@nourishspoon.com', status: 'Active' },
                { name: 'Fatima Zahra', role: 'Content Manager', email: 'fatima@nourishspoon.com', status: 'Active' },
              ].map((s, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-[#10271A] dark:text-[#F7F1E5]">{s.name}</p>
                    <p className="text-neutral-500">{s.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0D5428]/10 text-[#0D5428] dark:text-[#77A76A] font-bold text-[11px]">{s.role}</span>
                    <span className="text-emerald-600 font-bold text-[11px]">● {s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <DashboardPage onNavigateTab={setCurrentTab} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF9EC] dark:bg-[#0C1B12] text-[#10271A] dark:text-[#F7F1E5] font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        ordersBadge={24}
        inquiriesBadge={3}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRange={dateRange}
          onNotificationClick={() => setCurrentTab('inquiries')}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-cream-mesh">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
