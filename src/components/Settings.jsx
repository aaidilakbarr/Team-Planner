import React, { useState, useRef } from 'react';
import { Save, User, Mail, ShieldAlert, Key, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Settings({ currentUser, onUpdateUser }) {
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatarColor, setAvatarColor] = useState(currentUser?.avatarColor || '#FFE0B2');
  
  // Custom uploaded photo Base64
  const [customPhoto, setCustomPhoto] = useState(currentUser?.customPhoto || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const presetColors = ['#FFE0B2', '#C8E6C9', '#B2EBF2', '#D1C4E9', '#F8BBD0', '#FFCCBC'];

  // Compress and handle file upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Harap unggah berkas gambar yang valid.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 120;
        const MAX_HEIGHT = 120;
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

        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setCustomPhoto(compressed);
        setError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !email.trim()) {
      setError('Nama dan Email wajib diisi.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      username: username.trim(),
      email: email.trim(),
      avatarColor,
      customPhoto
    };

    onUpdateUser(updatedUser);
    setSuccess('Profil Anda berhasil diperbarui!');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Harap isi semua kolom kata sandi.');
      return;
    }

    if (currentPassword !== currentUser.password) {
      setError('Kata sandi saat ini salah.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: newPassword
    };

    onUpdateUser(updatedUser);
    setSuccess('Kata sandi Anda berhasil diperbarui!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight">
          Pengaturan Akun
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Kelola profil publik, alamat email, avatar, dan kata sandi Anda.
        </p>
      </div>

      {/* Alert Status Banners */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-toast-in">
          <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5 animate-toast-in">
          <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Card: Avatar Picker */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
            Foto Profil Anda
          </span>

          {/* Large Avatar preview */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md mb-4 bg-slate-100">
            {customPhoto ? (
              <img src={customPhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <rect width="32" height="32" fill={avatarColor} />
                <path d="M6 14c0-6 4-10 10-10s10 4 10 10c0 1 0 2-1 2H7c-1 0-1-1-1-2z" fill="#5D4037" />
                <circle cx="12" cy="15" r="2" fill="#3E2723" />
                <circle cx="20" cy="15" r="2" fill="#3E2723" />
                <path d="M12 21c2 2 6 2 8 0" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="9" cy="18" r="1.5" fill="#FF8A80" opacity="0.6" />
                <circle cx="23" cy="18" r="1.5" fill="#FF8A80" opacity="0.6" />
              </svg>
            )}
          </div>

          {/* Action buttons */}
          <div className="w-full space-y-2.5 mb-5">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-slate-200 dark:border-slate-800 hover:border-[#0A5C36] dark:hover:border-[#4ADE80] rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#0A5C36] dark:hover:text-[#4ADE80] bg-slate-50/20 dark:bg-slate-900/30 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Foto</span>
            </button>
            {customPhoto && (
              <button
                onClick={() => setCustomPhoto('')}
                className="w-full py-1 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Hapus Foto Kustom
              </button>
            )}
          </div>

          {/* Preset Colors */}
          {!customPhoto && (
            <div className="w-full">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                Pilih Warna Latar Avatar
              </span>
              <div className="flex justify-center gap-2 flex-wrap">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                      avatarColor === color 
                        ? 'ring-2 ring-[#0A5C36] scale-110 border-white' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center/Right Card: Edit Fields */}
        <div className="md:col-span-2 space-y-6">
          {/* Form 1: Profile Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span>Informasi Profil</span>
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Peran Akun
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.role || 'Team Member'}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-400 cursor-not-allowed select-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#0A5C36] hover:bg-[#084d2d] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </form>
          </div>

          {/* Form 2: Password Change */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-500" />
              <span>Ganti Kata Sandi</span>
            </h3>

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Kata Sandi Sekarang
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Kata Sandi Baru (Min. 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-650 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Perbarui Kata Sandi</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
