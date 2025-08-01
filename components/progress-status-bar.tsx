"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProgressMetric {
  metric: string
  current: number
  target: number
  change: number
  trend: "up" | "down" | "stable"
}

interface ProgressStatusBarProps {
  progressData: ProgressMetric[]
  weeklyStats: {
    totalPoints: number
    streak: number
    completedTasks: number
    totalTasks: number
    weeklyGoal: number
    weeklyProgress: number
    bestStreak: number
    totalCompleted: number
  }
  isLoading?: boolean
}

export function ProgressStatusBar({ progressData, weeklyStats, isLoading = false }: ProgressStatusBarProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getProgressLabel = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 80) return "Excellent"
    if (percentage >= 60) return "Good"
    if (percentage >= 40) return "Fair"
    return "Needs Improvement"
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                </div>
                <div className="animate-pulse bg-gray-200 h-2 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Wellness Progress Status</span>
          <Badge variant="outline" className="text-xs">
            {weeklyStats.completedTasks}/{weeklyStats.totalTasks} Tasks
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Weekly Progress</span>
            <span className="text-sm text-muted-foreground">
              {weeklyStats.totalPoints}/{weeklyStats.weeklyGoal} points
            </span>
          </div>
          <Progress value={(weeklyStats.totalPoints / weeklyStats.weeklyGoal) * 100} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Current Streak: {weeklyStats.streak} days</span>
            <span>Best: {weeklyStats.bestStreak} days</span>
          </div>
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {progressData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{item.metric}</span>
                  {getTrendIcon(item.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    getProgressColor(item.current, item.target).replace('bg-', 'text-').replace('-500', '-600')
                  } bg-opacity-10`}>
                    {getProgressLabel(item.current, item.target)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.current}% / {item.target}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={item.current} 
                  className={`h-2 ${getProgressColor(item.current, item.target)}`} 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {item.current}%</span>
                  <span className={`flex items-center ${
                    item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : "text-gray-500"
                  }`}>
                    {item.change > 0 ? "+" : ""}{item.change}% from last week
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalPoints}</div>
            <div className="text-xs text-muted-foreground">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{weeklyStats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 