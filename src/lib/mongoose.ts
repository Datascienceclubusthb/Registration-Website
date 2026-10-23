import mongoose from 'mongoose';

// Define the type for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// Initialize the cached connection object
let cached: MongooseCache = global.mongoose || {conn: null, promise: null};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  // During build time, if MONGODB_URI is not available, return null gracefully
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    // During build or development without DB, return null
    console.warn('MONGODB_URI not defined, skipping database connection');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}

export default dbConnect;
