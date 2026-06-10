import React, { useState } from 'react';
import { Search, Mail, Bell, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  darkMode, 
  toggleDarkMode,
  activeView,
  setActiveView,
  currentUser,
  notifications,
  setNotifications
}) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

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
          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-550 dark:text-slate-400 hover:text-slate-755 dark:hover:text-white cursor-pointer transition-all duration-200"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-indigo-500" />
          )}
        </button>

        {/* Mail Button (Inbox) */}
        <button 
          onClick={() => setActiveView('inbox')}
          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer relative ${
            activeView === 'inbox' 
              ? 'bg-emerald-50 border-emerald-100 text-[#0A5C36] dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-[#4ADE80]' 
              : 'border-slate-100 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-[#0A5C36] dark:hover:text-[#4ADE80]'
          }`}
          title="Inbox"
        >
          <Mail className="w-4.5 h-4.5" />
          {activeView !== 'inbox' && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
        </button>

        {/* Notification Bell Button */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer relative ${
              showNotifDropdown
                ? 'bg-emerald-50 border-emerald-100 text-[#0A5C36] dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-[#4ADE80]'
                : 'border-slate-100 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-[#0A5C36] dark:hover:text-[#4ADE80]'
            }`}
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 glass bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl shadow-2xl p-4 z-55 animate-page-in max-h-[380px] flex flex-col backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50 mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Notifikasi ({unreadCount} Baru)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                    }}
                    className="text-[10px] font-bold text-[#0A5C36] dark:text-[#4ADE80] hover:underline cursor-pointer"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto scroll-smooth space-y-2.5 pr-0.5">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                    Tidak ada notifikasi baru.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        // Mark this notification as read
                        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                      }}
                      className={`p-2.5 rounded-xl border transition-all text-[11px] leading-relaxed cursor-pointer ${
                        notif.read
                          ? 'bg-slate-50/40 dark:bg-slate-950/10 border-transparent text-slate-400 dark:text-slate-500'
                          : 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100/50 dark:border-emerald-900/20 text-slate-800 dark:text-slate-200 font-semibold shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="flex-1">{notif.text}</p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1.5 font-medium">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800" />

        {/* User Profile Info */}
        <div 
          onClick={() => setActiveView('settings')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Account Settings"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-150 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#0A5C36]/50">
            {currentUser?.customPhoto ? (
              <img 
                src={currentUser.customPhoto} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <rect width="32" height="32" fill={currentUser?.avatarColor || '#FFE0B2'} />
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
            )}
          </div>
          
          <div className="hidden sm:block text-left leading-none">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0A5C36] dark:group-hover:text-[#4ADE80] transition-colors">
              {currentUser?.username || 'Totok Michael'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {currentUser?.email || 'tmichael20@mail.com'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
