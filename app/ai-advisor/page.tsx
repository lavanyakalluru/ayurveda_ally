"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Sparkles, Leaf, Heart, Brain, ClipboardCopy, ChevronDown, ChevronUp, Bot, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Recommendation {
  category: string;
  title: string;
  description: string;
  icon: any;
}

function parseGeminiResponse(content: string): { recommendations: Recommendation[]; followUps: string[] } {
  const recommendations: Recommendation[] = [];
  const followUps: string[] = [];
  const lines = content.split("\n");
  let inRecs = false;
  let inFollowUps = false;

  for (const line of lines) {
    if (line.toLowerCase().includes("recommendations")) {
      inRecs = true;
      inFollowUps = false;
      continue;
    }
    if (line.toLowerCase().includes("follow-up")) {
      inRecs = false;
      inFollowUps = true;
      continue;
    }
    if (inRecs && line.match(/^\d+\./)) {
      const match = line.match(/^\d+\. \[(.*?)\] (.*?): (.*)$/);
      if (match) {
        const [, category, title, description] = match;
        let icon = Leaf;
        if (category.toLowerCase().includes("herb")) icon = Heart;
        if (category.toLowerCase().includes("lifestyle")) icon = Brain;
        recommendations.push({ category, title, description, icon });
      }
    }
    if (inFollowUps && line.trim().startsWith("-")) {
      followUps.push(line.replace(/^\s*-\s*/, ""));
    }
  }

  return { recommendations, followUps };
}

export default function AIAdvisorPage() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [fullResponse, setFullResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [copied, setCopied] = useState(false);
  const [doshaResults, setDoshaResults] = useState<any>(null);
  const [isLoadingDosha, setIsLoadingDosha] = useState(false);

  // Fetch dosha quiz results when component mounts
  useEffect(() => {
    if (user?.email) {
      setIsLoadingDosha(true);
      fetch(`/api/dosha/results?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setDoshaResults(data.results[0]); // Get most recent result
          }
        })
        .catch((error) => {
          console.error("Error fetching dosha results:", error);
        })
        .finally(() => {
          setIsLoadingDosha(false);
        });
    }
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setFollowUpQuestions([]);
    setFullResponse("");

    try {
      // Create enhanced prompt with dosha information
      let prompt = `You are an expert Ayurveda advisor.\n\n`;
      
      if (doshaResults) {
        prompt += `User's Dosha Profile:\n- Primary Dosha: ${doshaResults.dominantDosha}\n- Vata Score: ${doshaResults.scores?.vata || 0}\n- Pitta Score: ${doshaResults.scores?.pitta || 0}\n- Kapha Score: ${doshaResults.scores?.kapha || 0}\n\n`;
      }
      
      prompt += `Given the following user input, provide:\n1. Three personalized recommendations in the format: [Category] Title: Description\n2. Three follow-up questions to clarify the user's health situation.\n\nUser input: ${input}`;

      const body = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      setFullResponse(content);
      const { recommendations, followUps } = parseGeminiResponse(content);
      setRecommendations(recommendations);
      setFollowUpQuestions(followUps);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary mr-2" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold">AI Ayurveda Advisor</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Describe your symptoms, health goals, or concerns in natural language. Our AI will provide personalized
            Ayurvedic recommendations based on ancient wisdom.
          </p>
        </div>

        {/* Dosha Profile Card */}
        {user?.email && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Your Dosha Profile</span>
                {isLoadingDosha && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {doshaResults ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Primary Dosha:</span>
                    <Badge variant="default" className="capitalize">
                      {doshaResults.dominantDosha}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">Vata</div>
                      <div className="text-muted-foreground">{doshaResults.scores?.vata || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Pitta</div>
                      <div className="text-muted-foreground">{doshaResults.scores?.pitta || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Kapha</div>
                      <div className="text-muted-foreground">{doshaResults.scores?.kapha || 0}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    ✓ Personalized recommendations will be based on your dosha profile
                  </div>
                </div>
                             ) : !isLoadingDosha ? (
                 <div className="space-y-3">
                   <div className="flex items-center space-x-2 text-amber-600">
                     <AlertCircle className="h-4 w-4" />
                     <span className="text-sm">No dosha quiz results found.</span>
                   </div>
                   <Button asChild variant="outline" size="sm">
                     <Link href="/dosha-quiz">Take Dosha Quiz</Link>
                   </Button>
                 </div>
              ) : (
                <div className="text-sm text-muted-foreground">Loading your dosha profile...</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Input Card */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Tell us about your health concerns</CardTitle>
            {doshaResults && (
              <p className="text-sm text-muted-foreground">
                Your recommendations will be personalized based on your {doshaResults.dominantDosha} dosha profile.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="e.g., I have been feeling tired lately and have trouble sleeping. I also get acne breakouts frequently..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px]"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Parsed Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-center">Your Personalized Recommendations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <rec.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {rec.category}
                        </Badge>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Follow-up questions */}
            {followUpQuestions.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Follow-up Questions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click on any question to get more specific recommendations
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {followUpQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 bg-transparent"
                      onClick={() => handleFollowUp(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Full Gemini Response */}
        {fullResponse && (
          <Card className="mt-10 border-2 border-orange-400 bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <div className="flex items-center gap-2">
                <Bot className="text-orange-500 w-6 h-6" />
                <CardTitle className="text-orange-700 text-base md:text-lg">Gemini Full Response</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <button
                  title={showFullResponse ? 'Collapse' : 'Expand'}
                  className="p-1 rounded hover:bg-orange-100"
                  onClick={() => setShowFullResponse((v) => !v)}
                  type="button"
                >
                  {showFullResponse ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-orange-500" />}
                </button>
                <button
                  title="Copy to clipboard"
                  className={`p-1 rounded hover:bg-orange-100 ${copied ? 'bg-orange-200' : ''}`}
                  onClick={async () => {
                    await navigator.clipboard.writeText(fullResponse);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  type="button"
                >
                  <ClipboardCopy className="w-5 h-5 text-orange-500" />
                </button>
              </div>
            </CardHeader>
            {showFullResponse && (
              <CardContent className="pt-0 pb-4 px-4">
                <pre className="whitespace-pre-wrap text-sm font-mono text-orange-900 bg-orange-50 rounded p-3 border border-orange-200 overflow-x-auto">
                  {fullResponse}
                </pre>
                {copied && <div className="text-orange-600 text-xs mt-1">Copied!</div>}
              </CardContent>
            )}
          </Card>
        )}

        {/* Example queries */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Example queries you can try:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="cursor-pointer" onClick={() => setInput("I have trouble sleeping and feel anxious")}>
                  Sleep & Anxiety
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setInput("I want to improve my digestion")}>
                  Digestive Health
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setInput("I feel tired and have low energy")}>
                  Energy & Fatigue
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setInput("I have skin problems and acne")}>
                  Skin Health
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
