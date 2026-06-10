import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

export default function Help() {
  const [activeFaqId, setActiveFaqId] = useState(null);
  
  // CS Form fields
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Pertanyaan Umum');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const faqs = [
    {
      id: 1,
      q: 'Bagaimana cara menambahkan rencana konten baru?',
      a: 'Anda dapat mengklik tombol "Add Project" berwarna hijau di kanan atas Dashboard, atau mengklik ikon "+" di kolom papan Kanban / sel tanggal Kalender. Formulir editor modal akan muncul untuk mengisi judul, platform, pilar topik, status, dan deskripsi konten.'
    },
    {
      id: 2,
      q: 'Bagaimana cara memindahkan status tugas di papan Kanban?',
      a: 'Papan Kanban Donezo mendukung drag-and-drop secara penuh. Cukup klik dan tahan kartu konten yang ingin diubah, lalu geser ke kolom target status yang diinginkan (Draft, In Progress, Scheduled, atau Published) lalu lepaskan.'
    },
    {
      id: 3,
      q: 'Bagaimana cara mengekspor dan mengimpor cadangan data?',
      a: 'Buka tab "Analytics". Di sana terdapat tombol "Ekspor Cadangan" untuk mengunduh berkas data proyek Anda dalam format JSON. Untuk memulihkan data, klik "Impor Cadangan" dan pilih berkas JSON yang sudah Anda ekspor sebelumnya.'
    },
    {
      id: 4,
      q: 'Bagaimana cara mengubah profil dan foto avatar saya?',
      a: 'Klik menu "Settings" di kategori General pada Sidebar Anda. Di sana, Anda dapat mengunggah foto profil kustom (maksimal resolusi terkompresi otomatis secara lokal), memilih warna latar avatar, atau merubah kata sandi login.'
    }
  ];

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!subject.trim() || !description.trim()) {
      setError('Harap lengkapi semua kolom formulir.');
      return;
    }

    const tickets = JSON.parse(localStorage.getItem('donezo_cs_tickets')) || [];
    
    const newTicket = {
      id: Date.now(),
      subject: subject.trim(),
      category,
      description: description.trim(),
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    tickets.push(newTicket);
    localStorage.setItem('donezo_cs_tickets', JSON.stringify(tickets));

    setSuccess('Tiket dukungan berhasil dikirim! Tim CS kami akan merespons obrolan Anda di Inbox secepatnya.');
    setSubject('');
    setDescription('');
    
    setTimeout(() => setSuccess(''), 5000);
  };

  const toggleFaq = (id) => {
    if (activeFaqId === id) {
      setActiveFaqId(null);
    } else {
      setActiveFaqId(id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight">
          Pusat Bantuan & CS
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Cari jawaban di FAQ atau hubungi customer support kami secara langsung.
        </p>
      </div>

      {/* CS Form Success Alert */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-toast-in">
          <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs flex items-center gap-2.5 animate-toast-in">
          <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: FAQ Accordion (col-span-7) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
          </h3>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="border border-slate-100 dark:border-slate-800/60 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-850 text-left font-bold text-xs sm:text-sm text-slate-850 dark:text-slate-250 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  
                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed animate-page-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact CS Support Form (col-span-5) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Hubungi Customer Support</span>
          </h3>

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Kategori Tiket
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:border-[#0A5C36] focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm"
              >
                <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                <option value="Laporan Bug / Eror">Laporan Bug / Eror</option>
                <option value="Usulan Fitur Baru">Usulan Fitur Baru</option>
                <option value="Donezo Premium Hub">Donezo Premium Hub</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Subjek / Judul Masalah
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Masalah unggah cover di database"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Deskripsi Detail Masalah
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tulis kronologi detail kendala Anda..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white dark:focus:bg-slate-900/60 transition-all shadow-sm resize-none min-h-[90px]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#0A5C36] hover:bg-[#084d2d] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Tiket CS</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
