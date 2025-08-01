import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  completedTasks: [Number],
  weeklyStats: {
    totalPoints: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 35 },
    weeklyGoal: { type: Number, default: 300 },
    weeklyProgress: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
  },
  progressData: [{
    metric: String,
    current: Number,
    target: Number,
    change: Number,
    trend: String,
  }],
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: { type: Date, default: Date.now },
    category: String,
  }],
  dailyActivity: [{
    date: { type: Date, required: true },
    completedTasks: [Number],
    points: Number,
    streak: Number,
  }],
  weeklyGoals: {
    currentWeek: { type: Number, default: 0 },
    goals: [{
      week: Number,
      targetPoints: Number,
      achievedPoints: Number,
      completed: Boolean,
    }],
  },
  lastUpdated: { type: Date, default: Date.now },
  lastActivityDate: { type: Date, default: Date.now },
});

const UserProgress = mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema);
export default UserProgress; 