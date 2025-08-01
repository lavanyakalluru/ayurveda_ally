import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    const { userEmail, doshaResults } = await req.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: "Gemini API key not configured" 
      }, { status: 500 });
    }

    if (!doshaResults || !doshaResults.dominantDosha) {
      return NextResponse.json({ 
        success: false, 
        message: "Dosha results required" 
      }, { status: 400 });
    }

    const prompt = `Generate a personalized daily wellness plan for someone with ${doshaResults.dominantDosha} dosha. 
    
    Dosha Details:
    - Primary Dosha: ${doshaResults.dominantDosha}
    - Vata Score: ${doshaResults.scores?.vata || 0}
    - Pitta Score: ${doshaResults.scores?.pitta || 0}
    - Kapha Score: ${doshaResults.scores?.kapha || 0}

    Please create a structured daily plan with morning, afternoon, and evening activities. 
    Each activity should include:
    - Time
    - Activity description
    - Points (5-20 based on importance)
    - Brief explanation of why it's beneficial for this dosha

    Return the response as a JSON object with this exact structure:
    {
      "morning": [
        {
          "id": 0,
          "time": "6:00 AM",
          "activity": "Wake up & drink warm water with lemon",
          "points": 10,
          "explanation": "Warm water helps balance vata dosha"
        }
      ],
      "afternoon": [...],
      "evening": [...]
    }

    Focus on activities that balance the ${doshaResults.dominantDosha} dosha.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }),
      // Add timeout and retry options
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    const plan = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      plan: plan,
      userEmail: userEmail
    });

  } catch (error: any) {
    console.error("Error generating plan:", error);
    
    // Check if it's a timeout error
    if (error.name === 'TimeoutError' || error.code === 23) {
      console.log("Gemini API timed out, using fallback plan");
    }
    
    // Return a fallback plan if AI fails
    const fallbackPlan = {
      morning: [
        { id: 0, time: "6:00 AM", activity: "Wake up & drink warm water with lemon", points: 10, explanation: "Warm water helps balance doshas" },
        { id: 1, time: "6:30 AM", activity: "Meditation (10 minutes)", points: 15, explanation: "Meditation calms the mind" },
        { id: 2, time: "7:00 AM", activity: "Gentle yoga or stretching", points: 20, explanation: "Yoga balances energy" },
        { id: 3, time: "8:00 AM", activity: "Breakfast with seasonal fruits", points: 15, explanation: "Fresh fruits provide natural energy" },
      ],
      afternoon: [
        { id: 4, time: "12:00 PM", activity: "Light, balanced lunch", points: 15, explanation: "Balanced meals support digestion" },
        { id: 5, time: "1:00 PM", activity: "Short walk in nature", points: 10, explanation: "Nature walk reduces stress" },
        { id: 6, time: "3:00 PM", activity: "Herbal tea (Ginger or Mint)", points: 5, explanation: "Herbal tea aids digestion" },
      ],
      evening: [
        { id: 7, time: "6:00 PM", activity: "Early, light dinner", points: 15, explanation: "Early dinner supports good sleep" },
        { id: 8, time: "8:00 PM", activity: "Relaxing activities (reading, music)", points: 10, explanation: "Relaxation prepares for sleep" },
        { id: 9, time: "10:00 PM", activity: "Sleep preparation routine", points: 10, explanation: "Good sleep hygiene is essential" },
      ],
    };

    return NextResponse.json({ 
      success: true, 
      plan: fallbackPlan,
      message: "Using fallback plan due to AI service issue"
    });
  }
} 