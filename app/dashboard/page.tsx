"use client"

import { useState } from "react"
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

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState("daily")
  const [completedTasks, setCompletedTasks] = useState<number[]>([0, 1])

  const doshaProfile = {
    primary: "Pitta",
    secondary: "Vata",
    scores: { vata: 3, pitta: 6, kapha: 2 },
    lastUpdated: "2024-01-15",
  }

  const dailyPlan = {
    morning: [
      { id: 0, time: "6:00 AM", activity: "Wake up & drink warm water with lemon", completed: false, points: 10 },
      { id: 1, time: "6:30 AM", activity: "Meditation (10 minutes)", completed: false, points: 15 },
      { id: 2, time: "7:00 AM", activity: "Gentle yoga or stretching", completed: true, points: 20 },
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
  }

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

  const progressData = [
    { metric: "Sleep Quality", current: 75, target: 90, change: +5, trend: "up" },
    { metric: "Energy Level", current: 60, target: 85, change: +12, trend: "up" },
    { metric: "Stress Management", current: 70, target: 80, change: -3, trend: "down" },
    { metric: "Digestion", current: 80, target: 90, change: +8, trend: "up" },
  ]

  const weeklyStats = {
    totalPoints: 0,
    streak: 0,
    completedTasks: 0,
    totalTasks: 35,
    weeklyGoal: 300,
  }

  const recentAchievements = [
    { title: "7-Day Streak", description: "Completed daily routine for 7 days", icon: Award, date: "Today" },
    { title: "Meditation Master", description: "Meditated for 30 days straight", icon: Brain, date: "2 days ago" },
    { title: "Early Bird", description: "Woke up before 6 AM for 5 days", icon: Sun, date: "1 week ago" },
  ]

  const upcomingEvents = [
    { title: "Ayurveda Workshop", date: "Jan 25", time: "2:00 PM", type: "workshop" },
    { title: "Dosha Quiz Reminder", date: "Jan 30", time: "9:00 AM", type: "reminder" },
    { title: "Monthly Check-in", date: "Feb 1", time: "10:00 AM", type: "checkin" },
  ]

  const toggleTask = (taskId: number) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const getDoshaIcon = (dosha: string) => {
    switch (dosha.toLowerCase()) {
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
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Primary Dosha</p>
                  <p className="text-2xl font-bold">{doshaProfile.primary}</p>
                  <p className="text-xs text-muted-foreground">Balanced</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  {(() => {
                    const Icon = getDoshaIcon(doshaProfile.primary)
                    return <Icon className="h-6 w-6 text-orange-600" />
                  })()}
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
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {completedTasks.length}/{Object.values(dailyPlan).flat().length} completed
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
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

            {/* Progress Tracking */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Progress Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {progressData.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm flex items-center ${
                            item.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <TrendingUp className={`h-3 w-3 mr-1 ${item.trend === "down" ? "rotate-180" : ""}`} />
                          {item.change > 0 ? "+" : ""}
                          {item.change}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.current}% / {item.target}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={item.current} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {item.current}%</span>
                        <span>Target: {item.target}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Today's Progress
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dosha Profile */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Your Dosha Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {(() => {
                      const Icon = getDoshaIcon(doshaProfile.primary)
                      return <Icon className="h-6 w-6 text-primary" />
                    })()}
                    <div className="text-2xl font-bold text-primary">{doshaProfile.primary}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Primary Dosha</div>
                </div>
                <div className="space-y-2">
                  {Object.entries(doshaProfile.scores).map(([dosha, score]) => (
                    <div key={dosha} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const Icon = getDoshaIcon(dosha)
                          return <Icon className="h-3 w-3 text-muted-foreground" />
                        })()}
                        <span className="capitalize text-sm">{dosha}</span>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i < score ? "bg-primary" : "bg-muted"}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                  <Link href="/dosha-quiz">Retake Quiz</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-primary/10">
                      <achievement.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <div className="p-2 rounded-full bg-blue-100">
                      {event.type === "workshop" && <Users className="h-4 w-4 text-blue-600" />}
                      {event.type === "reminder" && <Bell className="h-4 w-4 text-blue-600" />}
                      {event.type === "checkin" && <Heart className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
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
