import mongoose from 'mongoose';

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
  if (!process.env.MONGO_URI) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI environment variable is required in production');
    }
    console.log('No MONGO_URI provided; using in-memory fallback storage (development only)');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { bufferCommands: false })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  return cached.conn;
};

export default connectDB;