import React from 'react';
import { 
  LayoutDashboard, 
  Trello, 
  Calendar, 
  BarChart3, 
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Download
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, totalCount, publishedCount, onLogout }) {
  const remainingCount = totalCount - publishedCount;
  const badgeText = remainingCount > 0 ? (remainingCount > 12 ? '12+' : remainingCount) : '12+';

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', name: 'Tasks', icon: Trello, badge: badgeText },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'list', name: 'Analytics', icon: BarChart3 },
    { id: 'team', name: 'Team', icon: Users },
  ];

  const generalItems = [
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'help', name: 'Help', icon: HelpCircle },
    { id: 'logout', name: 'Logout', icon: LogOut },
  ];

  const handleItemClick = (id) => {
    if (id === 'logout') {
      if (window.confirm('Apakah Anda yakin ingin keluar dari akun?')) {
        onLogout();
      }
      return;
    }

    if (['dashboard', 'kanban', 'calendar', 'list', 'team', 'settings', 'help', 'inbox'].includes(id)) {
      setActiveView(id);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 transition-all duration-300">
      {/* Donezo Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-50 dark:border-slate-800/40">
        <div className="flex items-center gap-3">
          {/* Donezo Logo Custom SVG */}
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-[#0A5C36] dark:text-[#4ADE80] shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg tracking-tight leading-none text-slate-800 dark:text-white">
              Donezo
            </h1>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto scroll-smooth px-4 py-6">
        <div className="space-y-6">
          {/* MENU Category */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Menu
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative group ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {/* Left indicator pill */}
                  <div className={`absolute left-0 w-1 h-6 bg-[#0A5C36] dark:bg-[#4ADE80] rounded-r-md transition-all duration-300 origin-left ${
                    isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                  }`} />
                  
                  <div className={`flex items-center gap-3 ${isActive ? 'pl-2.5' : 'pl-0.5'} group-hover:translate-x-1 transition-transform duration-200`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A5C36] dark:text-[#4ADE80]' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-[#0A5C36] dark:text-[#4ADE80] border border-emerald-100 dark:border-emerald-900/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* GENERAL Category */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              General
            </div>
            {generalItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative group ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {/* Left indicator pill */}
                  <div className={`absolute left-0 w-1 h-6 bg-[#0A5C36] dark:bg-[#4ADE80] rounded-r-md transition-all duration-300 origin-left ${
                    isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                  }`} />

                  <div className="flex items-center gap-3 pl-0.5 group-hover:translate-x-1 transition-transform duration-200">
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-[#0A5C36] dark:text-[#4ADE80]' 
                        : 'text-slate-400 group-hover:text-slate-650 dark:group-hover:text-slate-200'
                    }`} />
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promo Download App Card */}
        <div className="mt-8">
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#063B22] to-[#0A5C36] text-white relative overflow-hidden shadow-md group">
            {/* Wavy Background Elements */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-white/5" />
            
            {/* Icon */}
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            
            {/* Content */}
            <h4 className="text-xs font-bold font-heading">Download our Mobile App</h4>
            <p className="text-[9px] text-emerald-250/85 mt-1 leading-snug">
              Get easy in another way
            </p>
            
            {/* Action Button */}
            <button 
              onClick={() => alert("Donezo Mobile App akan segera tersedia di App Store dan Google Play!")}
              className="w-full mt-4 py-2 bg-emerald-950/40 hover:bg-[#063B22] border border-white/10 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center block"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
