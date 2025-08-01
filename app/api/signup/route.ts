import { NextResponse } from "next/server"
import User, { connectToDatabase } from "@/models/User"
export async function POST(req: Request) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { name, email, password } = body

    // Optional: Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }
    const newUser = new User({ name,email, password });
    
    await newUser.save()

    return NextResponse.json(newUser)
  } catch (err) {
    console.error("❌ Signup error:", err)
    return NextResponse.json({ message: "Signup failed" }, { status: 500 })
  }
}
