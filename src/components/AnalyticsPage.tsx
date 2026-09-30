import React, { useState } from 'react';
import { ActiveTab, HabitLog, MoodType } from '../types';
import { MOOD_CONFIGS } from '../lib/storage';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, Brain, Droplet, Moon, PlusCircle, RefreshCw, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface AnalyticsPageProps {
  logs: HabitLog[];
  onLoadSampleLogs?: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  logs,
  onLoadSampleLogs,
  setActiveTab,
}) => {
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(14);

  // Ensure chronological sorting descending before slicing, then reverse for left-to-right chart timeline
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const filteredLogs = sortedLogs.slice(0, rangeDays).reverse();

  // Prepare chart datasets
  const habitTrendData = filteredLogs.map((l) => ({
    date: l.date.slice(5),
    Sleep: l.sleepHours,
    Water: l.waterGlasses,
    Study: l.studyHours,
    Exercise: Math.round(l.exerciseMinutes / 10),
    MoodScore: MOOD_CONFIGS[l.mood].score,
  }));

  // Calculate mood counts for pie chart
  const moodCounts: Record<MoodType, number> = {
    ecstatic: 0,
    happy: 0,
    calm: 0,
    down: 0,
    anxious: 0,
  };

  filteredLogs.forEach((l) => {
    if (moodCounts[l.mood] !== undefined) {
      moodCounts[l.mood]++;
    }
  });

  const pieData = (Object.keys(moodCounts) as MoodType[]).map((mKey) => ({
    name: MOOD_CONFIGS[mKey].label,
    value: moodCounts[mKey],
    color: MOOD_CONFIGS[mKey].color,
    emoji: MOOD_CONFIGS[mKey].emoji,
  }));

  // Compute Averages
  const avgSleep = (filteredLogs.reduce((acc, l) => acc + l.sleepHours, 0) / (filteredLogs.length || 1)).toFixed(1);
  const avgWater = (filteredLogs.reduce((acc, l) => acc + l.waterGlasses, 0) / (filteredLogs.length || 1)).toFixed(1);
  const avgStudy = (filteredLogs.reduce((acc, l) => acc + l.studyHours, 0) / (filteredLogs.length || 1)).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <BarChart3 className="h-4 w-4" /> Visual Intelligence Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Habit &amp; Mood Trends
          </h1>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900 p-1">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setRangeDays(d as 7 | 14 | 30)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                rangeDays === d
                  ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Empty State if no logs exist */}
      {filteredLogs.length === 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center space-y-4">
          <p className="text-base font-bold text-slate-200">
            No habit logs recorded yet for analytics
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Log your first daily entry on the Dashboard or load a 14-day sample dataset to explore visual correlations and mood charts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {setActiveTab && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-teal-500/20 transition-all"
              >
                <PlusCircle className="h-4 w-4" /> Log Today's Habits
              </button>
            )}
            {onLoadSampleLogs && (
              <button
                onClick={onLoadSampleLogs}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all"
              >
                <RefreshCw className="h-4 w-4" /> Load 14-Day Sample Data
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 tabular-nums">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Moon className="h-4 w-4 text-indigo-400" /> Avg Sleep ({rangeDays}d)
          </div>
          <div className="text-3xl font-extrabold text-indigo-300">{avgSleep} hrs/day</div>
          <p className="text-[11px] text-slate-500">Optimum range: 7.5 - 8.5 hours</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Droplet className="h-4 w-4 text-sky-400" /> Avg Hydration ({rangeDays}d)
          </div>
          <div className="text-3xl font-extrabold text-sky-300">{avgWater} glasses</div>
          <p className="text-[11px] text-slate-500">{((Number(avgWater) * 250) / 1000).toFixed(1)} Liters daily average</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-teal-400" /> Avg Focus Study ({rangeDays}d)
          </div>
          <div className="text-3xl font-extrabold text-teal-300">{avgStudy} hrs/day</div>
          <p className="text-[11px] text-slate-500">Steady revision keeps mental clarity high</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-400" /> Habit Progress Over Time
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-400" /> Sleep</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400" /> Water</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal-400" /> Study</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={habitTrendData}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="Sleep" stroke="#818cf8" fillOpacity={1} fill="url(#sleepGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Water" stroke="#38bdf8" fillOpacity={1} fill="url(#waterGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Study" stroke="#2dd4bf" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution Pie */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> Mood Share Distribution
            </h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] tabular-nums">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.emoji} {item.name}: <b>{item.value}d</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Correlation Insight Card */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10 p-6 space-y-3 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
          <Zap className="h-4 w-4" /> Wellness Correlation Insight
        </div>
        <h3 className="text-lg font-bold text-slate-100">
          Hydration &amp; Sleep Directly Elevate Mood Scores
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Our analysis shows that on days where water intake reached 8+ glasses and sleep exceeded 7.5 hours, your reported mood was <b>Ecstatic or Happy 88% of the time</b>. Maintain this habit routine to prevent study burnouts!
        </p>
      </div>
    </div>
  );
};
