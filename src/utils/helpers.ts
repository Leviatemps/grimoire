import { OGData } from '../types';

// ─── UUID simple ──────────────────────────────────────────────────────────────

export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
  );
}

// ─── Open Graph scraper via Microlink ────────────────────────────────────────

export type OGFetchResult =
  | { ok: true;  data: OGData }
  | { ok: false; error: string };

export async function fetchOGData(url: string): Promise<OGFetchResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return { ok: false, error: `Erreur serveur (${res.status})` };
    }
    const json = await res.json();
    if (json.status !== 'success') {
      return { ok: false, error: 'Impossible de récupérer les métadonnées.' };
    }
    const { data } = json;
    return {
      ok: true,
      data: {
        title:       data?.title ?? undefined,
        description: data?.description ?? undefined,
        image:       data?.image?.url ?? data?.logo?.url ?? undefined,
        siteName:    data?.publisher ?? undefined,
        url:         data?.url ?? url,
      },
    };
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      return { ok: false, error: 'Délai dépassé. Vérifiez votre connexion.' };
    }
    return { ok: false, error: 'Impossible d\'accéder au réseau.' };
  }
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now  = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);

  if (minutes < 1)  return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours   < 24) return `Il y a ${hours}h`;
  if (days    < 7)  return `Il y a ${days}j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// ─── Domain extraction ────────────────────────────────────────────────────────

export function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// ─── Color palette for categories ────────────────────────────────────────────

export const CATEGORY_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#64748b', // slate
  '#78716c', // stone
];

export const CATEGORY_ICONS = [
  '📁', '⭐', '📚', '✈️', '🍕', '🛒', '💡', '🎵',
  '🎬', '📷', '💪', '🏠', '💼', '❤️', '🌿', '🔬',
  '🎨', '🏆', '🌍', '💰', '🧠', '🎯', '🔖', '✨',
];
