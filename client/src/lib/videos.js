import {
  fetchVideos as apiFetchVideos,
  createVideo as apiCreateVideo,
  deleteVideo as apiDeleteVideo,
} from '../services/api.js';
import { getSession } from './auth.js';

/**
 * Returns the list of videos from the backend. Falls back to an empty
 * list if the request fails (e.g. backend unreachable on first load).
 */
export async function loadVideos() {
  try {
    return await apiFetchVideos();
  } catch (error) {
    console.warn('Failed to load videos from backend:', error.message);
    return [];
  }
}

/**
 * Creates a new video. Requires an authenticated admin session.
 * The backend's POST /api/videos enforces this via the protect + admin
 * middleware, so we forward the JWT.
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

// Backwards-compatible fallbacks. The pre-wired components used these
// for localStorage-only demo data. We keep them so a freshly-loaded
// page never crashes if the API is slow or down — Dashboard / Home
// can render with `[]` until the real fetch resolves.
export const FALLBACK_VIDEOS = [];