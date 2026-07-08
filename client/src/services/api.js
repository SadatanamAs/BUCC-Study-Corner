/**
 * api.js — data layer for the deployed BUCC Study Corner frontend.
 *
 * Reads the backend URL from `VITE_API_BASE_URL` (set in
 * `.env.local` for dev or the Vercel project env vars for prod).
 *
 * Public surface:
 *   - loginUser({ email, password }) → { token, user }
 *   - registerUser({ name, email, password, superSecretKey? }) → { token, user }
 *   - fetchVideos() → Video[]
 *   - createVideo(video) → Video
 *   - deleteVideo(id) → { message }
 *
 * Admin bootstrap is done at registration time by passing the matching
 * `superSecretKey` value — see registerUser in authController.js. There
 * is no separate upgrade-admin endpoint.
 *
 * Token handling: callers (auth.js, components) are responsible for
 * storing the JWT in localStorage. This module injects it via the
 * `Authorization: Bearer <token>` header on protected calls.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000/api';

function authHeaders(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // Fetch itself throws (CORS preflight failure, DNS, offline, TLS error).
    // The browser usually exposes a fairly cryptic message here — rewrite it
    // so the user knows it's likely a connection / deployment issue, not bad
    // credentials. The previous form said "FAILED TO FETCH" with no context.
    throw new Error(
      `Network error contacting the API at ${API_BASE_URL}. Hard-refresh (Cmd/Ctrl+Shift+R) to drop a stale cached bundle, then retry. If the problem persists, the backend may be down or this build's VITE_API_BASE_URL may be wrong.`
    );
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const message = payload?.message || `Request to ${path} failed (${res.status})`;
    throw new Error(message);
  }

  return payload;
}

export async function loginUser({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return {
    token: data.token,
    user: {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    },
  };
}

export async function registerUser({ name, email, password, superSecretKey }) {
  const body = { name, email, password };
  // The backend only treats the field as admin-bootstrap when it matches
  // ADMIN_BOOTSTRAP_TOKEN. Sending an empty string would fail the equality
  // check on the server, so we omit the key entirely when not provided.
  if (superSecretKey) body.superSecretKey = superSecretKey;

  const data = await request('/auth/register', {
    method: 'POST',
    body,
  });
  return {
    token: data.token,
    user: {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    },
  };
}

export async function fetchVideos() {
  const data = await request('/videos');
  const list = Array.isArray(data) ? data : data?.videos ?? data?.data ?? [];

  // Normalize the backend's { title, youtubeId, category, tags, ... }
  // into the { id, title, url, category, channel, description, duration, instructor }
  // shape that the existing UI components (VideoCard, PlayerOverlay, etc.) consume.
  return list.map(normalizeVideo);
}

export async function createVideo(video, token) {
  const data = await request('/videos', {
    method: 'POST',
    token,
    body: {
      title: video.title,
      youtubeId: extractYouTubeId(video.url) || video.youtubeId,
      category: video.category || 'General',
      tags: video.tags || [],
    },
  });
  return normalizeVideo(data);
}

export async function deleteVideo(id, token) {
  return request(`/videos/${id}`, { method: 'DELETE', token });
}

// -------- helpers --------

function normalizeVideo(raw = {}) {
  const id = raw.id ?? raw._id ?? raw.videoId ?? String(Date.now());
  const youtubeId = raw.youtubeId ?? raw.youtube_id ?? null;
  const url = raw.url ?? raw.videoUrl ?? raw.link ?? (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : '');

  return {
    id,
    title: raw.title ?? raw.name ?? 'Untitled video',
    url,
    category: raw.category ?? raw.tag ?? 'General',
    channel: raw.channel ?? raw.author ?? '',
    description: raw.description ?? raw.desc ?? '',
    duration: raw.duration ?? '',
    instructor: raw.instructor ?? raw.postedBy?.name ?? '',
    tags: raw.tags ?? [],
    postedBy: raw.postedBy ?? null,
    createdAt: raw.createdAt ?? null,
  };
}

export function extractYouTubeId(url = '') {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }
  } catch {
    return null;
  }
  return null;
}

export { API_BASE_URL };