import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/models/User";
import UserProgress from "@/models/UserProgress";

// Helper function to calculate streak
function calculateStreak(dailyActivity: any[]) {
  if (!dailyActivity || dailyActivity.length === 0) return 0;
  
  const sortedActivity = dailyActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const activity of sortedActivity) {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1 && activity.points > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// Helper function to check achievements
function checkAchievements(weeklyStats: any, achievements: any[]) {
  const newAchievements = [];
  const existingAchievementIds = (achievements || []).map(a => a.id);
  
  // First Task Achievement
  if (weeklyStats.totalCompleted >= 1 && !existingAchievementIds.includes('first_task')) {
    newAchievements.push({
      id: 'first_task',
      name: 'First Steps',
      description: 'Completed your first wellness task',
      icon: '🎯',
      category: 'milestone'
    });
  }
  
  // Streak Achievements
  if (weeklyStats.streak >= 3 && !existingAchievementIds.includes('streak_3')) {
    newAchievements.push({
      id: 'streak_3',
      name: 'Consistent',
      description: 'Maintained a 3-day streak',
      icon: '🔥',
      category: 'streak'
    });
  }
  
  if (weeklyStats.streak >= 7 && !existingAchievementIds.includes('streak_7')) {
    newAchievements.push({
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      icon: '🏆',
      category: 'streak'
    });
  }
  
  // Points Achievements
  if (weeklyStats.totalPoints >= 100 && !existingAchievementIds.includes('points_100')) {
    newAchievements.push({
      id: 'points_100',
      name: 'Century Club',
      description: 'Earned 100 points',
      icon: '💯',
      category: 'points'
    });
  }
  
  if (weeklyStats.totalPoints >= 500 && !existingAchievementIds.includes('points_500')) {
    newAchievements.push({
      id: 'points_500',
      name: 'Wellness Master',
      description: 'Earned 500 points',
      icon: '👑',
      category: 'points'
    });
  }
  
  return newAchievements;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const email = req.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    // Find existing progress or create default
    let progress = await UserProgress.findOne({ userEmail: email });
    
    if (!progress) {
      // Create default progress for new user
      progress = await UserProgress.create({
        userEmail: email,
        completedTasks: [],
        weeklyStats: {
          totalPoints: 0,
          streak: 0,
          completedTasks: 0,
          totalTasks: 35,
          weeklyGoal: 300,
          weeklyProgress: 0,
          bestStreak: 0,
          totalCompleted: 0,
        },
        progressData: [
          { metric: "Sleep Quality", current: 75, target: 90, change: +5, trend: "up" },
          { metric: "Energy Level", current: 60, target: 85, change: +12, trend: "up" },
          { metric: "Stress Management", current: 70, target: 80, change: -3, trend: "down" },
          { metric: "Digestion", current: 80, target: 90, change: +8, trend: "up" },
        ],
        achievements: [],
        dailyActivity: [],
        weeklyGoals: {
          currentWeek: 1,
          goals: [],
        },
      });
    }

    // Initialize missing fields for existing users
    if (!progress.dailyActivity) {
      progress.dailyActivity = [];
    }
    if (!progress.achievements) {
      progress.achievements = [];
    }
    if (!progress.weeklyGoals) {
      progress.weeklyGoals = { currentWeek: 1, goals: [] };
    }
    if (!progress.weeklyStats.weeklyProgress) {
      progress.weeklyStats.weeklyProgress = 0;
    }
    if (!progress.weeklyStats.bestStreak) {
      progress.weeklyStats.bestStreak = 0;
    }
    if (!progress.weeklyStats.totalCompleted) {
      progress.weeklyStats.totalCompleted = 0;
    }
    
    // Calculate current streak
    const currentStreak = calculateStreak(progress.dailyActivity);
    
    // Update streak if different
    if (progress.weeklyStats.streak !== currentStreak) {
      progress.weeklyStats.streak = currentStreak;
      if (currentStreak > progress.weeklyStats.bestStreak) {
        progress.weeklyStats.bestStreak = currentStreak;
      }
      await progress.save();
    }

    return NextResponse.json({ 
      success: true, 
      completedTasks: progress.completedTasks,
      weeklyStats: progress.weeklyStats,
      progressData: progress.progressData,
      achievements: progress.achievements,
      dailyActivity: progress.dailyActivity,
      weeklyGoals: progress.weeklyGoals,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, completedTasks, weeklyStats, progressData } = await req.json();
    
    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    // Get current progress
    let progress = await UserProgress.findOne({ userEmail: email });
    
    if (!progress) {
      progress = new UserProgress({
        userEmail: email,
        completedTasks: [],
        weeklyStats: {
          totalPoints: 0,
          streak: 0,
          completedTasks: 0,
          totalTasks: 35,
          weeklyGoal: 300,
          weeklyProgress: 0,
          bestStreak: 0,
          totalCompleted: 0,
        },
        progressData: [
          { metric: "Sleep Quality", current: 75, target: 90, change: +5, trend: "up" },
          { metric: "Energy Level", current: 60, target: 85, change: +12, trend: "up" },
          { metric: "Stress Management", current: 70, target: 80, change: -3, trend: "down" },
          { metric: "Digestion", current: 80, target: 90, change: +8, trend: "up" },
        ],
        achievements: [],
        dailyActivity: [],
        weeklyGoals: {
          currentWeek: 1,
          goals: [],
        },
      });
    }

    // Update progress data
    if (completedTasks !== undefined) progress.completedTasks = completedTasks;
    if (weeklyStats !== undefined) progress.weeklyStats = { ...progress.weeklyStats, ...weeklyStats };
    if (progressData !== undefined) progress.progressData = progressData;

    // Add today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayActivity = {
      date: today,
      completedTasks: completedTasks || [],
      points: weeklyStats?.totalPoints || 0,
      streak: weeklyStats?.streak || 0,
    };

    // Initialize dailyActivity if it doesn't exist
    if (!progress.dailyActivity) {
      progress.dailyActivity = [];
    }
    
    // Initialize achievements if it doesn't exist
    if (!progress.achievements) {
      progress.achievements = [];
    }
    
    // Remove existing today's activity if exists
    progress.dailyActivity = progress.dailyActivity.filter(
      activity => new Date(activity.date).getTime() !== today.getTime()
    );
    
    // Add new today's activity
    progress.dailyActivity.push(todayActivity);

    // Check for new achievements
    const newAchievements = checkAchievements(progress.weeklyStats, progress.achievements);
    if (newAchievements.length > 0) {
      progress.achievements.push(...newAchievements);
    }

    // Update weekly progress
    if (progress.weeklyStats.totalPoints > 0) {
      progress.weeklyStats.weeklyProgress = Math.min(
        (progress.weeklyStats.totalPoints / progress.weeklyStats.weeklyGoal) * 100,
        100
      );
    }

    progress.lastUpdated = new Date();
    progress.lastActivityDate = new Date();

    await progress.save();

    return NextResponse.json({ 
      success: true, 
      message: "Progress saved",
      data: {
        completedTasks: progress.completedTasks,
        weeklyStats: progress.weeklyStats,
        progressData: progress.progressData,
        achievements: progress.achievements,
        newAchievements: newAchievements,
      }
    });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to save progress",
      error: error.message 
    }, { status: 500 });
  }
} 