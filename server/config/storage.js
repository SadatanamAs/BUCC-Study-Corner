import bcrypt from 'bcryptjs';

const memoryUsers = [];
const memoryVideos = [];

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// No seed data: previously the in-memory store shipped with a hardcoded
// admin@bucc.edu / admin123 login. Anyone who deployed without configuring
// MONGO_URI could log in with those credentials. The store is now empty
// until users explicitly create accounts through the API.
async function ensureSeedData() {
  // intentionally empty — callers fall through to empty arrays
}

/**
 * Returns true when no MONGO_URI is configured. Only intended for local
 * development — controllers must short-circuit if this is true, and the
 * server fails fast at startup in production when MONGO_URI is missing.
 */
export function isMemoryStoreEnabled() {
  return !process.env.MONGO_URI;
}

export async function findMemoryUserByEmail(email) {
  await ensureSeedData();
  return memoryUsers.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null;
}

export async function findMemoryUserById(id) {
  await ensureSeedData();
  return memoryUsers.find((user) => user._id.toString() === id.toString()) || null;
}

export async function createMemoryUser({ name, email, password, role = 'user' }) {
  await ensureSeedData();
  const existing = await findMemoryUserByEmail(email);
  if (existing) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    _id: createId('user'),
    name,
    email: String(email).toLowerCase(),
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryUsers.push(user);
  return user;
}

export async function updateMemoryUserRole(id, role) {
  await ensureSeedData();
  const user = await findMemoryUserById(id);
  if (!user) return null;
  user.role = role;
  user.updatedAt = new Date().toISOString();
  return user;
}

export async function listMemoryVideos() {
  await ensureSeedData();
  return [...memoryVideos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createMemoryVideo({ title, youtubeId, category = 'General', tags = [], postedBy }) {
  await ensureSeedData();
  const video = {
    _id: createId('video'),
    title,
    youtubeId,
    category,
    tags,
    postedBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryVideos.unshift(video);
  return video;
}

export async function findMemoryVideoById(id) {
  await ensureSeedData();
  return memoryVideos.find((video) => video._id.toString() === id.toString()) || null;
}

export async function deleteMemoryVideo(id) {
  await ensureSeedData();
  const index = memoryVideos.findIndex((video) => video._id.toString() === id.toString());
  if (index === -1) return false;
  memoryVideos.splice(index, 1);
  return true;
}

export async function updateMemoryVideo(id, updates) {
  await ensureSeedData();
  const video = await findMemoryVideoById(id);
  if (!video) return null;
  Object.assign(video, updates, { updatedAt: new Date().toISOString() });
  return video;
}
