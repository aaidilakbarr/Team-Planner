import React, { useState } from 'react';
import useDragToScroll from '../hooks/useDragToScroll';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Youtube, 
  Instagram, 
  Twitter, 
  Facebook, 
  Link,
  Sparkles,
  CalendarDays
} from 'lucide-react';

export default function CalendarView({ contents, onUpdateDate, onOpenEditModal, onOpenAddModal }) {
  const calendarScrollRef = useDragToScroll();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  // Adjust so Monday is 0, Sunday is 6
  let firstDayIndex = new Date(year, month, 1).getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6; // Sunday becomes index 6

  // Pad the starting empty cells
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => null);
  
  // Create days array
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  
  const allCells = [...blanks, ...days];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateString = (dayNum) => {
    if (!dayNum) return '';
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const formattedDay = dayNum.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // Drag-and-drop operations
  const handleDragStart = (e, cardId) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, dateStr) => {
    e.preventDefault();
    setHoveredDate(dateStr);
  };

  const handleDragLeave = () => {
    setHoveredDate(null);
  };

  const handleDrop = (e, targetDateStr) => {
    e.preventDefault();
    const cardId = parseInt(e.dataTransfer.getData('text/plain'), 10) || draggedCardId;
    if (cardId && targetDateStr) {
      onUpdateDate(cardId, targetDateStr);
    }
    setDraggedCardId(null);
    setHoveredDate(null);
  };

  const handleCellClick = (e, dateStr) => {
    // Only trigger if clicking the empty cell space, not an existing card
    if (e.target.closest('.calendar-card-item')) return;
    onOpenAddModal(null, dateStr);
  };

  const getPlatformClass = (platform) => {
    switch (platform) {
      case 'YouTube': return 'bg-red-500/10 hover:bg-red-500/15 border-red-500/25 text-red-700 dark:text-red-400';
      case 'Instagram': return 'bg-pink-500/10 hover:bg-pink-500/15 border-pink-500/25 text-pink-700 dark:text-pink-400';
      case 'TikTok': return 'bg-cyan-500/10 hover:bg-cyan-500/15 border-cyan-500/25 text-cyan-700 dark:text-cyan-400';
      case 'Twitter': return 'bg-slate-500/10 hover:bg-slate-500/15 border-slate-500/25 text-slate-700 dark:text-slate-400';
      case 'Facebook': return 'bg-blue-600/10 hover:bg-blue-600/15 border-blue-600/25 text-blue-700 dark:text-blue-400';
      default: return 'bg-purple-500/10 hover:bg-purple-500/15 border-purple-500/25 text-purple-700 dark:text-purple-400';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'YouTube': return <Youtube className="w-2.5 h-2.5 flex-shrink-0" />;
      case 'Instagram': return <Instagram className="w-2.5 h-2.5 flex-shrink-0" />;
      case 'TikTok': return <Link className="w-2.5 h-2.5 flex-shrink-0" />;
      case 'Twitter': return <Twitter className="w-2.5 h-2.5 flex-shrink-0" />;
      case 'Facebook': return <Facebook className="w-2.5 h-2.5 flex-shrink-0" />;
      default: return <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />;
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-brand-500" />
          <h3 className="font-heading font-extrabold text-base md:text-lg text-slate-800 dark:text-white capitalize">
            {months[month]} {year}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Hari Ini
          </button>
          
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div ref={calendarScrollRef} className="flex-1 overflow-x-auto min-w-[700px] select-none scroll-smooth">
        {/* Days of Week Header */}
        <div className="calendar-grid text-center py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/40 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid Cells */}
        <div className="calendar-grid border-l border-t border-slate-100 dark:border-slate-800/40 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10">
          {allCells.map((dayNum, index) => {
            const dateStr = formatDateString(dayNum);
            const isToday = dateStr === todayStr;
            const isTargeted = hoveredDate === dateStr;

            // Filter content items that match this date
            const dayContents = dayNum 
              ? contents.filter(c => c.releaseDate === dateStr) 
              : [];

            return (
              <div
                key={index}
                onDragOver={(e) => dayNum && handleDragOver(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => dayNum && handleDrop(e, dateStr)}
                onClick={(e) => dayNum && handleCellClick(e, dateStr)}
                className={`min-h-[105px] p-2 border-r border-b border-slate-100 dark:border-slate-800/40 flex flex-col justify-between transition-all relative select-none ${
                  !dayNum 
                    ? 'bg-slate-50/40 dark:bg-slate-900/20 cursor-default' 
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/25 cursor-pointer'
                } ${isTargeted ? 'bg-brand-50/40 dark:bg-brand-950/10 ring-2 ring-brand-500/20 inset-0' : ''}`}
              >
                {/* Date Label */}
                {dayNum && (
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className={`text-xs font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-brand-500 text-white shadow shadow-brand-500/20' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {dayNum}
                    </span>
                    
                    {dayContents.length > 0 && (
                      <span className="text-[9px] font-semibold text-slate-400">
                        {dayContents.length} Rencana
                      </span>
                    )}
                  </div>
                )}

                {/* Date Contents items */}
                {dayNum && (
                  <div className="flex-1 space-y-1 overflow-y-auto max-h-[70px] pr-0.5">
                    {dayContents.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragEnd={() => setDraggedCardId(null)}
                        onClick={() => onOpenEditModal(item)}
                        className={`calendar-card-item p-1.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1.5 truncate cursor-grab active:cursor-grabbing transition-all ${getPlatformClass(item.platform)}`}
                        title={item.title}
                      >
                        {getPlatformIcon(item.platform)}
                        <span className="truncate flex-1 leading-none">{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Add overlay button */}
                {dayNum && dayContents.length === 0 && (
                  <div className="opacity-0 hover:opacity-100 absolute inset-0 flex items-center justify-center bg-brand-500/5 transition-opacity">
                    <div className="p-1 rounded-lg bg-brand-500 text-white shadow shadow-brand-500/20">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
