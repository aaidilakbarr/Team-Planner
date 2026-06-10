import React, { useState } from 'react';
import useDragToScroll from '../hooks/useDragToScroll';
import { 
  Plus, 
  Calendar, 
  Tag, 
  Edit3, 
  MessageSquareCode, 
  Youtube, 
  Instagram, 
  Twitter, 
  Facebook, 
  Sparkles,
  Link,
  ChevronRight
} from 'lucide-react';

export default function KanbanBoard({ contents, onUpdateStatus, onOpenEditModal, onOpenAddModal }) {
  const boardRef = useDragToScroll();
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const columns = ['Draft', 'In Progress', 'Scheduled', 'Published'];

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'YouTube': return <Youtube className="w-3.5 h-3.5 text-red-500" />;
      case 'Instagram': return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
      case 'TikTok': return <Link className="w-3.5 h-3.5 text-cyan-500" />; // custom TikTok representation
      case 'Twitter': return <Twitter className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />;
      case 'Facebook': return <Facebook className="w-3.5 h-3.5 text-indigo-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-brand-500" />;
    }
  };

  const getPlatformPillColor = (platform) => {
    switch (platform) {
      case 'YouTube': return 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30';
      case 'Instagram': return 'bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-900/30';
      case 'TikTok': return 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30';
      case 'Twitter': return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-250 dark:border-slate-700';
      case 'Facebook': return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
      default: return 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30';
    }
  };

  const getPillarPillColor = (pillar) => {
    switch (pillar) {
      case 'Education': return 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400';
      case 'Entertainment': return 'bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400';
      case 'Promotion': return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400';
      case 'Personal': return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  const getPillarTranslation = (pillar) => {
    const map = {
      'Education': 'Edukasi',
      'Entertainment': 'Hiburan',
      'Promotion': 'Promosi',
      'Personal': 'Personal'
    };
    return map[pillar] || pillar;
  };

  const getPlatformGlow = (platform) => {
    switch (platform) {
      case 'YouTube': return 'hover:shadow-red-500/10 dark:hover:shadow-red-500/20 glow-youtube';
      case 'Instagram': return 'hover:shadow-pink-500/10 dark:hover:shadow-pink-500/20 glow-instagram';
      case 'TikTok': return 'hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 glow-tiktok';
      default: return 'hover:shadow-brand-500/10 dark:hover:shadow-brand-500/20 glow-primary';
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, cardId) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    setActiveColumn(column);
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const cardId = parseInt(e.dataTransfer.getData('text/plain'), 10) || draggedCardId;
    if (cardId) {
      onUpdateStatus(cardId, targetStatus);
    }
    setDraggedCardId(null);
    setActiveColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setActiveColumn(null);
  };

  return (
    <div ref={boardRef} className="grid grid-cols-1 md:grid-cols-4 gap-5 h-full min-h-[calc(100vh-12rem)] pb-8 overflow-x-auto items-start select-none scroll-smooth">
      {columns.map((colName) => {
        const colContents = contents.filter(c => c.status === colName);
        const isColumnOver = activeColumn === colName;

        return (
          <div
            key={colName}
            onDragOver={(e) => handleDragOver(e, colName)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, colName)}
            className={`flex flex-col max-h-[75vh] w-full rounded-2xl p-4 transition-all duration-300 border ${
              isColumnOver 
                ? 'bg-brand-50/45 dark:bg-brand-950/10 border-brand-300/60 dark:border-brand-500/30 ring-2 ring-brand-500/5'
                : 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40'
            }`}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-350">
                  {colName}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {colContents.length}
                </span>
              </div>
              
              <button
                onClick={() => onOpenAddModal(colName)}
                className="p-1 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
                title={`Tambah ke ${colName}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Body / Cards List */}
            <div className="flex-1 overflow-y-auto scroll-smooth space-y-3.5 pr-1 py-1 min-h-[250px]">
              {colContents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-300/40 dark:border-slate-800/50 rounded-xl text-slate-400 dark:text-slate-600 text-center">
                  <span className="text-[10px] font-medium uppercase tracking-wider">Tarik file ke sini</span>
                </div>
              ) : (
                colContents.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onOpenEditModal(card)}
                    className={`group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl overflow-hidden p-4 shadow-sm cursor-pointer transition-all duration-300 transform active:scale-[0.98] card-hover-lift ${getPlatformGlow(card.platform)} ${
                      draggedCardId === card.id 
                        ? 'opacity-40 border-dashed border-brand-500 scale-95 shadow-none' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    {/* Cover Image if any */}
                    {card.coverThumbnail && (
                      <div className="w-full h-24 rounded-lg overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={card.coverThumbnail} 
                          alt="Cover Thumbnail" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${getPlatformPillColor(card.platform)}`}>
                        {getPlatformIcon(card.platform)}
                        <span className="ml-0.5">{card.platform}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${getPillarPillColor(card.contentPillar)}`}>
                        {getPillarTranslation(card.contentPillar)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-heading font-semibold text-xs md:text-sm text-slate-800 dark:text-slate-100 group-hover:text-brand-500 dark:group-hover:text-brand-400 leading-snug transition-colors line-clamp-2">
                      {card.title}
                    </h4>

                    {/* Details: Date, Notes/Script Indicator, Tags */}
                    <div className="flex items-center justify-between mt-4.5 pt-3 border-t border-slate-50 dark:border-slate-800/40 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{card.releaseDate || 'Tanpa Tanggal'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {card.notes && (
                          <MessageSquareCode className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" title="Ada catatan/script" />
                        )}
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex items-center gap-0.5 text-brand-500/80">
                            <Tag className="w-3 h-3" />
                            <span>{card.tags.length}</span>
                          </div>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
