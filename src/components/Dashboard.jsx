import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowRight,
  Settings2,
  Calendar as CalendarIcon,
  Sparkles,
  ChevronRight,
  Code,
  Globe,
  Layout,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({ contents, targets, onSaveTarget, onOpenAddModal, setActiveView }) {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tempTargets, setTempTargets] = useState({ ...targets });

  // 1. DYNAMIC REMINDERS LOGIC
  // Displays up to 3 upcoming contents within the next 3 days, sorted by releaseDate ascending.
  // Responsively updates when cards are dragged and dropped (shifts dates or marks as Published).
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(23, 59, 59, 999);

    const filteredReminders = contents.filter(c => {
      if (!c.releaseDate) return false;
      if (c.status === 'Published') return false; // "saat konten sudah di upload ... maka tidak akan ada di reminder"
      
      const releaseDateObj = new Date(c.releaseDate);
      releaseDateObj.setHours(0, 0, 0, 0);
      
      // "lebih 3 hari dari tanggal saat ini maka tidak akan ada di reminder"
      return releaseDateObj >= today && releaseDateObj <= threeDaysLater;
    });

    // Sort by release date ascending
    filteredReminders.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

    setReminders(filteredReminders.slice(0, 3));
  }, [contents]);

  // 2. MINI CALENDAR GENERATOR
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  // Fill offset blank cells
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Fill days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Helper to check if a calendar date has scheduled contents
  const hasScheduledContent = (day) => {
    if (!day) return false;
    const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return contents.some(c => c.releaseDate === dateStr);
  };

  // 3. Real Database metrics
  const totalProjectsCount = contents.length;
  const endedProjectsCount = contents.filter(c => c.status === 'Published').length;
  const runningProjectsCount = contents.filter(c => c.status === 'In Progress' || c.status === 'Scheduled').length;
  const pendingProjectsCount = contents.filter(c => c.status === 'Draft').length;

  const displayTotal = totalProjectsCount > 0 ? totalProjectsCount : 24;
  const displayEnded = totalProjectsCount > 0 ? endedProjectsCount : 10;
  const displayRunning = totalProjectsCount > 0 ? runningProjectsCount : 12;
  const displayPending = totalProjectsCount > 0 ? pendingProjectsCount : 2;

  const completedPercentage = displayTotal > 0 ? Math.round((displayEnded / displayTotal) * 100) : 41;
  const inProgressPercentage = displayTotal > 0 ? Math.round((displayRunning / displayTotal) * 100) : 34;
  const pendingPercentage = displayTotal > 0 ? Math.round((displayPending / displayTotal) * 100) : 25;

  const progressGaugeData = [
    { name: 'Completed', value: completedPercentage, fill: '#4ADE80' },
    { name: 'In Progress', value: inProgressPercentage, fill: '#0A5C36' },
    { name: 'Pending', value: pendingPercentage, fill: 'url(#greyStripes)' }
  ];

  // Recharts Data: Bar Chart matching Donezo mockup
  const weeklyAnalyticsData = [
    { day: 'S', value: 45, fill: 'url(#mintStripes)' },
    { day: 'M', value: 70, fill: '#0A5C36' },
    { day: 'T', value: 60, fill: '#4ADE80', showBubble: true }, // Tuesday active tooltip bubble
    { day: 'W', value: 82, fill: '#0A5C36' },
    { day: 'T', value: 55, fill: 'url(#mintStripes)' },
    { day: 'F', value: 38, fill: 'url(#mintStripes)' },
    { day: 'S', value: 48, fill: 'url(#mintStripes)' }
  ];

  const mockupProjects = [
    { title: 'Develop API Endpoints', date: 'Due date: Nov 26, 2024', icon: Code, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Onboarding Flow', date: 'Due date: Nov 28, 2024', icon: Globe, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20' },
    { title: 'Build Dashboard', date: 'Due date: Nov 30, 2024', icon: Layout, color: 'text-[#0A5C36] bg-emerald-50 dark:bg-emerald-950/20' },
    { title: 'Optimize Page Load', date: 'Due date: Dec 5, 2024', icon: Cpu, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { title: 'Cross-Browser Testing', date: 'Due date: Dec 6, 2024', icon: Layers, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
  ];

  // Bind real data if available
  const displayProjects = contents.length > 0 
    ? contents.slice(0, 5).map((c, idx) => {
        const item = mockupProjects[idx % mockupProjects.length];
        return {
          title: c.title,
          date: c.releaseDate ? `Due date: ${c.releaseDate}` : 'No due date',
          icon: item.icon,
          color: item.color
        };
      })
    : mockupProjects;

  // Custom rounded capsule bar shape for Project Analytics
  const RoundedBarShape = (props) => {
    const { fill, x, y, width, height } = props;
    if (height === 0) return null;
    const radius = width / 2;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill={fill}
          className="transition-all duration-300 hover:opacity-90 hover:shadow-lg cursor-pointer"
        />
        {/* Custom active tooltip bubble on Tuesday's bar */}
        {props.showBubble && (
          <g>
            <rect 
              x={x + width / 2 - 18} 
              y={y - 24} 
              width="36" 
              height="18" 
              rx="4" 
              fill="#E8FDF5" 
              stroke="#A7F3D0" 
              strokeWidth="1" 
            />
            <polygon points={`${x + width / 2 - 4},${y - 6} ${x + width / 2},${y - 2} ${x + width / 2 + 4},${y - 6}`} fill="#E8FDF5" stroke="#A7F3D0" strokeWidth="0.5" />
            <polygon points={`${x + width / 2 - 4},${y - 7} ${x + width / 2},${y - 3} ${x + width / 2 + 4},${y - 7}`} fill="#E8FDF5" />
            <text 
              x={x + width / 2} 
              y={y - 12} 
              textAnchor="middle" 
              fill="#0A5C36" 
              fontSize="9" 
              fontWeight="bold"
            >
              74%
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* SVG Patterns Injection */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="mintStripes" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#F4FBF7" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#D2EBE0" strokeWidth="3" />
          </pattern>
          <pattern id="greyStripes" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#F8FAFC" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#E2E8F0" strokeWidth="3" />
          </pattern>
        </defs>
      </svg>

      {/* Main Dashboard Title and Global Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (contents.length > 0) {
                const dataStr = JSON.stringify({ contents, exportedAt: new Date().toISOString() }, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', `donezo_backup_${new Date().toISOString().split('T')[0]}.json`);
                linkElement.click();
              } else {
                alert("Tidak ada data untuk diekspor. Silakan buat rencana baru terlebih dahulu.");
              }
            }}
            className="flex items-center gap-2 px-4.5 py-2.5 border border-[#0A5C36] text-[#0A5C36] hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/20 rounded-full font-bold text-xs md:text-sm transition-all cursor-pointer"
          >
            Import Data
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-[#0A5C36] hover:bg-[#084d2d] text-white rounded-full font-bold text-xs md:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Projects (Primary Colored Card) */}
        <div className="p-5 rounded-3xl bg-[#0A5C36] text-white shadow-sm flex flex-col justify-between h-36 relative overflow-hidden group card-hover-lift cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-white/85">Total Projects</span>
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </button>
          </div>
          <div>
            <div className="font-heading font-extrabold text-3xl md:text-4xl leading-none">{displayTotal}</div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">5↗</span>
              <span className="text-[10px] text-white/80">Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Ended Projects */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-36 group card-hover-lift cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Ended Projects</span>
            <button className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
          <div>
            <div className="font-heading font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-white leading-none">{displayEnded}</div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-[#0A5C36] dark:text-[#4ADE80] border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-bold">6▲</span>
              <span className="text-[10px] text-slate-400">Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Running Projects */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-36 group card-hover-lift cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Running Projects</span>
            <button className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
          <div>
            <div className="font-heading font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-white leading-none">{displayRunning}</div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-[#0A5C36] dark:text-[#4ADE80] border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-bold">2▲</span>
              <span className="text-[10px] text-slate-400">Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Pending Project */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-36 group card-hover-lift cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Pending Project</span>
            <button className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
          <div>
            <div className="font-heading font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-white leading-none">{displayPending}</div>
            <div className="mt-3">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">On Discuss</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Analytics Card (WIDER: col-span-8, barSize={36}) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-[340px]">
          <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white mb-5">
            Project Analytics
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAnalyticsData} margin={{ top: 25, right: 10, left: -25, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    background: '#0F172A', 
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  barSize={36}
                  shape={<RoundedBarShape showBubble={false} />}
                >
                  {weeklyAnalyticsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                      className="transition-all duration-300 hover:opacity-85"
                      {...({ showBubble: entry.showBubble })} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reminders Card: Showing dynamic upcoming content in next 3 days */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white mb-1">
              Reminders
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Konten Rilis Terdekat (3 Hari)
            </p>

            <div className="mt-5 space-y-4">
              {reminders.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-100 dark:border-slate-800/80 rounded-2xl p-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-450 dark:text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-750 dark:text-slate-350">Tidak ada konten terdekat</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                    Semua rencana sudah terbit atau dijadwalkan di luar jendela 3 hari.
                  </p>
                </div>
              ) : (
                reminders.map((item, idx) => (
                  <div 
                    key={item.id || idx} 
                    className="p-3 bg-slate-50 dark:bg-slate-950/35 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-start justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-[#0A5C36] dark:text-[#4ADE80] font-bold mt-1">
                        Tanggal: {item.releaseDate}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-[8px] font-bold rounded bg-emerald-50 text-[#0A5C36] dark:bg-emerald-950/20 dark:text-[#4ADE80] border border-emerald-100 dark:border-emerald-900/30 flex-shrink-0">
                      {item.platform}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setActiveView('calendar')}
            className="w-full py-2.5 bg-[#0A5C36] hover:bg-[#084d2d] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <span>Buka Kalender Rilis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team Collaboration Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white">
              Team Collaboration
            </h3>
            <button 
              onClick={() => setActiveView('team')}
              className="px-3 py-1.5 text-[10px] font-bold border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 rounded-full text-[#0A5C36] dark:text-[#4ADE80] transition-colors cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scroll-smooth space-y-4 pr-0.5">
            {[
              { name: 'Alexandra Deff', role: 'Working on Github Project Repository', status: 'Completed', statusColor: 'border-emerald-150 text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20' },
              { name: 'Edwin Adenike', role: 'Working on Integrate User Authentication System', status: 'In Progress', statusColor: 'border-amber-150 text-amber-600 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20' },
              { name: 'Isaac Oluwatemilorun', role: 'Working on Develop Search and Filter Functionality', status: 'Pending', statusColor: 'border-red-150 text-red-500 bg-red-50/40 dark:bg-red-950/20' },
              { name: 'David Oshodi', role: 'Working on Responsive Layout for Homepage', status: 'In Progress', statusColor: 'border-amber-150 text-amber-600 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20' }
            ].map((member, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:translate-x-1 transition-all duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8.5 h-8.5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-850 flex-shrink-0 bg-slate-50">
                    <svg viewBox="0 0 32 32" className="w-full h-full">
                      <rect width="32" height="32" fill={idx % 2 === 0 ? '#FFE0B2' : '#C8E6C9'} />
                      <circle cx="16" cy="12" r="6" fill="#3E2723" />
                      <circle cx="12" cy="15" r="1.5" fill="#FFE0B2" />
                      <circle cx="20" cy="15" r="1.5" fill="#FFE0B2" />
                      <path d="M8 26c0-4 4-6 8-6s8 2 8 6H8z" fill="#5D4037" />
                    </svg>
                  </div>
                  <div className="min-w-0 leading-none">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{member.name}</h4>
                    <p className="text-[9px] text-slate-400 truncate mt-1">{member.role}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border flex-shrink-0 ${member.statusColor}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project List Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white">
              Project
            </h3>
            <button 
              onClick={onOpenAddModal}
              className="px-2.5 py-1 text-[10px] font-bold border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 rounded-full text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
            >
              + New
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto scroll-smooth space-y-3.5 pr-0.5">
            {displayProjects.map((proj, idx) => {
              const IconComponent = proj.icon;
              return (
                <div key={idx} className="flex items-center gap-3 group p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:translate-x-1 transition-all duration-200">
                  <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center ${proj.color} flex-shrink-0`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0A5C36] dark:group-hover:text-[#4ADE80] transition-colors leading-tight">
                      {proj.title}
                    </h4>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-none">
                      {proj.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini Calendar Card (Replaces Time Tracker) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-80">
          {/* Mini Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#0A5C36] dark:text-[#4ADE80]" />
              <h3 className="font-heading font-extrabold text-xs text-slate-800 dark:text-white capitalize">
                {monthNames[currentMonth]} {currentYear}
              </h3>
            </div>
            {/* Arrow Link to Calendar View */}
            <button 
              onClick={() => setActiveView('calendar')}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 hover:text-[#0A5C36] dark:hover:text-[#4ADE80] transition-all cursor-pointer"
              title="Calendar View"
            >
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Mini Month Grid */}
          <div className="flex-1 flex flex-col justify-center mt-3 select-none">
            {/* Abbr Day Names */}
            <div className="grid grid-cols-7 text-center text-[9px] font-bold text-slate-400 mb-1.5">
              {daysOfWeek.map((day, dIdx) => (
                <div key={dIdx}>{day}</div>
              ))}
            </div>

            {/* Monthly numbers grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-semibold text-slate-700 dark:text-slate-350">
              {calendarDays.map((day, idx) => {
                const isToday = day === currentDay;
                const isScheduled = hasScheduledContent(day);
                
                return (
                  <div key={idx} className="h-6 flex flex-col justify-between items-center relative py-0.5">
                    {day ? (
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday 
                          ? 'bg-[#0A5C36] text-white font-extrabold shadow shadow-[#0A5C36]/20' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer'
                      }`}>
                        {day}
                      </span>
                    ) : (
                      <span />
                    )}
                    {/* Scheduled green dot dot */}
                    {isScheduled && (
                      <span className="w-1 h-1 rounded-full bg-[#4ADE80] absolute bottom-[-1px]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
