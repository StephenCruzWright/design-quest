/**
 * Player progress. Persisted to localStorage when it's available, and portable
 * as a "save code" because itch.io embeds can lose storage.
 */

export interface BossRecord {
  stars: number;
  css: string;
  rationale: string;
  seconds: number;
  hintsUsed: number;
  bonuses: string[];
  at: string;
}

export interface LevelProgress {
  lessonDone: boolean;
  /** Lesson pages whose gate has been passed, counted from the first. */
  lessonPage: number;
  quizBest: number;
  quizTotal: number;
  /** Keyed by boss id; New Game+ runs use `${bossId}+`. */
  bosses: Record<string, BossRecord>;
}

export interface SaveData {
  v: 1;
  xp: number;
  levels: Record<string, LevelProgress>;
  /** Badge id → ISO date earned. */
  badges: Record<string, string>;
  /** Collected rule-card ids, as `${levelId}/${ruleId}`. */
  rules: string[];
  /** In-progress CSS per boss, so a reload never loses work. */
  drafts: Record<string, string>;
  settings: { theme: "auto" | "light" | "dark"; hard: boolean; reducedMotion: boolean };
  /** The player's sprite. An empty name means the picker hasn't run yet. */
  player: { name: string; look: number };
  createdAt: string;
}

const KEY = "design-quest/save/v1";
const CODE_PREFIX = "DQ1.";

export function freshSave(): SaveData {
  return {
    v: 1,
    xp: 0,
    levels: {},
    badges: {},
    rules: [],
    drafts: {},
    settings: { theme: "auto", hard: false, reducedMotion: false },
    player: { name: "", look: 0 },
    createdAt: new Date().toISOString(),
  };
}

export function emptyLevel(): LevelProgress {
  return { lessonDone: false, lessonPage: 0, quizBest: 0, quizTotal: 0, bosses: {} };
}

function normaliseLevel(raw: Partial<LevelProgress>): LevelProgress {
  const lp = { ...emptyLevel(), ...raw };
  lp.lessonPage = Number.isFinite(lp.lessonPage) ? Math.max(0, Math.floor(lp.lessonPage)) : 0;
  return lp;
}

/** Fill in any fields missing from an older or hand-edited save. */
export function normalise(raw: unknown): SaveData {
  const base = freshSave();
  if (!raw || typeof raw !== "object" || (raw as SaveData).v !== 1) return base;
  const r = raw as Partial<SaveData>;
  return {
    ...base,
    ...r,
    v: 1,
    xp: Number.isFinite(r.xp) ? Number(r.xp) : 0,
    levels: Object.fromEntries(
      Object.entries(r.levels ?? {}).map(([id, lp]) => [id, normaliseLevel(lp)]),
    ),
    badges: { ...(r.badges ?? {}) },
    rules: Array.isArray(r.rules) ? r.rules : [],
    drafts: { ...(r.drafts ?? {}) },
    settings: { ...base.settings, ...(r.settings ?? {}) },
    player: { ...base.player, ...(r.player ?? {}) },
  };
}

export function encodeSave(data: SaveData): string {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return CODE_PREFIX + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSave(code: string): SaveData {
  const trimmed = code.trim();
  if (!trimmed.startsWith(CODE_PREFIX))
    throw new Error("That doesn’t look like a Design Quest save code.");
  const b64 = trimmed.slice(CODE_PREFIX.length).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  if (parsed?.v !== 1) throw new Error("Save code is from an unknown version.");
  return normalise(parsed);
}

function readStorage(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalise(JSON.parse(raw)) : freshSave();
  } catch {
    return freshSave();
  }
}

function writeStorage(data: SaveData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

type Listener = (data: SaveData) => void;

class Store {
  private data: SaveData = readStorage();
  private listeners = new Set<Listener>();
  /** False when the browser refuses storage (private mode, blocked site data). */
  persistent = true;

  get(): SaveData {
    return this.data;
  }

  update(fn: (draft: SaveData) => void): void {
    const next = structuredClone(this.data);
    fn(next);
    this.data = next;
    this.persistent = writeStorage(next);
    for (const l of this.listeners) l(next);
  }

  replace(data: SaveData): void {
    this.update((d) => Object.assign(d, data));
  }

  level(id: string): LevelProgress {
    return this.data.levels[id] ?? emptyLevel();
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
}

export const store = new Store();
