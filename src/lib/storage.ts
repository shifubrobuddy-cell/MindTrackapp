import { HabitLog, User, MoodConfig, MoodType } from '../types';

export const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  ecstatic: {
    id: 'ecstatic',
    label: 'Ecstatic',
    emoji: '🤩',
    color: '#34d399',
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
    score: 5,
  },
  happy: {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    color: '#38bdf8',
    bgGradient: 'from-sky-500/20 to-indigo-500/10',
    score: 4,
  },
  calm: {
    id: 'calm',
    label: 'Calm & Neutral',
    emoji: '😌',
    color: '#a78bfa',
    bgGradient: 'from-purple-500/20 to-slate-500/10',
    score: 3,
  },
  down: {
    id: 'down',
    label: 'Feeling Down',
    emoji: '😔',
    color: '#fbbf24',
    bgGradient: 'from-amber-500/20 to-orange-500/10',
    score: 2,
  },
  anxious: {
    id: 'anxious',
    label: 'Anxious / Stressed',
    emoji: '😤',
    color: '#f87171',
    bgGradient: 'from-rose-500/20 to-red-500/10',
    score: 1,
  },
};

const STORAGE_KEY_LOGS = 'mindtrack_habit_logs_v1';
const STORAGE_KEY_USER = 'mindtrack_current_user_v1';
const STORAGE_KEY_USERS_DIR = 'mindtrack_users_directory_v1';
const STORAGE_KEY_CURSOR = 'mindtrack_custom_cursor_v1';

// Seed realistic sample habit & mood tracking logs for a specific user ID
const generateInitialLogs = (userId: string): HabitLog[] => {
  const logs: HabitLog[] = [];
  const today = new Date();

  const sampleMoods: MoodType[] = [
    'ecstatic',
    'happy',
    'happy',
    'calm',
    'ecstatic',
    'happy',
    'calm',
    'down',
    'happy',
    'ecstatic',
    'happy',
    'calm',
    'ecstatic',
    'happy',
  ];
  const sampleNotes = [
    'Completed project milestone and drank 9 glasses of water!',
    'Great morning study session. Slept 8 hours soundly.',
    'Relaxing evening walk. Energy feeling steady.',
    'Intense revision day. Hydration was consistent.',
    'Super productive! Completed core analytical modules.',
    'A bit tired in afternoon, hit exercise goal.',
    'Balanced day. Practiced coding exercises with team.',
    'Midterm study schedule, rested early with warm tea.',
    'Feeling refreshed after 8.5h sleep!',
    'Achieved 7-day consistency milestone!',
    'Focused session on interactive dashboard layout.',
    'Mindfulness session before sleep helped immensely.',
    'Great workout & 10 glasses of water reached!',
    'Daily habit review and reflection complete!',
  ];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const sleep = Number((7 + (i % 3) * 0.5 + (i % 2 === 0 ? 0.5 : 0)).toFixed(1));
    const water = 7 + (i % 4);
    const study = Number((3 + (i % 5) * 0.8).toFixed(1));
    const exercise = 20 + (i % 3) * 15;
    const mood = sampleMoods[13 - i];
    const energy = Math.min(10, Math.max(4, Math.floor(MOOD_CONFIGS[mood].score * 1.8 + (i % 2))));

    logs.push({
      id: `log_${dateStr}_${userId}`,
      userId: userId,
      date: dateStr,
      sleepHours: sleep,
      waterGlasses: water,
      studyHours: study,
      exerciseMinutes: exercise,
      mood: mood,
      energyLevel: energy,
      notes: sampleNotes[13 - i],
      createdAt: d.toISOString(),
    });
  }

  return logs;
};

export const getStoredLogs = (): HabitLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify([]));
      return [];
    }
    const parsed: HabitLog[] = JSON.parse(data);
    const cleaned = parsed.filter((l) => l.userId !== 'usr_101');
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(cleaned));
    }
    return cleaned.sort((a, b) => b.date.localeCompare(a.date));
  } catch (err) {
    console.error('Failed to read logs from localStorage', err);
    return [];
  }
};

export const clearAllLogs = (): void => {
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify([]));
};

export const clearUserLogs = (userId: string): void => {
  const remaining = getStoredLogs().filter((l) => l.userId !== userId);
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(remaining));
};

export const loadSampleLogs = (userId: string): HabitLog[] => {
  const existingLogs = getStoredLogs().filter((l) => l.userId !== userId);
  const sampleLogs = generateInitialLogs(userId);
  const combined = [...sampleLogs, ...existingLogs].sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(combined));
  return combined;
};

export const saveLog = (
  log: Omit<HabitLog, 'id' | 'createdAt'> & { id?: string; userId?: string }
): HabitLog => {
  const logs = getStoredLogs();
  const targetUserId = log.userId || getStoredUser()?.id || 'usr_guest';
  const now = new Date().toISOString();

  const existingIdx = logs.findIndex(
    (l) => l.userId === targetUserId && (l.date === log.date || (log.id && l.id === log.id))
  );

  let savedLog: HabitLog;

  if (existingIdx >= 0) {
    savedLog = {
      ...logs[existingIdx],
      ...log,
      userId: targetUserId,
      id: logs[existingIdx].id,
    };
    logs[existingIdx] = savedLog;
  } else {
    savedLog = {
      ...log,
      id: log.id || `log_${log.date}_${Date.now()}`,
      userId: targetUserId,
      createdAt: now,
    };
    logs.unshift(savedLog);
  }

  logs.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  return savedLog;
};

export const deleteLog = (id: string): void => {
  const logs = getStoredLogs().filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
};

export const calculateUserStreak = (userId: string, allLogs?: HabitLog[]): { currentStreak: number; longestStreak: number } => {
  const userLogs = (allLogs || getStoredLogs()).filter((l) => l.userId === userId);
  if (userLogs.length === 0) {
    return { currentStreak: 1, longestStreak: 1 };
  }

  const uniqueDates = Array.from(new Set<string>(userLogs.map((l) => l.date))).sort((a, b) =>
    b.localeCompare(a)
  );

  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const curr = new Date(uniqueDates[i] + 'T00:00:00');
    const prev = new Date(uniqueDates[i + 1] + 'T00:00:00');
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      if (i + 1 === tempStreak - 1) currentStreak = tempStreak;
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak: Math.max(1, currentStreak),
    longestStreak: Math.max(currentStreak, longestStreak),
  };
};

export const findOrCreateUserAccount = (identifier: string, emailInput?: string): User => {
  const cleanId = identifier.trim().toLowerCase();
  const username = cleanId.includes('@') ? cleanId.split('@')[0] : identifier.trim();
  const email = emailInput?.trim() || (cleanId.includes('@') ? identifier.trim() : `${username}@mindtrack.app`);
  const deterministicId = 'usr_' + username.toLowerCase().replace(/[^a-z0-9]/g, '_');

  try {
    const rawDir = localStorage.getItem(STORAGE_KEY_USERS_DIR);
    const dir: Record<string, User> = rawDir ? JSON.parse(rawDir) : {};
    const existing = dir[deterministicId];
    const streaks = calculateUserStreak(deterministicId);

    const userObj: User = existing
      ? {
          ...existing,
          currentStreak: streaks.currentStreak,
          longestStreak: Math.max(existing.longestStreak, streaks.longestStreak),
        }
      : {
          id: deterministicId,
          username,
          email,
          joinedDate: new Date().toISOString().split('T')[0],
          currentStreak: streaks.currentStreak,
          longestStreak: streaks.longestStreak,
        };

    dir[deterministicId] = userObj;
    localStorage.setItem(STORAGE_KEY_USERS_DIR, JSON.stringify(dir));
    return userObj;
  } catch {
    return {
      id: deterministicId,
      username,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      currentStreak: 1,
      longestStreak: 1,
    };
  }
};

export const getStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem(STORAGE_KEY_USER);
};

export const getCursorPreference = (): boolean => {
  try {
    const pref = localStorage.getItem(STORAGE_KEY_CURSOR);
    return pref !== null ? JSON.parse(pref) : true;
  } catch {
    return true;
  }
};

export const setCursorPreference = (enabled: boolean): void => {
  localStorage.setItem(STORAGE_KEY_CURSOR, JSON.stringify(enabled));
};
