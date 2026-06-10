import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCheck, Smile, Paperclip, MessageSquare, Circle, AlertCircle } from 'lucide-react';

export default function Inbox({ currentUser, onAddNotification }) {
  const [selectedMemberId, setSelectedMemberId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  // Seed default team members list
  const members = [
    { id: 1, name: 'Alexandra Deff', role: 'Github Project Developer', avatarBg: '#C8E6C9', online: true },
    { id: 2, name: 'Edwin Adenike', role: 'UI/UX Lead Designer', avatarBg: '#FFE0B2', online: true },
    { id: 3, name: 'Isaac Oluwatemilorun', role: 'Database Manager', avatarBg: '#B2EBF2', online: false },
    { id: 4, name: 'David Oshodi', role: 'Content Copywriter', avatarBg: '#D1C4E9', online: true },
  ];

  // Load chat history from localStorage on mount & when selected member changes
  useEffect(() => {
    const savedChats = localStorage.getItem('donezo_inbox_chats');
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    } else {
      // Default initial mock messages
      const initialChats = [
        { id: 1, senderId: 1, receiverId: 'me', text: 'Halo Totok! Saya sudah merge request di repositori GitHub. Tolong direview ya.', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, senderId: 'me', receiverId: 1, text: 'Siap Alex! Akan segera saya periksa kodenya.', timestamp: new Date(Date.now() - 3000000).toISOString() },
        { id: 3, senderId: 2, receiverId: 'me', text: 'Hi, apakah design system Donezo yang baru sudah pas?', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 4, senderId: 4, receiverId: 'me', text: 'Draf tulisan blog rilis fitur baru sudah selesai dibuat. Silakan cek di tab Analytics/Projects.', timestamp: new Date(Date.now() - 10800000).toISOString() }
      ];
      localStorage.setItem('donezo_inbox_chats', JSON.stringify(initialChats));
      setMessages(initialChats);
    }
  }, [selectedMemberId]);

  // Auto scroll to bottom when messages or typing status updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const savedChats = JSON.parse(localStorage.getItem('donezo_inbox_chats')) || [];
    const activeMember = members.find(m => m.id === selectedMemberId);

    const userMessage = {
      id: Date.now(),
      senderId: 'me',
      receiverId: selectedMemberId,
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedChats = [...savedChats, userMessage];
    localStorage.setItem('donezo_inbox_chats', JSON.stringify(updatedChats));
    setMessages(updatedChats);
    setInputText('');

    // Trigger typing state for the selected member
    setIsTyping(true);

    // Simulate auto-reply after 1.5s
    setTimeout(() => {
      setIsTyping(false);

      const replies = {
        1: [
          "Noted! Saya sedang memeriksa ulang build pipelines GitHub Action-nya.",
          "Siap, perubahan routing halaman sudah saya push ke repo.",
          "Ada perbaikan minor untuk glassmorphism di dark mode, akan segera saya selesaikan.",
          "Okey, nanti saya push versi terbaru setelah selesai ditest secara lokal."
        ],
        2: [
          "Bagus! Palette warnanya sudah saya sesuaikan dengan mockup Figma.",
          "Bagian dropdown notifikasi di navbar sudah beres saya visualisasikan.",
          "Ingin saya bantu buat aset gambar promosi baru untuk platform media sosial?",
          "Desain landing page responsive versi mobile sudah siap divalidasi."
        ],
        3: [
          "Halo. Sesi offline storage IndexedDB sudah saya optimalkan strukturnya.",
          "Cadangan basis data JSON sudah berhasil dicoba ekspor dan impor kembali.",
          "Nanti sore saya bantu cek performa database di perangkat mobile ya.",
          "Siap. Staging database sudah disinkronkan dengan state UI utama."
        ],
        4: [
          "Keren! Copywriting FAQ dan help desk sudah saya rapihkan.",
          "Script video promosi Shorts YouTube durasi 30 detik sudah saya selesaikan drafnya.",
          "Sedang menyusun materi promosi untuk rilis Donezo Premium di Twitter.",
          "Bagian deskripsi taks dan pilar edukasi sudah saya tinjau tata bahasanya."
        ]
      };

      const memberReplies = replies[selectedMemberId] || ["Noted! Nanti saya kabari lagi."];
      const randomReplyText = memberReplies[Math.floor(Math.random() * memberReplies.length)];

      const memberReply = {
        id: Date.now() + 1,
        senderId: selectedMemberId,
        receiverId: 'me',
        text: randomReplyText,
        timestamp: new Date().toISOString()
      };

      const finalChats = [...updatedChats, memberReply];
      localStorage.setItem('donezo_inbox_chats', JSON.stringify(finalChats));
      setMessages(finalChats);

      // Trigger standard notifications logic
      if (onAddNotification) {
        onAddNotification(`Pesan baru dari ${activeMember.name}: "${randomReplyText.slice(0, 30)}..."`);
      }
    }, 1500);
  };

  const getFilteredMessages = () => {
    return messages.filter(
      (m) => 
        (m.senderId === 'me' && m.receiverId === selectedMemberId) ||
        (m.senderId === selectedMemberId && m.receiverId === 'me')
    );
  };

  // Helper to get preview of last message for the left panel listing
  const getLastMessageText = (memberId) => {
    const list = messages.filter(
      (m) => 
        (m.senderId === 'me' && m.receiverId === memberId) ||
        (m.senderId === memberId && m.receiverId === 'me')
    );
    if (list.length === 0) return 'Belum ada obrolan';
    const last = list[list.length - 1];
    return last.senderId === 'me' ? `Anda: ${last.text}` : last.text;
  };

  const currentChatMessages = getFilteredMessages();
  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="flex bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-11rem)]">
      {/* 1. Sidebar Chat Members */}
      <div className="w-1/3 border-r border-slate-100 dark:border-slate-800/50 flex flex-col h-full bg-slate-50/20 dark:bg-slate-900/10">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white">
            Inbox Obrolan
          </h3>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-[#0A5C36] dark:text-[#4ADE80] text-[9px] font-bold">
            Simulasi Aktif
          </span>
        </div>
        
        {/* Members List */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-3 space-y-1">
          {members.map((m) => {
            const isSel = selectedMemberId === m.id;
            const lastMsg = getLastMessageText(m.id);
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left cursor-pointer transition-all duration-200 ${
                  isSel 
                    ? 'bg-slate-100/80 dark:bg-slate-800/55 shadow-sm' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'
                }`}
              >
                {/* Avatar with dynamic color */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-sm"
                    style={{ backgroundColor: m.avatarBg, color: '#3E2723' }}
                  >
                    {m.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {/* Status Indicator */}
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    m.online ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                </div>

                <div className="min-w-0 flex-1 leading-none">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate">{m.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-450 dark:text-slate-500 block mt-1 font-semibold">{m.role}</span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-2 leading-tight">
                    {lastMsg}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chat Feed Area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
        {/* Thread Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700"
              style={{ backgroundColor: selectedMember?.avatarBg, color: '#3E2723' }}
            >
              {selectedMember?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 leading-tight">
                {selectedMember?.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Circle className={`w-1.5 h-1.5 fill-current ${selectedMember?.online ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                  {selectedMember?.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
            Anggota Tim
          </div>
        </div>

        {/* Message Logs Feed */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 space-y-4 bg-slate-50/25 dark:bg-slate-950/15">
          {currentChatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 gap-2">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 animate-bounce" />
              <p className="text-xs font-bold">Mulai Percakapan Baru</p>
              <p className="text-[10px] text-slate-400 max-w-[200px] text-center mt-1 leading-snug">
                Kirim pesan ke {selectedMember?.name} untuk mendiskusikan tugas proyek Anda.
              </p>
            </div>
          ) : (
            currentChatMessages.map((msg) => {
              const isMe = msg.senderId === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-page-in`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm border ${
                    isMe 
                      ? 'bg-[#0A5C36] text-white border-emerald-700/30 rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-750 rounded-tl-none'
                  }`}>
                    <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1.5 justify-end text-[8px] ${
                      isMe ? 'text-emerald-200/80' : 'text-slate-400'
                    }`}>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Simulated Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start items-center gap-2 animate-pulse">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[9px] border border-slate-200 dark:border-slate-700"
                style={{ backgroundColor: selectedMember?.avatarBg, color: '#3E2723' }}
              >
                {selectedMember?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 text-[10px] text-slate-400">
                <span className="font-semibold">{selectedMember?.name.split(' ')[0]} sedang mengetik</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150" />
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-300" />
                </span>
              </div>
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>

        {/* Input Panel Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-3 bg-white dark:bg-slate-900">
          <button 
            type="button" 
            onClick={() => alert("Lampiran berkas premium akan segera hadir.")}
            className="p-2 text-slate-450 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>
          
          <button 
            type="button"
            onClick={() => alert("Panel emoji akan segera hadir.")}
            className="p-2 text-slate-450 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
            title="Add emoji"
          >
            <Smile className="w-4.5 h-4.5" />
          </button>

          <input
            type="text"
            placeholder={`Ketik pesan untuk ${selectedMember?.name.split(' ')[0]}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-850/50 border border-slate-150 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#0A5C36] transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#0A5C36] hover:bg-[#084d2d] text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
