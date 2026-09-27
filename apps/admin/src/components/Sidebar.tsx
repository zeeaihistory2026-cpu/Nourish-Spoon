import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Star, 
  HelpCircle, 
  Mail, 
  Image as ImageIcon, 
  MapPin, 
  CreditCard, 
  Bell, 
  Palette, 
  BarChart2, 
  UserCheck, 
  Settings 
} from 'lucide-react';

export type AdminTab = 
  | 'dashboard' 
  | 'orders' 
  | 'products' 
  | 'customers' 
  | 'reviews' 
  | 'faq' 
  | 'inquiries' 
  | 'banners' 
  | 'delivery' 
  | 'payments' 
  | 'notifications' 
  | 'appearance' 
  | 'reports' 
  | 'staff' 
  | 'settings';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  ordersBadge?: number;
  inquiriesBadge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab,
  ordersBadge = 24,
  inquiriesBadge = 3
}) => {
  const navItems: Array<{ id: AdminTab; label: string; icon: any; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: ordersBadge },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'inquiries', label: 'Contact Inquiries', icon: Mail, badge: inquiriesBadge },
    { id: 'banners', label: 'Banners & Content', icon: ImageIcon },
    { id: 'delivery', label: 'Delivery & Locations', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'staff', label: 'Admins & Staff', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0A2616] text-[#F7F1E5] flex flex-col justify-between shrink-0 min-h-screen select-none border-r border-[#143D25]">
      {/* Brand Header */}
      <div>
        <div className="pt-6 pb-4 px-6 text-center border-b border-[#143D25]/60 relative overflow-hidden">
          {/* Subtle leaves decoration top */}
          <div className="flex justify-center items-center mb-1">
            <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 12C12 4 4 3 2 10C8 13 14 11 17 12Z" fill="#77A76A" opacity="0.9"/>
              <path d="M17 12C22 4 30 3 32 10C26 13 20 11 17 12Z" fill="#4B8348" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wide text-white leading-tight">
            Nourish<br/>Spoon
          </h1>
          <p className="font-serif italic text-xs text-[#C99B36] tracking-wider mt-1">
            Crafted with Love ♥
          </p>
        </div>

        {/* Navigation list */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E4D30] text-white shadow-sm font-semibold'
                    : 'text-[#C7DACF] hover:bg-[#123620] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={isActive ? 'text-[#84C276]' : 'text-[#8CAE99]'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#C99B36] text-[#0A2616]' : 'bg-[#C99B36]/90 text-[#0A2616]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Botanical Stamp Card */}
      <div className="p-4 m-3 rounded-xl border border-[#C99B36]/30 bg-[#061C10] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C99B36]/40 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C99B36]/40 pointer-events-none" />
        <p className="font-serif text-base text-[#D4AA52] font-semibold leading-snug">
          Good Food<br />
          Happier People ♥
        </p>
        <div className="mt-2 text-[10px] text-[#7A9C86] uppercase tracking-widest font-mono">
          Nourish Spoon v1.0
        </div>
      </div>
    </aside>
  );
};
