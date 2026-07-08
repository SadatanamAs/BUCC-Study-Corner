import {
  fetchVideos as apiFetchVideos,
  createVideo as apiCreateVideo,
  deleteVideo as apiDeleteVideo,
} from '../services/api.js';
import { getSession } from './auth.js';

/**
 * Parses a YouTube URL and returns the 11-character video ID, or null if the
 * URL is not a recognized YouTube URL. Handles watch, share, embed, and
 * shorts links, including playlist URLs (`?v=ID&list=...`).
 */
export function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);

    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace(/^\//, '');
      return id.length === 11 ? id : null;
    }

    if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'm.youtube.com'
    ) {
      // /watch?v=ID, /shorts/ID, /embed/ID
      const v = parsed.searchParams.get('v');
      if (v && v.length === 11) return v;
      const parts = parsed.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last.length === 11) return last;
    }
  } catch {
    return null;
  }
  return null;
}

export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

export function getYouTubeThumbnailUrl(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * Static fallback data from your initial project files.
 * This ensures the UI works even if the backend is offline.
 */
export const FALLBACK_VIDEOS = [
  {
    id: 1,
    title: "React Basics",
    category: "Frontend",
    description: "Learn React fundamentals",
    url: "https://www.youtube.com/watch?v=SqcY0GlETPk"
  },
  {
    id: 2,
    title: "Linked List",
    category: "DSA",
    instructor: "Abdul Bari",
    description: "Complete linked list tutorial.",
    url: "https://www.youtube.com/watch?v=NobHlGUjV3g"
  },
  {
    id: 3,
    title: "SQL Basics",
    category: "Database",
    instructor: "FreeCodeCamp",
    description: "Learn SQL step by step.",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY"
  }
];

/**
 * Returns the list of videos from the backend.
 * Falls back to FALLBACK_VIDEOS if the request fails.
 */
export async function loadVideos() {
  try {
    const data = await apiFetchVideos();
    // Return API data if it exists, otherwise fallback
    return data && data.length > 0 ? data : FALLBACK_VIDEOS;
  } catch (error) {
    console.warn('Backend unreachable, using fallback data:', error.message);
    return FALLBACK_VIDEOS;
  }
}

/**
 * Creates a new video. Requires an authenticated admin session.
 */
export async function addVideo(video) {
  const session = getSession();
  if (!session?.token) {
    throw new Error('You must be signed in as an admin to publish resources.');
  }
  return apiCreateVideo(video, session.token);
}

/**
 * Deletes a video. Requires an authenticated admin session.
 */
export async function removeVideo(id) {
  const session = getSession();
  if (!session?.token) {
    throw new Error('You must be signed in as an admin to delete resources.');
  }
  return apiDeleteVideo(id, session.token);
}