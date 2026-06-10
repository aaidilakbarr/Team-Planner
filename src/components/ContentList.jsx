import React, { useState, useRef } from 'react';
import useDragToScroll from '../hooks/useDragToScroll';
import { 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Youtube, 
  Instagram, 
  Twitter, 
  Facebook, 
  Link,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  FileDown,
  FileUp,
  AlertCircle
} from 'lucide-react';

export default function ContentList({ 
  contents, 
  searchQuery, 
  onOpenEditModal, 
  onDeleteContent, 
  onImportBackup 
}) {
  const tableScrollRef = useDragToScroll();
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pillarFilter, setPillarFilter] = useState('All');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  // Filters calculation
  const filteredContents = contents.filter(c => {
    // 1. Search Query
    const matchSearch = searchQuery.trim() === '' || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.tags && c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
    // 2. Platform Filter
    const matchPlatform = platformFilter === 'All' || c.platform === platformFilter;
    
    // 3. Status Filter
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;

    // 4. Pillar Filter
    const matchPillar = pillarFilter === 'All' || c.contentPillar === pillarFilter;

    return matchSearch && matchPlatform && matchStatus && matchPillar;
  });

  // Export JSON Backup
  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify({ contents, exportedAt: new Date().toISOString() }, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `planner_hub_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Ekspor gagal:', err);
    }
  };

  // Import JSON Backup
  const handleImportClick = () => {
    setImportError('');
    setImportSuccess('');
    fileInputRef.current.click();
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        await onImportBackup(text);
        setImportSuccess('Data cadangan berhasil diimpor!');
        setTimeout(() => setImportSuccess(''), 4000);
      } catch (err) {
        setImportError('Gagal mengimpor file. Pastikan format JSON benar.');
        setTimeout(() => setImportError(''), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'YouTube': return <Youtube className="w-3.5 h-3.5 text-red-500" />;
      case 'Instagram': return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
      case 'TikTok': return <Link className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Twitter': return <Twitter className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />;
      case 'Facebook': return <Facebook className="w-3.5 h-3.5 text-indigo-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-brand-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'In Progress': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400';
      case 'Scheduled': return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400';
      case 'Published': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      default: return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400';
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

  return (
    <div className="space-y-6">
      {/* Backup and Import Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Manajemen Basis Data & Filter
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleImportFileChange}
            className="hidden"
          />
          
          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-colors"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Impor Cadangan</span>
          </button>
          
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-650 text-xs font-semibold text-white rounded-xl cursor-pointer shadow transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Ekspor Cadangan</span>
          </button>
        </div>
      </div>

      {/* Notifications for Import */}
      {importSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-toast-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{importSuccess}</span>
        </div>
      )}
      {importError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2 animate-toast-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {/* Local Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
        {/* Platform filter */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Saring Platform
          </span>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-350 focus:outline-none focus:border-brand-500"
          >
            <option value="All">Semua Platform</option>
            <option value="YouTube">YouTube</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="Twitter">Twitter/X</option>
            <option value="Facebook">Facebook</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Saring Status
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-350 focus:outline-none focus:border-brand-500"
          >
            <option value="All">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Published">Published</option>
          </select>
        </div>

        {/* Pillar filter */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Saring Pilar Topik
          </span>
          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-350 focus:outline-none focus:border-brand-500"
          >
            <option value="All">Semua Pilar</option>
            <option value="Education">Edukasi</option>
            <option value="Entertainment">Hiburan</option>
            <option value="Promotion">Promosi</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div ref={tableScrollRef} className="overflow-x-auto select-none scroll-smooth">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/60 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Thumbnail & Judul Konten</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Pilar Topik</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Rilis</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              {filteredContents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-650 font-medium">
                    Tidak ada konten yang sesuai dengan filter/pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredContents.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group"
                  >
                    {/* Thumbnail + Title */}
                    <td className="px-6 py-4.5 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-850 flex-shrink-0">
                          {item.coverThumbnail ? (
                            <img 
                              src={item.coverThumbnail} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-500 dark:hover:text-brand-400 cursor-pointer block truncate" onClick={() => onOpenEditModal(item)}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block max-w-xs mt-0.5">
                            {item.notes || 'Tidak ada deskripsi'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Platform */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {getPlatformIcon(item.platform)}
                        <span>{item.platform}</span>
                      </div>
                    </td>

                    {/* Pillar */}
                    <td className="px-6 py-4.5 font-medium">
                      {getPillarTranslation(item.contentPillar)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Release Date */}
                    <td className="px-6 py-4.5 font-medium text-slate-500 dark:text-slate-450">
                      {item.releaseDate || '-'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onOpenEditModal(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Hapus konten ini?')) {
                              onDeleteContent(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Counter */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-850/60 flex justify-between items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
          <span>Menampilkan {filteredContents.length} dari {contents.length} rencana konten</span>
        </div>
      </div>
    </div>
  );
}
