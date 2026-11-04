/**
 * Studio media archive.
 *
 * Generated flyers, motion clips and caption sets are stored in IndexedDB
 * (blobs do not belong in localStorage), so the team can re-download a post
 * that worked without regenerating it. If IndexedDB is unavailable — private
 * browsing on some browsers — the store degrades to memory for the session and
 * the UI says so.
 */

export type ArchiveKind = "flyer" | "motion" | "caption";

export type ArchiveItem = {
  id: string;
  kind: ArchiveKind;
  title: string;
  brandId: string;
  brandName: string;
  createdAt: number;
  mime: string;
  extension: string;
  size: number;
  /** Small JPEG data URL used in the grid. */
  thumb?: string;
  /** Caption text (for caption entries and as a recap on media entries). */
  caption?: string;
  /** Free-form metadata line shown under the title. */
  meta?: string;
  blob?: Blob;
};

const DB_NAME = "ndh-studio";
const DB_VERSION = 1;
const STORE = "media";
const CAPTION_KEY = "ndh.studio.captions";

let memoryStore: ArchiveItem[] = [];
let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  dbPromise ??= new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

export async function saveArchiveItem(item: ArchiveItem): Promise<void> {
  const db = await openDb();
  if (!db) {
    memoryStore = [item, ...memoryStore].slice(0, 60);
    return;
  }
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => {
      memoryStore = [item, ...memoryStore].slice(0, 60);
      resolve();
    };
  });
}

export async function listArchiveItems(): Promise<ArchiveItem[]> {
  const db = await openDb();
  if (!db) return [...memoryStore].sort((a, b) => b.createdAt - a.createdAt);
  const items = await new Promise<ArchiveItem[]>((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as ArchiveItem[]) ?? []);
    request.onerror = () => resolve([]);
  });
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteArchiveItem(id: string): Promise<void> {
  const db = await openDb();
  if (!db) {
    memoryStore = memoryStore.filter((item) => item.id !== id);
    return;
  }
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

export async function clearArchive(): Promise<void> {
  const db = await openDb();
  if (!db) {
    memoryStore = [];
    return;
  }
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
  memoryStore = [];
}

export function archiveId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ------------------------------------------------------------ downloads */

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function filenameFor(brandName: string, kind: string, extension: string): string {
  const slug = brandName
    .toLowerCase()
    .replace(/ndh\s*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const stamp = new Date().toISOString().slice(0, 10);
  return `ndh-${slug || "brand"}-${kind}-${stamp}.${extension}`;
}

/* ------------------------------------------------------- caption history */

export type CaptionHistoryEntry = {
  id: string;
  brandId: string;
  brandName: string;
  topic: string;
  createdAt: number;
  cards: { label: string; body: string }[];
};

export function readCaptionHistory(): CaptionHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CAPTION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CaptionHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCaptionHistory(entry: CaptionHistoryEntry): CaptionHistoryEntry[] {
  if (typeof window === "undefined") return [];
  const existing = readCaptionHistory();
  const newest = existing[0];
  // Typing in the brief must not fill the history with near-identical drafts.
  if (
    newest &&
    newest.brandId === entry.brandId &&
    newest.topic === entry.topic &&
    Date.now() - newest.createdAt < 10 * 60 * 1000
  ) {
    return existing;
  }
  const next = [entry, ...existing.filter((item) => item.id !== entry.id)].slice(0, 30);
  try {
    window.localStorage.setItem(CAPTION_KEY, JSON.stringify(next));
  } catch {
    /* Storage full or blocked — the archive still holds the media. */
  }
  return next;
}

export function removeCaptionHistory(id: string): CaptionHistoryEntry[] {
  if (typeof window === "undefined") return [];
  const next = readCaptionHistory().filter((item) => item.id !== id);
  try {
    window.localStorage.setItem(CAPTION_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
