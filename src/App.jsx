import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import ContentList from './components/ContentList';
import ContentModal from './components/ContentModal';
import TeamView from './components/TeamView';
import Login from './components/Login';
import Inbox from './components/Inbox';
import Settings from './components/Settings';
import Help from './components/Help';
import { 
  seedInitialData, 
  getAllContents, 
  getAllTargets, 
  addContent, 
  updateContent, 
  deleteContent, 
  saveTarget,
  importBackupData
} from './db';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    // Initial theme check
    const saved = localStorage.getItem('planner_hub_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [contents, setContents] = useState([]);
  const [targets, setTargets] = useState({});
  const [dbLoading, setDbLoading] = useState(true);

  // Auth Session States
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('donezo_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Global Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('donezo_notifications');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: "Alexandra Deff menyelesaikan tugas 'Develop API Endpoints'", timestamp: new Date(Date.now() - 1200000).toISOString(), read: false },
      { id: 2, text: "Edwin Adenike mengubah status tugas 'Onboarding Flow' menjadi In Progress", timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
      { id: 3, text: "David Oshodi menyukai notes di konten 'Setup Workspace Minimalis 2026'", timestamp: new Date(Date.now() - 7200000).toISOString(), read: true }
    ];
  });

  // Sync notifications to localStorage
  useEffect(() => {
    localStorage.setItem('donezo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Modal editor states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [initialStatus, setInitialStatus] = useState('Draft');
  const [initialDate, setInitialDate] = useState('');

  // 1. Manage Theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('planner_hub_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('planner_hub_theme', 'light');
    }
  }, [darkMode]);

  // 2. Initialize IndexedDB contents & targets
  useEffect(() => {
    async function initAndLoad() {
      try {
        await seedInitialData();
        const loadedContents = await getAllContents();
        const loadedTargets = await getAllTargets();
        
        // Sort contents by date descending for lists, or keep as is
        setContents(loadedContents);
        setTargets(loadedTargets);
      } catch (err) {
        console.error('Database initialization failed:', err);
      } finally {
        setDbLoading(false);
      }
    }
    initAndLoad();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Database operations callbacks
  const handleSaveContent = async (item) => {
    try {
      if (item.id) {
        // Edit existing
        const updated = await updateContent(item);
        setContents(contents.map(c => c.id === item.id ? updated : c));
      } else {
        // Add new
        const added = await addContent(item);
        setContents([added, ...contents]);
      }
    } catch (err) {
      console.error('Gagal menyimpan konten:', err);
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      await deleteContent(id);
      setContents(contents.filter(c => c.id !== id));
    } catch (err) {
      console.error('Gagal menghapus konten:', err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const targetItem = contents.find(c => c.id === id);
    if (!targetItem) return;
    
    const updatedItem = { ...targetItem, status: newStatus };
    try {
      await updateContent(updatedItem);
      setContents(contents.map(c => c.id === id ? updatedItem : c));
    } catch (err) {
      console.error('Gagal memperbarui status:', err);
    }
  };

  const handleUpdateDate = async (id, newDate) => {
    const targetItem = contents.find(c => c.id === id);
    if (!targetItem) return;
    
    const updatedItem = { ...targetItem, releaseDate: newDate };
    try {
      await updateContent(updatedItem);
      setContents(contents.map(c => c.id === id ? updatedItem : c));
    } catch (err) {
      console.error('Gagal memperbarui tanggal:', err);
    }
  };

  const handleSaveTarget = async (platform, value) => {
    try {
      await saveTarget(platform, value);
      setTargets(prev => ({
        ...prev,
        [platform]: parseInt(value, 10) || 0
      }));
    } catch (err) {
      console.error('Gagal menyimpan target platform:', err);
    }
  };

  const handleImportBackup = async (jsonText) => {
    try {
      await importBackupData(jsonText);
      const reloadedContents = await getAllContents();
      setContents(reloadedContents);
    } catch (err) {
      console.error('Gagal mengimpor data backup:', err);
      throw err;
    }
  };

  // Open Editor hooks
  const handleOpenAddModal = (status = 'Draft', date = '') => {
    setSelectedContent(null);
    setInitialStatus(status);
    setInitialDate(date || new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contentItem) => {
    setSelectedContent(contentItem);
    setIsModalOpen(true);
  };

  // Helper stats for Sidebar status display
  const totalCount = contents.length;
  const publishedCount = contents.filter(c => c.status === 'Published').length;

  const handleAddNotification = (text) => {
    const newNotif = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('donezo_current_user', JSON.stringify(updatedUser));
    
    // Update in registered users pool
    const users = JSON.parse(localStorage.getItem('donezo_registered_users')) || [];
    const updatedUsers = users.map(u => u.email === updatedUser.email ? updatedUser : u);
    localStorage.setItem('donezo_registered_users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem('donezo_current_user');
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  // Render Login view if user is not authenticated
  if (!currentUser) {
    return <Login onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        totalCount={totalCount}
        publishedCount={publishedCount}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar */}
        <Navbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          activeView={activeView}
          setActiveView={setActiveView}
          currentUser={currentUser}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* View content panel */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-8 bg-slate-50/50 dark:bg-slate-950/40">
          {dbLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
              <span className="text-xs font-semibold uppercase tracking-wider">Memuat Database Offline...</span>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto h-full">
              {activeView === 'dashboard' && (
                <div className="animate-page-in h-full">
                  <Dashboard 
                    contents={contents} 
                    targets={targets}
                    onSaveTarget={handleSaveTarget}
                    onOpenAddModal={() => handleOpenAddModal('Draft', '')}
                    setActiveView={setActiveView}
                  />
                </div>
              )}

              {activeView === 'kanban' && (
                <div className="animate-page-in h-full">
                  <KanbanBoard 
                    contents={contents}
                    onUpdateStatus={handleUpdateStatus}
                    onOpenEditModal={handleOpenEditModal}
                    onOpenAddModal={(colStatus) => handleOpenAddModal(colStatus, '')}
                  />
                </div>
              )}

              {activeView === 'calendar' && (
                <div className="animate-page-in h-full">
                  <CalendarView 
                    contents={contents}
                    onUpdateDate={handleUpdateDate}
                    onOpenEditModal={handleOpenEditModal}
                    onOpenAddModal={(_, dateStr) => handleOpenAddModal('Draft', dateStr)}
                  />
                </div>
              )}

              {activeView === 'list' && (
                <div className="animate-page-in h-full">
                  <ContentList 
                    contents={contents}
                    searchQuery={searchQuery}
                    onOpenEditModal={handleOpenEditModal}
                    onDeleteContent={handleDeleteContent}
                    onImportBackup={handleImportBackup}
                  />
                </div>
              )}

              {activeView === 'team' && (
                <div className="animate-page-in h-full">
                  <TeamView contents={contents} />
                </div>
              )}

              {activeView === 'inbox' && (
                <div className="animate-page-in h-full">
                  <Inbox 
                    currentUser={currentUser} 
                    onAddNotification={handleAddNotification} 
                  />
                </div>
              )}

              {activeView === 'settings' && (
                <div className="animate-page-in h-full">
                  <Settings 
                    currentUser={currentUser} 
                    onUpdateUser={handleUpdateUser} 
                  />
                </div>
              )}

              {activeView === 'help' && (
                <div className="animate-page-in h-full">
                  <Help />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Content Form Editor Modal */}
      <ContentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContent}
        onDelete={handleDeleteContent}
        contentItem={selectedContent}
        initialStatus={initialStatus}
        initialDate={initialDate}
      />
    </div>
  );
}


