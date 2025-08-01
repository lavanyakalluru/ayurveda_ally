"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Leaf,
  Heart,
  Brain,
  TrendingUp,
  Plus,
  Edit,
  CheckCircle2,
  Circle,
  Target,
  Award,
  Flame,
  Droplets,
  Wind,
  Sun,
  Moon,
  Activity,
  Users,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { ProgressStatusBar } from "@/components/progress-status-bar"

function getDoshaIcon(dosha: string) {
  switch (dosha?.toLowerCase()) {
    case "vata":
      return Wind
    case "pitta":
      return Flame
    case "kapha":
      return Droplets
    default:
      return Circle
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("daily")
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [weeklyStats, setWeeklyStats] = useState({
    totalPoints: 0,
    streak: 0,
    completedTasks: 0,
    totalTasks: 35,
    weeklyGoal: 300,
    weeklyProgress: 0,
    bestStreak: 0,
    totalCompleted: 0,
  })
  const [progressData, setProgressData] = useState([
    { metric: "Sleep Quality", current: 75, target: 90, change: +5, trend: "up" as const },
    { metric: "Energy Level", current: 60, target: 85, change: +12, trend: "up" as const },
    { metric: "Stress Management", current: 70, target: 80, change: -3, trend: "down" as const },
    { metric: "Digestion", current: 80, target: 90, change: +8, trend: "up" as const },
  ])
  const [achievements, setAchievements] = useState<any[]>([])
  const [dailyActivity, setDailyActivity] = useState<any[]>([])
  const [weeklyGoals, setWeeklyGoals] = useState<any>({ currentWeek: 1, goals: [] })
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [dailyPlan, setDailyPlan] = useState({
    morning: [
      { id: 0, time: "6:00 AM", activity: "Wake up & drink warm water with lemon", completed: false, points: 10 },
      { id: 1, time: "6:30 AM", activity: "Meditation (10 minutes)", completed: false, points: 15 },
      { id: 2, time: "7:00 AM", activity: "Gentle yoga or stretching", completed: false, points: 20 },
      { id: 3, time: "8:00 AM", activity: "Breakfast: Oatmeal with cooling fruits", completed: false, points: 15 },
    ],
    afternoon: [
      { id: 4, time: "12:00 PM", activity: "Lunch: Light, cooling meal", completed: false, points: 15 },
      { id: 5, time: "1:00 PM", activity: "Short walk in nature", completed: false, points: 10 },
      { id: 6, time: "3:00 PM", activity: "Herbal tea (Mint or Fennel)", completed: false, points: 5 },
    ],
    evening: [
      { id: 7, time: "6:00 PM", activity: "Dinner: Early, light meal", completed: false, points: 15 },
      { id: 8, time: "8:00 PM", activity: "Relaxing activities (reading, music)", completed: false, points: 10 },
      { id: 9, time: "10:00 PM", activity: "Sleep preparation routine", completed: false, points: 10 },
    ],
  })
  const [isLoadingPlan, setIsLoadingPlan] = useState(false)

  // Fetch quiz results
  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/dosha/results?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setQuizResults(data.results || []));
  }, [user?.email]);

  // Fetch user progress data
  useEffect(() => {
    if (!user?.email) return;
    setIsLoadingProgress(true);
    console.log("Fetching progress for:", user.email);
    fetch(`/api/user/progress?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Progress data received:", data);
        if (data.success) {
          console.log("Setting progress data:", data.progressData);
          setWeeklyStats(data.weeklyStats || weeklyStats);
          setProgressData(data.progressData || progressData);
          setCompletedTasks(data.completedTasks || []);
          setAchievements(data.achievements || []);
          setDailyActivity(data.dailyActivity || []);
          setWeeklyGoals(data.weeklyGoals || { currentWeek: 1, goals: [] });
        } else {
          console.log("Progress API returned error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching progress:", error);
        // If API doesn't exist yet, use default values
        console.log("Progress API not implemented yet, using default values");
      })
      .finally(() => {
        setIsLoadingProgress(false);
      });
  }, [user?.email]);

  // Debug: Monitor progressData changes
  useEffect(() => {
    console.log("progressData changed:", progressData);
  }, [progressData]);

  // Generate AI plan when user has dosha results
  useEffect(() => {
    if (user?.email && quizResults.length > 0 && !isLoadingPlan) {
      generateAIPlan();
    }
  }, [user?.email, quizResults]);

  const generateAIPlan = async () => {
    if (!user?.email || quizResults.length === 0) return;
    
    setIsLoadingPlan(true);
    try {
      const latestResult = quizResults[0]; // Get most recent result
      const response = await fetch("/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          doshaResults: {
            dominantDosha: latestResult.dominantDosha,
            scores: latestResult.scores,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        // Add IDs to the generated plan
        const planWithIds = {
          morning: data.plan.morning?.map((task: any, index: number) => ({ ...task, id: index })) || [],
          afternoon: data.plan.afternoon?.map((task: any, index: number) => ({ ...task, id: index + 10 })) || [],
          evening: data.plan.evening?.map((task: any, index: number) => ({ ...task, id: index + 20 })) || [],
        };
        setDailyPlan(planWithIds);
        
        // Reset only completed tasks, keep progress data and points
        setCompletedTasks([]);
        
        // Keep existing points, just reset completed tasks count
        const newWeeklyStats = {
          ...weeklyStats,
          completedTasks: 0,
        };
        setWeeklyStats(newWeeklyStats);
        
        // Save the reset state to database
        if (user?.email) {
          await fetch("/api/user/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              completedTasks: [],
              weeklyStats: newWeeklyStats,
              progressData: progressData, // Keep existing progress data
            }),
          });
          console.log("AI plan generated, progress data preserved:", progressData);
        }
      }
    } catch (error) {
      console.error("Failed to generate AI plan:", error);
    } finally {
      setIsLoadingPlan(false);
    }
  };



  const recommendations = [
    {
      category: "Dietary",
      title: "Cooling Foods",
      description: "Focus on sweet, bitter, and astringent tastes. Include cucumber, coconut, and leafy greens.",
      icon: Leaf,
      priority: "High",
      status: "active",
    },
    {
      category: "Herbal",
      title: "Brahmi Supplement",
      description: "Take Brahmi to support mental clarity and reduce Pitta-related stress.",
      icon: Heart,
      priority: "Medium",
      status: "pending",
    },
    {
      category: "Lifestyle",
      title: "Evening Routine",
      description: "Establish a cooling evening routine with gentle activities before bed.",
      icon: Brain,
      priority: "High",
      status: "completed",
    },
  ]

  
  

  const toggleTask = async (taskId: number) => {
    const newCompletedTasks = completedTasks.includes(taskId) 
      ? completedTasks.filter((id) => id !== taskId) 
      : [...completedTasks, taskId];
    
    setCompletedTasks(newCompletedTasks);

    // Calculate new points
    const allTasks = Object.values(dailyPlan).flat();
    const newPoints = allTasks
      .filter(task => newCompletedTasks.includes(task.id))
      .reduce((sum, task) => sum + task.points, 0);

    // Update weekly stats with enhanced tracking
    const newWeeklyStats = {
      ...weeklyStats,
      totalPoints: newPoints,
      completedTasks: newCompletedTasks.length,
      totalCompleted: weeklyStats.totalCompleted + (newCompletedTasks.length > completedTasks.length ? 1 : -1),
    };
    setWeeklyStats(newWeeklyStats);

    // Save to database with enhanced tracking
    if (user?.email) {
      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            completedTasks: newCompletedTasks,
            weeklyStats: newWeeklyStats,
            progressData: progressData,
          }),
        });
        
        const result = await response.json();
        if (result.success && result.data?.newAchievements?.length > 0) {
          // Show achievement notification
          console.log("New achievements unlocked:", result.data.newAchievements);
          // You can add a toast notification here
        }
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  }

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                {greeting}, {user?.name?.split(" ")[0] || "Friend"}!
              </h1>
              <p className="text-muted-foreground">Ready to continue your wellness journey today?</p>
            </div>
           
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weekly Points</p>
                  <p className="text-2xl font-bold">{weeklyStats.totalPoints}</p>
                  <p className="text-xs text-muted-foreground">Goal: {weeklyStats.weeklyGoal}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Progress value={(weeklyStats.totalPoints / weeklyStats.weeklyGoal) * 100} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{weeklyStats.streak} days</p>
                  <p className="text-xs text-green-600">Keep it up!</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Flame className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">
                    {weeklyStats.completedTasks}/{weeklyStats.totalTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={(weeklyStats.completedTasks / weeklyStats.totalTasks) * 100} className="mt-3" />
            </CardContent>
          </Card>

          {/* Most recent dosha quiz result summary */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Primary Dosha</p>
                  <p className="text-2xl font-bold">
                    {quizResults[0]?.dominantDosha ? quizResults[0].dominantDosha : "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {quizResults[0]?.createdAt ? new Date(quizResults[0].createdAt).toLocaleDateString() : "No quiz taken yet"}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  {(() => {
                    const Icon = getDoshaIcon(quizResults[0]?.dominantDosha)
                    return <Icon className="h-6 w-6 text-orange-600" />
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements & Progress */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                  <p className="text-xs text-muted-foreground">Total completed: {weeklyStats.totalCompleted}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Plan */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Today's Plan</span>
                    {quizResults.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {quizResults[0].dominantDosha} Dosha
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {completedTasks.length}/{Object.values(dailyPlan).flat().length} completed
                    </Badge>
                    {quizResults.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={generateAIPlan}
                        disabled={isLoadingPlan}
                      >
                        {isLoadingPlan ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Regenerate Plan
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPlan} onValueChange={setSelectedPlan}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily" className="space-y-6 mt-6">
                    {Object.entries(dailyPlan).map(([period, activities]) => (
                      <div key={period} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold capitalize text-lg">{period}</h3>
                          {period === "morning" && <Sun className="h-4 w-4 text-yellow-500" />}
                          {period === "afternoon" && <Activity className="h-4 w-4 text-orange-500" />}
                          {period === "evening" && <Moon className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="space-y-2">
                          {activities.map((activity) => {
                            const isCompleted = completedTasks.includes(activity.id)
                            return (
                              <div
                                key={activity.id}
                                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                                  isCompleted ? "bg-green-50 border-green-200" : "bg-muted/30 hover:bg-muted/50"
                                }`}
                                onClick={() => toggleTask(activity.id)}
                              >
                                <button className="flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </button>
                                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm font-medium flex-shrink-0">{activity.time}</span>
                                <span
                                  className={`flex-1 text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {activity.activity}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  +{activity.points} pts
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Progress Status Bar */}
            <ProgressStatusBar 
              progressData={progressData}
              weeklyStats={weeklyStats}
              isLoading={isLoadingProgress}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dosha Quiz Results */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Your Dosha Quiz Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizResults.length === 0 ? (
                  <div className="text-muted-foreground">No quiz results yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {quizResults.map((result, idx) => {
                      const Icon = getDoshaIcon(result.dominantDosha);
                      return (
                        <li key={result._id || idx} className="flex items-center space-x-4">
                          <Icon className="h-6 w-6 text-primary" />
                          <div>
                            <div className="font-bold capitalize">{result.dominantDosha}</div>
                            <div className="text-xs text-muted-foreground">
                              Vata: {result.scores?.vata ?? 0}, Pitta: {result.scores?.pitta ?? 0}, Kapha: {result.scores?.kapha ?? 0}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {result.createdAt ? new Date(result.createdAt).toLocaleString() : ""}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <Button asChild variant="outline" size="sm" className="w-full bg-transparent mt-4">
                  <Link href="/dosha-quiz">Retake Quiz</Link>
                </Button>
              </CardContent>
            </Card>
         
            {/* Achievements */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.length === 0 ? (
                  <div className="text-center py-4">
                    <Award className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Complete tasks to unlock achievements!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement, index) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {achievement.category}
                        </Badge>
                      </div>
                    ))}
                    {achievements.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View All ({achievements.length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Recommendations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Active Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="space-y-2 p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <rec.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{rec.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={rec.priority === "High" ? "default" : "secondary"} className="text-xs">
                          {rec.priority}
                        </Badge>
                        {rec.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
