import { useState, useEffect, useCallback } from 'react';

interface ProgressData {
  totalSessions: number;
  completedInterviews: number;
  averageScore: number;
  studyHours: number;
  streakDays: number;
  lastActivity: Date;
  skillProgress: {
    [skill: string]: number;
  };
  weeklyProgress: {
    date: string;
    score: number;
    activity: string;
  }[];
}

interface ActivityLog {
  id: string;
  type: 'interview' | 'study' | 'quiz';
  score?: number;
  duration: number;
  timestamp: Date;
  details: any;
}

export const useProgressTracking = (userName: string) => {
  const [progressData, setProgressData] = useState<ProgressData>({
    totalSessions: 0,
    completedInterviews: 0,
    averageScore: 0,
    studyHours: 0,
    streakDays: 0,
    lastActivity: new Date(),
    skillProgress: {},
    weeklyProgress: []
  });

  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  // Load progress data from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`learnpilot_progress_${userName}`);
    const savedActivity = localStorage.getItem(`learnpilot_activity_${userName}`);
    
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      parsed.lastActivity = new Date(parsed.lastActivity);
      setProgressData(parsed);
    }
    
    if (savedActivity) {
      const parsed = JSON.parse(savedActivity);
      setActivityLog(parsed.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })));
    }
  }, [userName]);

  // Save progress data to localStorage
  const saveProgress = useCallback((data: ProgressData) => {
    localStorage.setItem(`learnpilot_progress_${userName}`, JSON.stringify(data));
    setProgressData(data);
  }, [userName]);

  // Save activity log
  const saveActivity = useCallback((logs: ActivityLog[]) => {
    localStorage.setItem(`learnpilot_activity_${userName}`, JSON.stringify(logs));
    setActivityLog(logs);
  }, [userName]);

  // Log a new activity
  const logActivity = useCallback((
    type: 'interview' | 'study' | 'quiz',
    score?: number,
    duration: number = 0,
    details: any = {}
  ) => {
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type,
      score,
      duration,
      timestamp: new Date(),
      details
    };

    const updatedLogs = [newActivity, ...activityLog].slice(0, 100); // Keep last 100 activities
    saveActivity(updatedLogs);

    // Update progress data
    const newProgressData = { ...progressData };
    
    newProgressData.totalSessions += 1;
    newProgressData.lastActivity = new Date();
    
    if (type === 'interview') {
      newProgressData.completedInterviews += 1;
    }
    
    if (score !== undefined) {
      // Calculate new average score
      const totalScores = updatedLogs
        .filter(log => log.score !== undefined)
        .map(log => log.score!);
      
      newProgressData.averageScore = totalScores.length > 0
        ? Math.round(totalScores.reduce((sum, s) => sum + s, 0) / totalScores.length)
        : 0;
    }
    
    // Update study hours
    newProgressData.studyHours += duration / 60; // Convert minutes to hours
    
    // Calculate streak days
    newProgressData.streakDays = calculateStreakDays(updatedLogs);
    
    // Update skill progress based on activity type
    if (type === 'interview') {
      newProgressData.skillProgress.interviewing = Math.min(100, 
        (newProgressData.skillProgress.interviewing || 0) + 5
      );
    } else if (type === 'study') {
      newProgressData.skillProgress.studying = Math.min(100,
        (newProgressData.skillProgress.studying || 0) + 3
      );
    }
    
    // Update weekly progress
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = newProgressData.weeklyProgress.find(p => p.date === today);
    
    if (existingEntry) {
      existingEntry.score = newProgressData.averageScore;
      existingEntry.activity = type;
    } else {
      newProgressData.weeklyProgress.push({
        date: today,
        score: score || newProgressData.averageScore,
        activity: type
      });
    }
    
    // Keep only last 30 days
    newProgressData.weeklyProgress = newProgressData.weeklyProgress
      .slice(-30)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    saveProgress(newProgressData);
  }, [activityLog, progressData, saveActivity, saveProgress]);

  // Calculate streak days
  const calculateStreakDays = (logs: ActivityLog[]): number => {
    if (logs.length === 0) return 0;
    
    const today = new Date();
    const sortedLogs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.timestamp);
      const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = new Date(logDate);
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  // Get overall performance score
  const getOverallScore = useCallback((): number => {
    if (progressData.averageScore > 0) {
      return progressData.averageScore;
    }
    
    // Calculate based on activity if no scores available
    const baseScore = 60;
    const sessionBonus = Math.min(20, progressData.totalSessions * 2);
    const streakBonus = Math.min(15, progressData.streakDays * 3);
    const hoursBonus = Math.min(5, progressData.studyHours);
    
    return Math.min(100, baseScore + sessionBonus + streakBonus + hoursBonus);
  }, [progressData]);

  // Get learning insights
  const getLearningInsights = useCallback(() => {
    const insights = [];
    
    if (progressData.streakDays >= 7) {
      insights.push(`🔥 Amazing! You've maintained a ${progressData.streakDays}-day learning streak!`);
    } else if (progressData.streakDays >= 3) {
      insights.push(`⭐ Great consistency! ${progressData.streakDays} days in a row!`);
    }
    
    if (progressData.averageScore >= 90) {
      insights.push('🎯 Excellent performance! You\'re mastering the material.');
    } else if (progressData.averageScore >= 80) {
      insights.push('📈 Strong progress! Keep up the great work.');
    } else if (progressData.averageScore >= 70) {
      insights.push('💪 Good effort! Focus on areas for improvement.');
    }
    
    if (progressData.completedInterviews >= 10) {
      insights.push('🎤 Interview expert! You\'ve completed many practice sessions.');
    }
    
    if (progressData.studyHours >= 20) {
      insights.push('📚 Dedicated learner! You\'ve invested significant study time.');
    }
    
    return insights;
  }, [progressData]);

  return {
    progressData,
    activityLog,
    logActivity,
    getOverallScore,
    getLearningInsights
  };
};