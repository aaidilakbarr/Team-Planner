import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, AlertCircle, Trash2 } from 'lucide-react';

export default function ContentModal({ isOpen, onClose, onSave, onDelete, contentItem, initialStatus, initialDate }) {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [status, setStatus] = useState('Draft');
  const [contentPillar, setContentPillar] = useState('Education');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverThumbnail, setCoverThumbnail] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (contentItem) {
      setTitle(contentItem.title || '');
      setPlatform(contentItem.platform || 'YouTube');
      setStatus(contentItem.status || 'Draft');
      setContentPillar(contentItem.contentPillar || 'Education');
      setReleaseDate(contentItem.releaseDate || '');
      setCoverThumbnail(contentItem.coverThumbnail || '');
      setTags(contentItem.tags || []);
      setNotes(contentItem.notes || '');
    } else {
      setTitle('');
      setPlatform('YouTube');
      setStatus(initialStatus || 'Draft');
      setContentPillar('Education');
      setReleaseDate(initialDate || new Date().toISOString().split('T')[0]);
      setCoverThumbnail('');
      setTags([]);
      setNotes('');
    }
    setError('');
  }, [contentItem, isOpen, initialStatus, initialDate]);

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Thumbnail File Upload with Base64 Compression
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Harap unggah file gambar yang valid.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 480;
        const MAX_HEIGHT = 270;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setCoverThumbnail(compressedBase64);
        setError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanedTag = tagInput.trim().replace(/,/g, '');
      if (cleanedTag && !tags.includes(cleanedTag)) {
        setTags([...tags, cleanedTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul konten wajib diisi.');
      return;
    }

    const savedData = {
      title: title.trim(),
      platform,
      status,
      contentPillar,
      releaseDate,
      coverThumbnail,
      tags,
      notes: notes.trim()
    };

    if (contentItem?.id) {
      savedData.id = contentItem.id;
    }

    onSave(savedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Glass Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Glassmorphism Modal Panel */}
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800/40 rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-modal-in backdrop-blur-xl transition-all duration-300"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 dark:border-slate-800/20">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-white">
              {contentItem ? 'Edit Rencana Konten' : 'Buat Rencana Konten Baru'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Kelola ide, platform, dan detail penjadwalan konten Anda
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Judul Konten <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Belajar React Router dalam 10 Menit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white/80 dark:focus:bg-slate-955/65 transition-all shadow-sm"
            />
          </div>

          {/* Platforms/Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Platform Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:bg-white/80 dark:focus:bg-slate-955/65 transition-all shadow-sm"
              >
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Twitter">Twitter/X</option>
                <option value="Facebook">Facebook</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Production Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Status Produksi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/40 dark:bg-slate-955/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:bg-white/80 dark:focus:bg-slate-955/65 transition-all shadow-sm"
              >
                <option value="Draft">Draft</option>
                <option value="In Progress">In Progress</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Content Pillar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Pilar Konten
              </label>
              <select
                value={contentPillar}
                onChange={(e) => setContentPillar(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/40 dark:bg-slate-955/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:bg-white/80 dark:focus:bg-slate-955/65 transition-all shadow-sm"
              >
                <option value="Education">Edukasi</option>
                <option value="Entertainment">Hiburan</option>
                <option value="Promotion">Promosi</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          {/* Date & Thumbnail Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Release Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Tanggal Rilis/Tayang
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:bg-white/80 dark:focus:bg-slate-955/65 transition-all shadow-sm"
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Cover Thumbnail (Offline Compressed)
              </label>
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-slate-200/70 dark:border-slate-800/80 hover:border-[#0A5C36] dark:hover:border-[#4ADE80] rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-[#0A5C36] dark:hover:text-[#4ADE80] bg-white/20 dark:bg-slate-955/10 cursor-pointer flex-1 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Pilih Gambar</span>
                </button>
                
                {coverThumbnail && (
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-200/50 dark:border-slate-750 bg-slate-100 flex-shrink-0">
                    <img 
                      src={coverThumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverThumbnail('')}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
                      title="Hapus Thumbnail"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Kategori & Tags
            </label>
            <div className="p-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl space-y-2 focus-within:bg-white/80 dark:focus-within:bg-slate-900/60 focus-within:border-[#0A5C36] focus-within:ring-4 focus-within:ring-[#0A5C36]/5 transition-all shadow-sm">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-[#0A5C36] dark:text-[#4ADE80] border border-emerald-100/50 dark:border-emerald-900/20 text-[11px] font-bold"
                    >
                      #{tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(idx)}
                        className="p-0.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-400 hover:text-emerald-600 cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="Tambah tag lalu tekan Enter atau koma..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="w-full bg-transparent text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes Supporting Idea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Catatan / Ide Pendukung / Script
            </label>
            <textarea
              rows={4}
              placeholder="Masukkan script video, referensi riset link, or kerangka ide konten disini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white/80 dark:focus:bg-slate-900/60 transition-all shadow-sm resize-y min-h-[100px]"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-5 border-t border-white/10 dark:border-slate-800/20 bg-white/30 dark:bg-slate-950/25 flex justify-between gap-3 items-center">
          {contentItem && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
                  onDelete(contentItem.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-650 hover:text-red-700 bg-red-50/40 hover:bg-red-100/60 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Rencana</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-450 hover:bg-white/20 dark:hover:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50 rounded-xl cursor-pointer transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0A5C36] to-[#16A34A] hover:from-[#084d2d] hover:to-[#15803D] shadow-md rounded-xl cursor-pointer transition-all"
            >
              {contentItem ? 'Simpan Perubahan' : 'Buat Rencana'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
