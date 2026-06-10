import React from 'react';
import { Search, Mail, Bell, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  darkMode, 
  toggleDarkMode,
  activeView
}) {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-50 dark:border-slate-800/40 sticky top-0 z-20 transition-all duration-300">
      {/* Search Bar on Left */}
      <div className="relative w-full max-w-sm md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-16 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/20 focus:ring-2 focus:ring-emerald-500/5 transition-all shadow-inner"
        />
        {/* Keyboard shortcut indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery ? (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 cursor-pointer"
            >
              Reset
            </button>
          ) : (
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm">
              ⌘ F
            </span>
          )}
        </div>
      </div>

      {/* Profile and Quick Actions on Right */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 hover:text-slate-750 dark:hover:text-white cursor-pointer transition-all duration-200"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-indigo-500" />
          )}
        </button>

        {/* Mail Button */}
        <button 
          onClick={() => alert("Tidak ada pesan baru.")}
          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-550 dark:text-slate-400 hover:text-[#0A5C36] dark:hover:text-[#4ADE80] cursor-pointer transition-all duration-200 relative"
          title="Inbox"
        >
          <Mail className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Notification Bell Button */}
        <button 
          onClick={() => alert("Tidak ada notifikasi baru.")}
          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-550 dark:text-slate-400 hover:text-[#0A5C36] dark:hover:text-[#4ADE80] cursor-pointer transition-all duration-200 relative"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800" />

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          {/* Avatar (Cartoon style) */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {/* Standard Memoji Face representation */}
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <rect width="32" height="32" fill="#FFE0B2" />
              {/* Hair */}
              <path d="M6 14c0-6 4-10 10-10s10 4 10 10c0 1 0 2-1 2H7c-1 0-1-1-1-2z" fill="#5D4037" />
              {/* Eyes */}
              <circle cx="12" cy="15" r="2" fill="#3E2723" />
              <circle cx="20" cy="15" r="2" fill="#3E2723" />
              {/* Smile */}
              <path d="M12 21c2 2 6 2 8 0" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Cheeks */}
              <circle cx="9" cy="18" r="1.5" fill="#FF8A80" opacity="0.6" />
              <circle cx="23" cy="18" r="1.5" fill="#FF8A80" opacity="0.6" />
            </svg>
          </div>
          <div className="hidden sm:block text-left leading-none">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Totok Michael</div>
            <div className="text-[10px] text-slate-400 mt-1">tmichael20@mail.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
