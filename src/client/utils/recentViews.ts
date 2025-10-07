export type RecentViewKind = 'course' | 'module' | 'node';

export interface RecentViewItem {
    id: string;
    kind: RecentViewKind;
    title: string;
    path: string;
    viewedAt: string; // ISO string
}

const STORAGE_KEY = 'recent_views_v1';
const MAX_ITEMS = 50;

const readStorage = (): RecentViewItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((x) => x && typeof x === 'object') as RecentViewItem[];
    } catch {
        return [];
    }
};

const writeStorage = (items: RecentViewItem[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Ignore write errors silently
    }
};

export const addRecentView = (item: Omit<RecentViewItem, 'viewedAt'> & { viewedAt?: string }): void => {
    const viewedAt = item.viewedAt || new Date().toISOString();
    const current = readStorage();

    // Remove any existing entry with same id+kind
    const filtered = current.filter((e) => !(e.id === item.id && e.kind === item.kind));
    // Add to front
    filtered.unshift({ ...item, viewedAt });
    // Trim
    const trimmed = filtered.slice(0, MAX_ITEMS);
    writeStorage(trimmed);
};

export const getRecentViews = (limit?: number): RecentViewItem[] => {
    const items = readStorage();
    const sorted = items.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
};

export const clearRecentViews = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
};


