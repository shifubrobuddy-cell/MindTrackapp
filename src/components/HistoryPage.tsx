import React, { useState } from 'react';
import { ActiveTab, HabitLog, MoodType } from '../types';
import { MOOD_CONFIGS } from '../lib/storage';
import {
  Calendar,
  Download,
  Edit3,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';

interface HistoryPageProps {
  logs: HabitLog[];
  onDeleteLog: (id: string) => void;
  onEditLog: (log: HabitLog) => void;
  onClearLogs?: () => void;
  onLoadSampleLogs?: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  logs,
  onDeleteLog,
  onEditLog,
  onClearLogs,
  onLoadSampleLogs,
  setActiveTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.date.includes(searchTerm) ||
      log.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMoodFilter === 'all' || log.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindtrack_habit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <Calendar className="h-4 w-4" /> Activity Journal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Habit Log History
          </h1>
          <p className="text-xs text-slate-400 mt-1 tabular-nums">
            Total entries recorded: <span className="font-bold text-teal-300">{logs.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {logs.length > 0 && onClearLogs && !showConfirmClear && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All Data
            </button>
          )}

          {showConfirmClear && onClearLogs && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/60 px-3 py-1.5 text-xs">
              <span className="font-semibold text-rose-200">Clear all logs?</span>
              <button
                onClick={() => {
                  onClearLogs();
                  setShowConfirmClear(false);
                }}
                className="rounded-lg bg-rose-600 px-2.5 py-1 font-bold text-white hover:bg-rose-500"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="rounded-lg bg-slate-800 px-2.5 py-1 font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          )}

          {logs.length === 0 && onLoadSampleLogs && (
            <button
              onClick={onLoadSampleLogs}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Load Sample Demo Data
            </button>
          )}

          {logs.length > 0 && (
            <button
              onClick={exportToJson}
              className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-bold text-teal-300 hover:bg-teal-500/20 transition-all"
            >
              <Download className="h-4 w-4" /> Export JSON
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes or date (YYYY-MM-DD)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {/* Mood Filter */}
        <select
          value={selectedMoodFilter}
          onChange={(e) => setSelectedMoodFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-slate-300 focus:border-teal-500 focus:outline-none"
        >
          <option value="all">All Mood Types</option>
          {(Object.keys(MOOD_CONFIGS) as MoodType[]).map((mKey) => (
            <option key={mKey} value={mKey}>
              {MOOD_CONFIGS[mKey].emoji} {MOOD_CONFIGS[mKey].label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300 tabular-nums">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Sleep</th>
              <th className="px-4 py-3.5">Water</th>
              <th className="px-4 py-3.5">Study</th>
              <th className="px-4 py-3.5">Workout</th>
              <th className="px-4 py-3.5">Mood</th>
              <th className="px-4 py-3.5">Notes</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <p className="text-sm font-semibold text-slate-300">
                      {logs.length === 0 ? 'No habit logs recorded yet. Start fresh!' : 'No logs match your filter.'}
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      {logs.length === 0
                        ? 'Your journal is clean. Log your daily sleep, water, study time, and mood in the Dashboard.'
                        : 'Try searching for a different date or changing your mood filter.'}
                    </p>
                    {logs.length === 0 && setActiveTab && (
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:shadow-teal-500/20 transition-all"
                      >
                        <PlusCircle className="h-4 w-4" /> Log Today's Habits
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-200">{log.date}</td>
                  <td className="px-4 py-3.5 text-indigo-300 font-semibold">{log.sleepHours}h</td>
                  <td className="px-4 py-3.5 text-sky-300 font-semibold">{log.waterGlasses} gls</td>
                  <td className="px-4 py-3.5 text-teal-300 font-semibold">{log.studyHours}h</td>
                  <td className="px-4 py-3.5 text-purple-300 font-semibold">{log.exerciseMinutes}m</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200">
                      <span>{MOOD_CONFIGS[log.mood]?.emoji}</span>
                      <span className="capitalize">{log.mood}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs truncate text-slate-400">{log.notes || '-'}</td>
                  <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onEditLog(log)}
                      title="Edit log"
                      className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-300 transition-all"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      title="Delete log"
                      className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
