/**
 * Studio media archive.
 *
 * Generated flyers, motion clips and caption sets are stored in IndexedDB
 * (blobs do not belong in localStorage), so the team can re-download a post
 * that worked without regenerating it. If IndexedDB is unavailable — private
 * browsing on some browsers — the store degrades to memory for the session and
 * the UI says so.
 */

import type { StudioBrandId } from "./kits";
import type { MotionMusicTrack } from "./motion-audio";
import { motionDefaults } from "./motion-defaults";

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
  /**
   * Static file URL for an item that ships with the app (the Black Friday drop).
   * Items with `src` download straight from the site — no blob needed.
   */
  src?: string;
  /** True for the pre-rendered Black Friday clips, which cannot be deleted, only hidden. */
  seed?: boolean;
  /** Platform-specific copy, when the item ships a full caption set. */
  captions?: { whatsapp: string; instagram: string; linkedin: string };
  /** The exact source assets behind a pre-rendered file. */
  assets?: {
    photo: string;
    music: MotionMusicTrack;
    volume: number;
    duration: number;
  };
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
  const stored = !db
    ? [...memoryStore]
    : await new Promise<ArchiveItem[]>((resolve) => {
        const tx = db.transaction(STORE, "readonly");
        const request = tx.objectStore(STORE).getAll();
        request.onsuccess = () => resolve((request.result as ArchiveItem[]) ?? []);
        request.onerror = () => resolve([]);
      });

  // The Black Friday drop ships with the app, so it is always at the top of the
  // archive without anyone having to generate it first.
  const storedIds = new Set(stored.map((item) => item.id));
  const seeds = blackFridayMotionItems().filter((item) => !storedIds.has(item.id));
  return [...seeds, ...stored].sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteArchiveItem(id: string): Promise<void> {
  if (id.startsWith("bf-") && BLACK_FRIDAY_SEEDS.some((seed) => `bf-${seed.file}` === id)) {
    dismissSeed(id);
    return;
  }
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

/* ------------------------------------------------- black friday drop */

const DISMISSED_KEY = "ndh.studio.seedDismissed";

function readDismissedSeeds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function dismissSeed(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = Array.from(new Set([...readDismissedSeeds(), id]));
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
  } catch {
    /* Storage blocked — the card simply comes back next session. */
  }
}

type BlackFridaySeed = {
  brandId: StudioBrandId;
  brandName: string;
  title: string;
  file: string;
  /** Rendered file size in bytes, for the "size" line. */
  bytes: number;
  meta: string;
  captions: { whatsapp: string; instagram: string; linkedin: string };
};

/**
 * Pre-rendered Black Friday motion clips.
 *
 * Each MP4 was produced with this app's own renderer (`paintFrame` from
 * `video.ts`) and its own soundtrack (`startMotionAudio`), 1080×1920 at 30fps
 * for 8 seconds, so the archive holds real, ready-to-post files: photo
 * backdrop, brand tint, animated headline, badge, three reveal points, logo and
 * call to action — plus AAC audio.
 */
const BLACK_FRIDAY_SEEDS: BlackFridaySeed[] = [
  {
    brandId: "academy",
    brandName: "NDH Academy",
    title: "Black Friday — NDH Academy",
    file: "academy",
    bytes: 1022665,
    meta: "8s · MP4 · 1080×1920 · 40% off · Bright & friendly",
    captions: {
      whatsapp: `🎓 BLACK FRIDAY — NDH ACADEMY

Every self-paced course and AI track is 40% off this week only.

✅ 40% off every course
✅ Live AI, design & data tracks
✅ Certificate on completion

👉 Enrol at ndhnet.com
#NDHAcademy #BlackFriday #NDH`,
      instagram: `Black Friday is live at NDH Academy 🎓

This week only: 40% off every self-paced course and AI track — the same curriculum our learners use to move into paid digital work.

✅ 40% off every course
✅ Live AI, design & data tracks
✅ Certificate on completion

Study at your own pace, from your phone, with instructors who actually answer.

👉 Enrol today at ndhnet.com (link in bio)
📩 Questions? Send us a DM.

#NDHAcademy #BlackFriday #LearnAI #DigitalSkills #TechSkills #OnlineLearning #CareerGrowth #Nigeria #NajeebDigitalHub #NDH`,
      linkedin: `Black Friday week at NDH Academy.

From today, every self-paced course and AI track on NDH Academy is 40% off — including our live AI, design and data tracks.

Why it matters: the digital skills that pay in Nigeria right now are learned, not inherited. Learners finish with a certificate and a portfolio they can put in front of a client or an employer.

• 40% off every course
• Live AI, design and data tracks
• Certificate on completion

Enrol at ndhnet.com. If your team needs a private cohort, reply here and I will send group options.

#NDHAcademy #BlackFriday #DigitalSkills #Nigeria`,
    },
  },
  {
    brandId: "agency",
    brandName: "NDH Agency",
    title: "Black Friday — NDH Agency",
    file: "agency",
    bytes: 1196766,
    meta: "8s · MP4 · 1080×1920 · 30% off first sprint · Clean corporate",
    captions: {
      whatsapp: `🖤 BLACK FRIDAY — NDH AGENCY

Book a build sprint this week and take 30% off your first project.

✅ 30% off your first sprint
✅ Brand, web & media in-house
✅ Kick-off in five days

👉 Book a call: ndhnet.com
#NDHAgency #BlackFriday #NDH`,
      instagram: `Your brand deserves better than a template 🖤

This Black Friday, NDH Agency takes 30% off your first build sprint — strategy, design, web and media handled by one in-house team.

✅ 30% off your first sprint
✅ Brand, web & media in-house
✅ Kick-off in five days

No hand-offs, no “the developer is on leave”. One team, one scope, one deadline.

👉 Book a call at ndhnet.com (link in bio)

#NDHAgency #BlackFriday #Branding #WebDesign #DigitalMarketing #MadeInNigeria #NajeebDigitalHub #NDH #StartupNigeria`,
      linkedin: `Black Friday, the B2B version.

NDH Agency is taking 30% off the first build sprint for any company that books before the window closes. That covers brand, website and launch media — delivered by one in-house team rather than four freelancers.

• 30% off your first sprint
• Brand, web and media in-house
• Kick-off within five working days

If your site is still the bottleneck between you and your next customer, this is the cheapest it gets. Book at ndhnet.com.

#NDHAgency #BlackFriday #DigitalTransformation #Nigeria`,
    },
  },
  {
    brandId: "shopos",
    brandName: "NDH ShopOS",
    title: "Black Friday — NDH ShopOS",
    file: "shopos",
    bytes: 1247558,
    meta: "8s · MP4 · 1080×1920 · 2 months free · Bright & friendly",
    captions: {
      whatsapp: `🛍️ BLACK FRIDAY — NDH SHOPOS

Open your online store this week and get two months free.

✅ Two months free on any plan
✅ Store live within 24 hours
✅ Payments & delivery built in

👉 Start at ndhnet.com
#NDHShopOS #BlackFriday #NDH`,
      instagram: `Your shop deserves a real address 🛍️

Open an NDH ShopOS storefront this Black Friday week and your first two months are on us.

✅ Two months free on any plan
✅ Store live within 24 hours
✅ Payments and delivery built in
✅ Manage orders from your phone

You already have the customers. Give them somewhere to buy.

👉 Start at ndhnet.com (link in bio)

#NDHShopOS #BlackFriday #SmallBusiness #OnlineStore #SellOnline #NigeriaBusiness #NajeebDigitalHub #NDH`,
      linkedin: `Every small business owner in Nigeria has heard “you need an online store”. Very few have been told what it should cost.

For Black Friday week, NDH ShopOS gives new stores two months free: catalogue, checkout, payments and delivery tracking, live within 24 hours of you sending your product list.

• Two months free on any plan
• Store live within 24 hours
• Payments and delivery built in

Start at ndhnet.com — or send this to a business owner who is still selling through DMs.

#NDHShopOS #BlackFriday #SMEs #Ecommerce #Nigeria`,
    },
  },
  {
    brandId: "schoolos",
    brandName: "NDH SchoolOS",
    title: "Black Friday — NDH SchoolOS",
    file: "schoolos",
    bytes: 1209784,
    meta: "8s · MP4 · 1080×1920 · Setup fee waived · Calm & steady",
    captions: {
      whatsapp: `🏫 BLACK FRIDAY — NDH SCHOOLOS

The setup fee is waived for the first fifty schools this week.

✅ Setup fee waived
✅ Admissions, fees & results
✅ Parent portal included

👉 Book a demo: ndhnet.com
#NDHSchoolOS #BlackFriday #NDH`,
      instagram: `Run a school? This is your Black Friday 🏫

NDH SchoolOS waives the setup fee for the first fifty schools this week.

✅ Setup fee waived
✅ Admissions, records, fees and results
✅ Parent portal included
✅ Report cards generated automatically

One system for the office, the teachers and the parents.

👉 Book a demo at ndhnet.com (link in bio)

#NDHSchoolOS #BlackFriday #SchoolManagement #EdTech #NigerianSchools #NajeebDigitalHub #NDH`,
      linkedin: `School owners spend January fixing records that September created.

NDH SchoolOS is a complete operating system for schools and colleges: admissions, records, continuous assessment, automatically graded report cards, fees and receipts, staff payroll and a parent portal.

For Black Friday week we waive the setup fee for the first fifty schools.

• Setup fee waived
• Admissions, fees and results in one place
• Parent portal included

Book a demo at ndhnet.com.

#NDHSchoolOS #BlackFriday #EdTech #SchoolLeadership #Nigeria`,
    },
  },
  {
    brandId: "farmfund",
    brandName: "NDH FarmFund",
    title: "Black Friday — NDH FarmFund",
    file: "farmfund",
    bytes: 1240966,
    meta: "8s · MP4 · 1080×1920 · Seasonal window, no discount · Warm & natural",
    captions: {
      whatsapp: `🌱 BLACK FRIDAY WINDOW — NDH FARMFUND

Allocations on verified, insured farm cycles are open this week.

✅ Verified & insured cycles
✅ Weekly progress reports
✅ Fixed-return contracts

No discount, no pressure — just a defined window on real cycles.

👉 See the cycles: ndhnet.com
#NDHFarmFund #BlackFriday #NDH`,
      instagram: `A Black Friday offer that is not a discount 🌱

NDH FarmFund does not cut the price of a farm cycle — the cycle costs what it costs. What we do this week is open a defined allocation window on verified, insured cycles.

✅ Verified and insured cycles
✅ Weekly progress reports
✅ Fixed-return contracts
✅ Funds held and released per contract, not per promise

When the window fills, it closes.

👉 See the open cycles at ndhnet.com (link in bio)

#NDHFarmFund #BlackFriday #AgriBusiness #ImpactInvesting #NigeriaAgriculture #NajeebDigitalHub #NDH`,
      linkedin: `Most Black Friday messaging asks you to buy faster. In agriculture, that is exactly the wrong instinct.

NDH FarmFund is opening a defined allocation window this week on verified, insured farm cycles — no discount, no countdown theatre. Each cycle ships with a contract, weekly progress reports and a fixed-return structure, and the window closes when allocations are filled.

• Verified and insured cycles
• Weekly progress reports
• Fixed-return contracts

If your organisation is looking at agricultural exposure with real reporting behind it, the cycles are listed at ndhnet.com.

#NDHFarmFund #BlackFriday #AgriFinance #ImpactInvesting #Nigeria`,
    },
  },
];

/** Fixed stamp so the drop always sorts to the top and never shifts between reloads. */
const BLACK_FRIDAY_CREATED_AT = Date.parse("2026-11-04T08:00:00+01:00");

/** The five ready-to-post Black Friday clips, as archive records. */
export function blackFridayMotionItems(): ArchiveItem[] {
  const dismissed = new Set(readDismissedSeeds());
  return BLACK_FRIDAY_SEEDS.filter((seed) => !dismissed.has(`bf-${seed.file}`)).map((seed) => {
    const defaults = motionDefaults(seed.brandId);
    return {
      id: `bf-${seed.file}`,
      kind: "motion",
      title: seed.title,
      brandId: seed.brandId,
      brandName: seed.brandName,
      createdAt: BLACK_FRIDAY_CREATED_AT,
      mime: "video/mp4",
      extension: "mp4",
      size: seed.bytes,
      thumb: `/black-friday/${seed.file}.jpg`,
      caption: [
        `WHATSAPP STATUS
${seed.captions.whatsapp}`,
        `INSTAGRAM
${seed.captions.instagram}`,
        `LINKEDIN
${seed.captions.linkedin}`,
      ].join("\n\n————————————————\n\n"),
      captions: seed.captions,
      meta: seed.meta,
      src: `/black-friday/${seed.file}.mp4`,
      seed: true,
      assets: {
        photo: defaults.photoUrl,
        music: defaults.music,
        volume: 0.55,
        duration: 8,
      },
    } satisfies ArchiveItem;
  });
}

/* ------------------------------------------------------------ downloads */

/**
 * Download an archive item, whether it holds a blob or a static file.
 * Returns the file name that was used.
 */
export async function downloadArchiveItem(item: ArchiveItem): Promise<string> {
  const filename = filenameFor(item.brandName, item.kind, item.extension);
  if (item.blob) {
    downloadBlob(item.blob, filename);
    return filename;
  }
  if (!item.src) throw new Error("This item has no file attached.");
  const response = await fetch(item.src);
  if (!response.ok) throw new Error("The video file could not be downloaded.");
  downloadBlob(await response.blob(), filename);
  return filename;
}

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
