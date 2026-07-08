import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api.js';

const STORAGE_TOKEN_KEY = 'bucc-auth-token';
const STORAGE_USER_KEY = 'bucc-auth-user';

/**
 * Reads the persisted session out of localStorage.
 * Shape: { token, user: { _id, name, email, role } } | null
 */
export function getSession() {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const userRaw = localStorage.getItem(STORAGE_USER_KEY);
    if (!token || !userRaw) return null;
    const user = JSON.parse(userRaw);
    return { token, user };
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
}

/**
 * Logs in via the backend and stores the resulting JWT.
 * Throws on invalid credentials — let the caller display the message.
 */
export async function loginWithBackend({ email, password }) {
  const { token, user } = await apiLogin({ email, password });
  saveSession(token, user);
  return { token, user };
}

/**
 * Registers a new regular user via the backend and stores the resulting JWT.
 * The backend's /api/auth/register always creates role='user' — admins are
 * bootstrapped out-of-band via /api/auth/upgrade-admin.
 */
export async function registerWithBackend({ name, email, password }) {
  const { token, user } = await apiRegister({ name, email, password });
  saveSession(token, user);
  return { token, user };
}