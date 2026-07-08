/**
 * api.js
 * Data layer for BUCC Study Corner's frontend.
 *
 * Scope: this file only talks to the backend (or falls back to mock data)
 * and hands back a NORMALIZED video shape, regardless of exactly what
 * field names the backend team ends up using. That way App.jsx and any
 * consuming component never has to guard against raw.title vs raw.name,
 * raw.url vs raw.videoUrl, etc.
 *
 * Normalized video shape:
 * {
 *   id: string,
 *   title: string,
 *   url: string,          // full YouTube link
 *   category: string,     // e.g. "Frontend" | "Backend" | "Design"
 *   channel: string,      // optional, empty string if unknown
 *   description: string,  // optional, empty string if unknown
 * }
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000/api';

/**
 * Low-level fetch wrapper with consistent error handling.
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = `Request to ${path} failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // response wasn't JSON, keep default message
    }
    throw new Error(message);
  }

  return res.json();
}

/**
 * Maps whatever shape the backend returns for a single video into the
 * normalized shape this frontend relies on. Tolerant of common naming
 * variants so this doesn't break the moment the backend contract shifts.
 */
export function normalizeVideo(raw = {}) {
  return {
    id: raw.id ?? raw._id ?? raw.videoId ?? cryptoRandomId(),
    title: raw.title ?? raw.name ?? 'Untitled video',
    url: raw.url ?? raw.videoUrl ?? raw.link ?? raw.youtubeUrl ?? '',
    category: raw.category ?? raw.tag ?? raw.topic ?? 'General',
    channel: raw.channel ?? raw.author ?? raw.uploader ?? '',
    description: raw.description ?? raw.desc ?? '',
  };
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `video-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Fetches videos, optionally filtered by category.
 * Tolerant of the backend responding with a bare array, or an object
 * like { videos: [...] } / { data: [...] }.
 *
 * @param {string} [category] - pass "All" or omit for no filter
 * @returns {Promise<Array>} normalized video list
 */
export async function fetchVideos(category) {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  const data = await request(`/videos${query}`);
  const list = Array.isArray(data) ? data : data?.videos ?? data?.data ?? [];
  return list.map(normalizeVideo);
}

/**
 * Fetches the list of category names. Falls back to a sane default set
 * if the backend doesn't expose a /categories endpoint yet.
 *
 * @returns {Promise<string[]>}
 */
export async function fetchCategories() {
  try {
    const data = await request('/categories');
    const list = Array.isArray(data) ? data : data?.categories ?? data?.data ?? [];
    const names = list.map((c) => (typeof c === 'string' ? c : c.name ?? c.category));
    return names.length ? ['All', ...names] : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export const FALLBACK_CATEGORIES = ['All', 'Frontend', 'Backend', 'Design'];

/**
 * Sample data for developing/demoing VideoCard and Category without a
 * live backend. Not used automatically — import it explicitly, e.g.
 * for a Storybook-style preview or while the API endpoint isn't ready.
 */
export const MOCK_VIDEOS = [
  {
    id: 'mock-1',
    title: 'React Hooks in 15 Minutes',
    url: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
    category: 'Frontend',
    channel: 'Web Dev Simplified',
    description: 'A fast walkthrough of useState and useEffect for beginners.',
  },
  {
    id: 'mock-2',
    title: 'Building REST APIs with Express',
    url: 'https://www.youtube.com/watch?v=pKd0Rpw7O48',
    category: 'Backend',
    channel: 'Traversy Media',
    description: 'Set up routes, middleware, and JSON responses from scratch.',
  },
  {
    id: 'mock-3',
    title: 'Design Systems 101',
    url: 'https://youtu.be/R2Bp9NyBWwc',
    category: 'Design',
    channel: 'Figma',
    description: 'Why consistent tokens and components matter at scale.',
  },
];
