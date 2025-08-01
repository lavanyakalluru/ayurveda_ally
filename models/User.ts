import mongoose from "mongoose";

// ✅ Global cache setup (only once)
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

// ✅ Connect to MongoDB
async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("⚠️ Please define the MONGODB_URI in .env.local");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "ayurveda",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error("❌ DB connection failed:", e);
    throw e;
  }
}

// ✅ Define User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  phone:String,
  location:String,
  bio: String,
  birthDate: String,
  occupation: String,

});

// ✅ Export the User model (re-use if already compiled)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export { connectToDatabase };
export default User;
