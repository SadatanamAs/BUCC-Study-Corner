import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {
  createMemoryUser,
  findMemoryUserByEmail,
  findMemoryUserById,
  isMemoryStoreEnabled,
} from '../config/storage.js';
import { envOrEmpty, isProd } from '../config/env.js';

// Fail fast in production if JWT_SECRET is not configured. Without this guard,
// a missing env var silently falls back to a hardcoded secret that ships in
// the public repo, allowing anyone to forge admin tokens. We trim here too:
// a present-but-empty value must NOT be accepted as a valid secret.
const JWT_SECRET = envOrEmpty('JWT_SECRET');
if (!JWT_SECRET && isProd()) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

const normalizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async (req, res) => {
  const { name, email, password, superSecretKey } = req.body;

  let role = 'user';
  // Trim before comparing so an empty `ADMIN_BOOTSTRAP_TOKEN=` cannot be
  // bypassed by a client sending an empty `superSecretKey`.
  const envToken = envOrEmpty('ADMIN_BOOTSTRAP_TOKEN');
  if (envToken && superSecretKey && superSecretKey === envToken) {
    role = 'admin';
  }

  try {
    if (isMemoryStoreEnabled()) {
      const existing = await findMemoryUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await createMemoryUser({ name, email, password, role });
      if (user) {
        return res.status(201).json({
          ...normalizeUser(user),
          token: generateToken(user._id),
        });
      }
      return res.status(400).json({ message: 'Invalid user data' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
      res.status(201).json({
        ...normalizeUser(user),
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (isMemoryStoreEnabled()) {
      const user = await findMemoryUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          ...normalizeUser(user),
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        ...normalizeUser(user),
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    if (isMemoryStoreEnabled()) {
      const user = await findMemoryUserById(req.user._id);
      if (user) {
        return res.json(normalizeUser(user));
      }
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.json(normalizeUser(user));
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};