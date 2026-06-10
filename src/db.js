import { openDB } from 'idb';

const DB_NAME = 'planner_hub_db';
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('contents')) {
        db.createObjectStore('contents', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('targets')) {
        db.createObjectStore('targets', { keyPath: 'platform' });
      }
    },
  });
}

// Initial seed data if DB is empty
export async function seedInitialData() {
  const db = await getDB();
  const tx = db.transaction(['contents', 'targets'], 'readwrite');
  
  const contentsStore = tx.objectStore('contents');
  const targetsStore = tx.objectStore('targets');
  
  const contentsCount = await contentsStore.count();
  if (contentsCount === 0) {
    const sampleContents = [
      {
        title: 'Panduan React + Tailwind CSS v4 Terlengkap',
        platform: 'YouTube',
        status: 'In Progress',
        contentPillar: 'Education',
        coverThumbnail: '', // Empty base64
        tags: ['React', 'Tailwindv4', 'Coding'],
        notes: 'Script detail:\n1. Intro: Apa yang baru di Tailwind CSS v4?\n2. Instalasi & Setup Vite\n3. Membuat layout responsive dashboard.\n4. Kesimpulan & Penutup.',
        releaseDate: new Date().toISOString().split('T')[0] // today
      },
      {
        title: 'A Day in the Life of a Software Engineer',
        platform: 'Instagram',
        status: 'Scheduled',
        contentPillar: 'Personal',
        coverThumbnail: '',
        tags: ['DevLife', 'Minimalist', 'Vlog'],
        notes: 'Rencana pengambilan gambar:\n- Pukul 07.00: Kopi pagi & meja kerja bersih.\n- Pukul 10.00: Sesi coding serius dengan screen recording.\n- Pukul 15.00: Istirahat di taman.\n- Edit dengan musik lo-fi aesthetic.',
        releaseDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] // tomorrow
      },
      {
        title: 'Trik Cepat Desain Glassmorphic UI Modern',
        platform: 'TikTok',
        status: 'Draft',
        contentPillar: 'Education',
        coverThumbnail: '',
        tags: ['UIUX', 'Figma', 'WebDesign'],
        notes: 'Gunakan filter kontras tinggi.\nVideo durasi 45 detik:\n- Tunjukkan perbandingan card standard vs glassmorphic.\n- Berikan kode CSS backdrop-filter.',
        releaseDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] // yesterday
      },
      {
        title: 'Kenapa Developer Harus Paham Offline-First App?',
        platform: 'Twitter',
        status: 'Published',
        contentPillar: 'Promotion',
        coverThumbnail: '',
        tags: ['IndexedDB', 'WebDev', 'Thread'],
        notes: 'Thread Twitter/X:\n1/ Mengapa koneksi lemot merusak UX?\n2/ Solusinya adalah IndexedDB untuk penyimpanan lokal.\n3/ Kelebihan: Akses instan, kurangi beban server.\n4/ Pelajari selengkapnya di Planner Hub!',
        releaseDate: new Date(Date.now() - 172800000).toISOString().split('T')[0] // 2 days ago
      },
      {
        title: 'Setup Workspace Minimalis 2026',
        platform: 'YouTube',
        status: 'Published',
        contentPillar: 'Entertainment',
        coverThumbnail: '',
        tags: ['Workspace', 'Setup', 'Aesthetic'],
        notes: 'Video pendek (Shorts) menunjukkan tour singkat setup desktop baru, pencahayaan LED neon, keyboard mekanik, dan monitor lengan bergaya minimalis.',
        releaseDate: new Date(Date.now() - 259200000).toISOString().split('T')[0] // 3 days ago
      }
    ];

    for (const content of sampleContents) {
      await contentsStore.add(content);
    }
  }

  const targetsCount = await targetsStore.count();
  if (targetsCount === 0) {
    const defaultTargets = [
      { platform: 'YouTube', target: 2 },
      { platform: 'Instagram', target: 3 },
      { platform: 'TikTok', target: 3 },
      { platform: 'Twitter', target: 2 },
      { platform: 'Facebook', target: 1 }
    ];

    for (const target of defaultTargets) {
      await targetsStore.add(target);
    }
  }

  await tx.done;
}

// Contents DB operations
export async function getAllContents() {
  const db = await getDB();
  return db.getAll('contents');
}

export async function addContent(content) {
  const db = await getDB();
  const id = await db.add('contents', content);
  return { ...content, id };
}

export async function updateContent(content) {
  const db = await getDB();
  await db.put('contents', content);
  return content;
}

export async function deleteContent(id) {
  const db = await getDB();
  return db.delete('contents', id);
}

// Targets DB operations
export async function getAllTargets() {
  const db = await getDB();
  const list = await db.getAll('targets');
  // convert list to platform-to-target map
  const targetMap = {};
  list.forEach(item => {
    targetMap[item.platform] = item.target;
  });
  return targetMap;
}

export async function saveTarget(platform, targetValue) {
  const db = await getDB();
  return db.put('targets', { platform, target: parseInt(targetValue, 10) || 0 });
}

export async function importBackupData(backupJson) {
  const data = JSON.parse(backupJson);
  if (!data || !Array.isArray(data.contents)) {
    throw new Error('Format backup tidak valid.');
  }
  
  const db = await getDB();
  const tx = db.transaction('contents', 'readwrite');
  const store = tx.objectStore('contents');
  
  for (const item of data.contents) {
    // strip out ID to let it autoIncrement, or overwrite
    const newItem = { ...item };
    delete newItem.id;
    await store.add(newItem);
  }
  
  await tx.done;
  return true;
}
