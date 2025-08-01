import { NextRequest, NextResponse } from "next/server";
import User, {connectToDatabase} from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, location, bio, birthDate, occupation } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          phone,
          location,
          bio,
          birthDate,
          occupation,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        bio: updatedUser.bio,
        birthDate: updatedUser.birthDate,
        occupation: updatedUser.occupation,
        avatar: updatedUser.avatar ?? null,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
