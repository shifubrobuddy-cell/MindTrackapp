import React from 'react';
import { Activity, Heart, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 pt-12 pb-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-teal-200 via-indigo-200 to-purple-300 bg-clip-text text-xl font-extrabold text-transparent">
                MindTrack
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Personal Habit &amp; Mood Tracker with Visual Analytics. Track your daily sleep, hydration, study routines, and wellness trends seamlessly with full offline PWA support.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Offline-Ready PWA</span>
              <span aria-hidden="true">·</span>
              <span>Visual Analytics</span>
              <span aria-hidden="true">·</span>
              <span>Privacy-First</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Landing Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Habit &amp; Mood Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Visual Analytics &amp; Correlations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Log History &amp; Export
                </button>
              </li>
            </ul>
          </div>

          {/* Features Navigation */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-teal-400">
              Key Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Daily Habit &amp; Water Logging
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Mood &amp; Habit Correlation
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Sleep &amp; Focus Duration Metrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Export JSON &amp; Activity Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-200">
              Academic Credentials
            </h4>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-teal-300">Shifa Sadik Sayyed</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Class: <span className="font-bold text-slate-200">BCA 3rd Year (TY BCA)</span><br />
                Roll No: <span className="font-bold text-amber-300">41</span><br />
                Guide: <span className="font-bold text-indigo-300">Asst. Prof. Affan Khan</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>© 2026 MindTrack. All rights reserved.</p>
            <p className="text-[11px] text-teal-300 font-semibold">
              Designed &amp; Developed by Shifa Sadik Sayyed (Roll No. 41) • Guided by Asst. Prof. Affan Khan.
            </p>
          </div>
          <p className="flex items-center gap-1 text-slate-400">
            BCA Final Year Academic Project <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
