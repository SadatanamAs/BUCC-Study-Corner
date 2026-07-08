import mongoose from 'mongoose';
import { envOrEmpty, isProd } from './env.js';

// Cache the Mongoose connection across serverless invocations.
// Without this, every cold start on Vercel would open a fresh connection
// (and MongoDB Atlas would eventually refuse / rate-limit us).
const cached = global._mongooseConnection || { conn: null, promise: null };
global._mongooseConnection = cached;

const connectDB = async () => {
  // Fail fast in production if MONGO_URI is not configured. The in-memory
  // fallback stores data in process memory, which is lost on every cold
  // start in a serverless environment — a misconfigured production deploy
  // would silently lose every user and video that gets created.
  // envOrEmpty() rejects present-but-empty values too, so a Vercel env var
  // set to "" does not sneak through as "production-but-no-DB".
  const MONGO_URI = envOrEmpty('MONGO_URI');
  if (!MONGO_URI) {
    if (isProd()) {
      throw new Error('MONGO_URI environment variable is required in production');
    }
    console.log('No MONGO_URI provided; using in-memory fallback storage (development only)');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // The server-selection timeout defaults to 30s, which exceeds Vercel's
    // 10s serverless function timeout for the Hobby plan. When the cluster's
    // primary replica is briefly unreachable (or a node hasn't elected fast
    // enough), Mongoose sits waiting past Vercel's kill switch and returns
    // FUNCTION_INVOCATION_FAILED. Tighter timeouts fail fast and let Vercel
    // retry on a fresh instance.
    // If the connect fails, we clear `cached.promise` so the next request
    // gets a fresh attempt instead of replaying the same rejected promise.
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      })
      .then((mongoose) => mongoose)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  return cached.conn;
};

export default connectDB;