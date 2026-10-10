import React from 'react';
import { Search, Calendar, ChevronDown, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dateRange: string;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  dateRange,
  onNotificationClick
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="min-h-20 bg-white dark:bg-[#14291C] border-b border-[#E8DFC8] dark:border-[#24422F] px-4 xl:px-8 py-3 gap-3 flex flex-wrap items-center justify-between transition-colors shrink-0">
      {/* Search Bar */}
      <div className="relative w-full sm:w-72 xl:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CAE99] dark:text-[#648771]" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search orders, customers, products, or inquiries..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/50 dark:bg-[#0D2115] text-[#10271A] dark:text-[#F7F1E5] placeholder-[#7D9485] focus:outline-none focus:ring-2 focus:ring-[#0D5428] dark:focus:ring-[#77A76A]"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 xl:gap-5 flex-wrap">
        {/* Date Filter Pill */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/40 dark:bg-[#0D2115] text-xs font-medium text-[#10271A] dark:text-[#F7F1E5] hover:bg-[#FFF9EC] transition">
          <Calendar size={14} className="text-[#0D5428] dark:text-[#77A76A]" />
          <span>{dateRange}</span>
          <ChevronDown size={14} className="text-[#8CAE99]" />
        </div>

        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick}
          className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#1E3928] text-[#10271A] dark:text-[#F7F1E5] transition"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 p-1.5 rounded-full border border-[#E8DFC8] dark:border-[#2B4B36] bg-[#FFF9EC]/60 dark:bg-[#0D2115] transition"
          title="Toggle light/dark theme"
        >
          <div className={`p-1 rounded-full ${theme === 'light' ? 'bg-[#0D5428] text-white' : 'text-[#8CAE99]'}`}>
            <Sun size={14} />
          </div>
          <div className={`p-1 rounded-full ${theme === 'dark' ? 'bg-[#77A76A] text-[#0C1B12]' : 'text-[#8CAE99]'}`}>
            <Moon size={14} />
          </div>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-[#E8DFC8] dark:border-[#2B4B36]">
          <img
            src="/assets/admin/avatar_areeba.png"
            alt="Areeba Khan"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#0D5428]/30 shadow-sm"
            onError={(e) => {
              // Fallback to stylized initials if image load fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="text-left">
            <p className="text-sm font-bold text-[#10271A] dark:text-[#F7F1E5] leading-tight">
              Areeba Khan
            </p>
            <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
