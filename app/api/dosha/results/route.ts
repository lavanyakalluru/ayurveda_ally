import { NextRequest, NextResponse } from "next/server";
import QuizResult from "@/models/QuizResult";
import { connectToDatabase } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ results: [] });

    const results = await QuizResult.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}