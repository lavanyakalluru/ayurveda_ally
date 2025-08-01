import { NextResponse } from "next/server"
import User, { connectToDatabase } from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await connectToDatabase()

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (password !== existingUser.password) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
    

        return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone || "",
        location: existingUser.location || "",
        bio: existingUser.bio || "",
        birthDate: existingUser.birthDate || "",
        occupation: existingUser.occupation || "",
        avatar: existingUser.avatar || ""
      }
    })
  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
