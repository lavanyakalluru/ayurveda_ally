import mongoose from "mongoose"

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

export async function connectToDatabase() {
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null }
  }

  if (global.mongooseCache.conn) return global.mongooseCache.conn

  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: "ayurveda",
      bufferCommands: false,
    })
  }

  global.mongooseCache.conn = await global.mongooseCache.promise
  return global.mongooseCache.conn
}
