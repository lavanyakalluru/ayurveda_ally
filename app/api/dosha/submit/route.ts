import { NextRequest, NextResponse } from "next/server";
import QuizResult from "@/models/QuizResult";
import { connectToDatabase } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userEmail, dominantDosha, scores, answers } = await req.json();

    if (!userEmail || !dominantDosha) {
      return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
    }

    const result = await QuizResult.create({
      userEmail,
      dominantDosha,
      scores,
      answers,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json({ success: false, message: "Failed to save result" }, { status: 500 });
  }
} 