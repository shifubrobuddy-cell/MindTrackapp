import React, { useState } from 'react';
import { ActiveTab, HabitLog, MoodType } from '../types';
import { MOOD_CONFIGS } from '../lib/storage';
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  Code,
  Droplet,
  Flame,
  Moon,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  recentLogs: HabitLog[];
  onQuickLogSubmit: (log: Omit<HabitLog, 'id' | 'createdAt' | 'userId'>) => void;
  isAuthenticated: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  recentLogs,
  onQuickLogSubmit,
  isAuthenticated,
}) => {
  const [quickSleep, setQuickSleep] = useState<number>(8);
  const [quickWater, setQuickWater] = useState<number>(8);
  const [quickStudy, setQuickStudy] = useState<number>(4);
  const [quickExercise, setQuickExercise] = useState<number>(30);
  const [quickMood, setQuickMood] = useState<MoodType>('ecstatic');
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);

  const handleActionClick = (targetTab: ActiveTab) => {
    if (!isAuthenticated && (targetTab === 'dashboard' || targetTab === 'analytics')) {
      setActiveTab('login');
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setActiveTab('login');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    onQuickLogSubmit({
      date: today,
      sleepHours: quickSleep,
      waterGlasses: quickWater,
      studyHours: quickStudy,
      exerciseMinutes: quickExercise,
      mood: quickMood,
      energyLevel: MOOD_CONFIGS[quickMood].score * 2,
      notes: 'Quick logged from MindTrack Landing Page!',
    });

    setLogSuccessMessage('Habit & Mood logged successfully! Redirecting to Dashboard...');
    setTimeout(() => {
      setLogSuccessMessage(null);
      setActiveTab('dashboard');
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Luxury Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-teal-500/15 via-indigo-600/20 to-purple-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-[600px] right-0 -z-10 h-[400px] w-[500px] rounded-full bg-teal-500/10 blur-[100px]" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-semibold text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.15)]">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>MindTrack • Shifa Sadik Sayyed (Roll No. 41)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
              Transform Your Daily Habits into{' '}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-indigo-300 bg-clip-text text-transparent">
                Visual Intelligence
              </span>
            </h1>

            <p className="max-w-2xl text-xs sm:text-base text-slate-300 leading-relaxed mx-auto lg:mx-0">
              Track sleep, hydration, study routines, and mood shifts. Developed by <strong>Shifa Sadik Sayyed (BCA 3rd Year, Roll No. 41)</strong> under the guidance of <strong>Asst. Prof. Affan Khan</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => handleActionClick('dashboard')}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-all active:scale-95"
              >
                <span>Launch Interactive Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => handleActionClick('analytics')}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all"
              >
                <BarChart2 className="h-4 w-4 text-teal-400" />
                View Analytics
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Responsive Design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>BCA Mini Project Grade A+</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>Streak Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-semibold text-slate-400">
                    Sample Dashboard Preview
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                  🔥 7-Day Active
                </span>
              </div>

              {/* Sample Habit Progress Stats */}
              <div className="mt-5 space-y-4">
                {/* Sleep Stat */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Moon className="h-3.5 w-3.5 text-indigo-400" /> Sleep Duration
                    </span>
                    <span className="font-bold text-indigo-300">8.0 hrs / 8.0 goal</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[100%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  </div>
                </div>

                {/* Water Stat */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Droplet className="h-3.5 w-3.5 text-sky-400" /> Water Intake
                    </span>
                    <span className="font-bold text-sky-300">8 Glasses (2.0L)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-sky-400 to-teal-400" />
                  </div>
                </div>

                {/* Mood Badge */}
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 mt-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🤩</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        Today's Mood: Ecstatic
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Energy Level: 9/10 • Peak Mental Focus
                      </div>
                    </div>
                  </div>
                  <span className="rounded-lg bg-teal-500/20 px-2 py-1 text-[10px] font-bold text-teal-300">
                    +35% vs Avg
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Interactive Tracker Widget */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <Zap className="h-4 w-4" /> Quick Interactive Log Demo
              </div>
              <h2 className="text-2xl font-bold text-slate-100">
                Log Today's Habits Right Now
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Changes sync instantly to your local storage session
            </span>
          </div>

          {logSuccessMessage && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{logSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleQuickLog} className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Sleep Slider */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Moon className="h-4 w-4 text-indigo-400" /> Sleep Hours
                </span>
                <span className="text-indigo-400 font-bold">{quickSleep} hrs</span>
              </label>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={quickSleep}
                onChange={(e) => setQuickSleep(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Water Counter */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Droplet className="h-4 w-4 text-sky-400" /> Water Glasses
                </span>
                <span className="text-sky-400 font-bold">{quickWater} glasses</span>
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setQuickWater(Math.max(0, quickWater - 1))}
                  className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 font-bold text-slate-300 hover:bg-slate-800"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-sky-300">
                  {quickWater * 250} ml
                </div>
                <button
                  type="button"
                  onClick={() => setQuickWater(quickWater + 1)}
                  className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 font-bold text-slate-300 hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Smile className="h-4 w-4 text-amber-400" /> Select Mood
                </span>
                <span className="text-amber-400 font-bold capitalize">{quickMood}</span>
              </label>
              <div className="flex justify-between items-center pt-1">
                {(Object.keys(MOOD_CONFIGS) as MoodType[]).map((mKey) => (
                  <button
                    key={mKey}
                    type="button"
                    onClick={() => setQuickMood(mKey)}
                    className={`text-xl p-1.5 rounded-lg transition-transform hover:scale-125 ${
                      quickMood === mKey
                        ? 'bg-amber-500/20 border border-amber-500/40 scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {MOOD_CONFIGS[mKey].emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 py-4 text-xs font-bold text-white shadow-lg hover:shadow-teal-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Activity className="h-4 w-4" /> Save Quick Log
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-slate-100 sm:text-4xl">
            Everything Needed for Habit & Wellness Excellence
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Combining modern frontend visual analytics with responsive, stateful tracking architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 hover:border-teal-500/40 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Daily Habit Logging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log sleep, hydration, study hours, and exercise minutes. Built with client-side validation and instant UI updates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Visual Insights & Charts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze weekly trends, mood vs hydration correlation, and streak counts using interactive Chart visuals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 hover:border-purple-500/40 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">High Performance Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast, zero-latency reactive interface with local persistence, real-time analytics calculations, and JSON export.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
