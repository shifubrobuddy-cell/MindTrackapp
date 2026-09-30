export type MoodType = 'ecstatic' | 'happy' | 'calm' | 'down' | 'anxious';

export interface MoodConfig {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgGradient: string;
  score: number; // 1 to 5
}

export interface HabitLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  sleepHours: number; // 0 - 24
  waterGlasses: number; // 0 - 20
  studyHours: number; // 0 - 24
  exerciseMinutes: number; // 0 - 300
  mood: MoodType;
  energyLevel: number; // 1 - 10
  notes: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  joinedDate: string;
  currentStreak: number;
  longestStreak: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
}

export type ActiveTab = 'home' | 'dashboard' | 'analytics' | 'history' | 'login' | 'signup';

export interface SystemStats {
  totalLogs: number;
  avgSleepHours: number;
  avgWaterGlasses: number;
  avgStudyHours: number;
  avgExerciseMinutes: number;
  mostFrequentMood: MoodType;
}
