import React, { useState, useEffect } from 'react';
import { HabitLog, MoodType, User } from '../types';
import { MOOD_CONFIGS } from '../lib/storage';
import {
  Clock,
  Droplet,
  Flame,
  Moon,
  Plus,
  RefreshCw,
  Smile,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardPageProps {
  logs: HabitLog[];
  user: User | null;
  onSaveLog: (log: Omit<HabitLog, 'id' | 'createdAt' | 'userId'> & { id?: string }) => void;
  onLoadSampleLogs?: () => void;
  editingLog?: HabitLog | null;
  onClearEditingLog?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  logs,
  user,
  onSaveLog,
  onLoadSampleLogs,
  editingLog,
  onClearEditingLog,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((l) => l.date === todayStr);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [targetDate, setTargetDate] = useState<string>(todayStr);
  const [targetId, setTargetId] = useState<string | undefined>(todayLog?.id);
  const [sleepHours, setSleepHours] = useState<number>(todayLog?.sleepHours ?? 8);
  const [waterGlasses, setWaterGlasses] = useState<number>(todayLog?.waterGlasses ?? 8);
  const [studyHours, setStudyHours] = useState<number>(todayLog?.studyHours ?? 4);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(todayLog?.exerciseMinutes ?? 30);
  const [mood, setMood] = useState<MoodType>(todayLog?.mood ?? 'ecstatic');
  const [energyLevel, setEnergyLevel] = useState<number>(todayLog?.energyLevel ?? 8);
  const [notes, setNotes] = useState<string>(todayLog?.notes ?? '');

  // Synchronize modal fields when editingLog is passed from HistoryPage
  useEffect(() => {
    if (editingLog) {
      setTargetDate(editingLog.date);
      setTargetId(editingLog.id);
      setSleepHours(editingLog.sleepHours);
      setWaterGlasses(editingLog.waterGlasses);
      setStudyHours(editingLog.studyHours);
      setExerciseMinutes(editingLog.exerciseMinutes);
      setMood(editingLog.mood);
      setEnergyLevel(editingLog.energyLevel);
      setNotes(editingLog.notes);
      setIsLogModalOpen(true);
    }
  }, [editingLog]);

  const openModalForToday = () => {
    const currentTodayLog = logs.find((l) => l.date === todayStr);
    setTargetDate(todayStr);
    setTargetId(currentTodayLog?.id);
    setSleepHours(currentTodayLog?.sleepHours ?? 8);
    setWaterGlasses(currentTodayLog?.waterGlasses ?? 8);
    setStudyHours(currentTodayLog?.studyHours ?? 4);
    setExerciseMinutes(currentTodayLog?.exerciseMinutes ?? 30);
    setMood(currentTodayLog?.mood ?? 'ecstatic');
    setEnergyLevel(currentTodayLog?.energyLevel ?? 8);
    setNotes(currentTodayLog?.notes ?? '');
    setIsLogModalOpen(true);
  };

  const closeModal = () => {
    setIsLogModalOpen(false);
    if (onClearEditingLog) {
      onClearEditingLog();
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2dd4bf', '#818cf8', '#a855f7', '#f59e0b'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog({
      id: targetId,
      date: targetDate,
      sleepHours,
      waterGlasses,
      studyHours,
      exerciseMinutes,
      mood,
      energyLevel,
      notes,
    });
    closeModal();
    triggerConfetti();
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Welcome back, {user?.username || 'Student'} 👋
            </h1>
            <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-bold text-teal-300 border border-teal-500/20">
              Daily Habit Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 tabular-nums">
            <Flame className="h-5 w-5 text-amber-400 fill-amber-400 animate-bounce" />
            <div>
              <div className="text-[10px] uppercase text-amber-400/80">Active Streak</div>
              <div>{user?.currentStreak || 1} Days Strong</div>
            </div>
          </div>

          {logs.length === 0 && onLoadSampleLogs && (
            <button
              onClick={onLoadSampleLogs}
              className="flex items-center gap-1.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Load 14-Day Sample Data</span>
            </button>
          )}

          <button
            onClick={openModalForToday}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 px-5 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>{todayLog ? "Update Today's Log" : 'Log Today Habits'}</span>
          </button>
        </div>
      </div>

      {/* Today's Habit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 tabular-nums">
        {/* Sleep Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Moon className="h-4 w-4 text-indigo-400" /> Sleep Duration
            </span>
            <span className="font-semibold text-indigo-400">Target: 8.0h</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100">
              {todayLog?.sleepHours ?? 0} <span className="text-sm font-normal text-slate-400">hrs</span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {(((todayLog?.sleepHours ?? 0) / 8) * 100).toFixed(0)}% Goal
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(100, ((todayLog?.sleepHours ?? 0) / 8) * 100)}%` }}
            />
          </div>
        </div>

        {/* Water Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Droplet className="h-4 w-4 text-sky-400" /> Hydration
            </span>
            <span className="font-semibold text-sky-400">Target: 8 Glasses</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100">
              {todayLog?.waterGlasses ?? 0} <span className="text-sm font-normal text-slate-400">glasses</span>
            </span>
            <span className="text-xs font-semibold text-sky-300">
              {(todayLog?.waterGlasses ?? 0) * 250} ml
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(100, ((todayLog?.waterGlasses ?? 0) / 8) * 100)}%` }}
            />
          </div>
        </div>

        {/* Study Hours Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Clock className="h-4 w-4 text-teal-400" /> Focus &amp; Revision
            </span>
            <span className="font-semibold text-teal-400">Target: 4.0h</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100">
              {todayLog?.studyHours ?? 0} <span className="text-sm font-normal text-slate-400">hrs</span>
            </span>
            <span className="text-xs font-semibold text-teal-300">
              {(((todayLog?.studyHours ?? 0) / 4) * 100).toFixed(0)}% Goal
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, ((todayLog?.studyHours ?? 0) / 4) * 100)}%` }}
            />
          </div>
        </div>

        {/* Today Mood Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Smile className="h-4 w-4 text-amber-400" /> Mood &amp; Energy
            </span>
            <span className="font-semibold text-amber-400">
              {todayLog ? `Level ${todayLog.energyLevel}/10` : 'Not Set'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {todayLog ? MOOD_CONFIGS[todayLog.mood].emoji : '😶'}
            </span>
            <div>
              <div className="text-sm font-bold text-slate-100 capitalize">
                {todayLog ? MOOD_CONFIGS[todayLog.mood].label : 'Not Logged Yet'}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {todayLog ? todayLog.notes || 'No custom notes logged today.' : "Click 'Log Today Habits' above to record"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-bold text-slate-100">
                  Log Habits for {targetDate}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Sleep */}
              <div className="space-y-1">
                <label className="flex justify-between font-semibold text-slate-300">
                  <span>Sleep Hours</span>
                  <span className="text-indigo-400 tabular-nums">{sleepHours} hrs</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Water */}
              <div className="space-y-1">
                <label className="flex justify-between font-semibold text-slate-300">
                  <span>Water Glasses</span>
                  <span className="text-sky-400 tabular-nums">{waterGlasses} glasses ({waterGlasses * 250}ml)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={waterGlasses}
                  onChange={(e) => setWaterGlasses(parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Study */}
              <div className="space-y-1">
                <label className="flex justify-between font-semibold text-slate-300">
                  <span>Study / Revision Hours</span>
                  <span className="text-teal-400 tabular-nums">{studyHours} hrs</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="0.5"
                  value={studyHours}
                  onChange={(e) => setStudyHours(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              {/* Exercise */}
              <div className="space-y-1">
                <label className="flex justify-between font-semibold text-slate-300">
                  <span>Exercise / Workout</span>
                  <span className="text-purple-400 tabular-nums">{exerciseMinutes} mins</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={exerciseMinutes}
                  onChange={(e) => setExerciseMinutes(parseInt(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Energy Level */}
              <div className="space-y-1">
                <label className="flex justify-between font-semibold text-slate-300">
                  <span>Energy Level</span>
                  <span className="text-amber-400 tabular-nums">{energyLevel} / 10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Mood */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Select Mood</label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(MOOD_CONFIGS) as MoodType[]).map((mKey) => (
                    <button
                      key={mKey}
                      type="button"
                      onClick={() => setMood(mKey)}
                      className={`flex flex-col items-center justify-center rounded-xl p-2.5 border transition-all ${
                        mood === mKey
                          ? 'border-teal-500 bg-teal-500/20 text-teal-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{MOOD_CONFIGS[mKey].emoji}</span>
                      <span className="text-[10px] font-semibold mt-1 capitalize">{mKey}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Notes / Journal</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What went well today? Any insights..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 px-5 py-2 font-bold text-white shadow-lg hover:shadow-teal-500/20"
                >
                  Save Habit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
