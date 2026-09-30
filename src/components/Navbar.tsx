import React from 'react';
import { ActiveTab, User } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Activity,
  BarChart3,
  Calendar,
  Flame,
  Home,
  LayoutDashboard,
  LogOut,
  MousePointer,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
  customCursorEnabled: boolean;
  setCustomCursorEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAuthenticated,
  user,
  onLogout,
  customCursorEnabled,
  setCustomCursorEnabled,
}) => {
  const handleProtectedTab = (tab: ActiveTab) => {
    if (!isAuthenticated && (tab === 'dashboard' || tab === 'analytics' || tab === 'history')) {
      setActiveTab('login');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="group flex items-center gap-2.5 text-left transition-transform active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
            <Activity className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-teal-200 via-indigo-200 to-purple-300 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                MindTrack
              </span>
              <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Developed by <span className="text-teal-300 font-semibold">Shifa Sayyed (Roll No. 41)</span> • TY BCA
            </p>
          </div>
        </button>

        {/* Center Nav Pills */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/70 p-1.5 shadow-inner">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </button>

          <button
            onClick={() => handleProtectedTab('dashboard')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => handleProtectedTab('analytics')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </button>

          <button
            onClick={() => handleProtectedTab('history')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Log History
          </button>

          {!isAuthenticated && (
            <>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <UserIcon className="h-3.5 w-3.5" />
                Login
              </button>

              <button
                onClick={() => setActiveTab('signup')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Sign Up
              </button>
            </>
          )}
        </nav>

        {/* Right CTA / User controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* In-App PWA Install Button */}
          <PWAInstallButton />

          {/* Custom Cursor Toggle */}
          <button
            onClick={() => setCustomCursorEnabled(!customCursorEnabled)}
            title={customCursorEnabled ? 'Luxury Cursor Active (Click to disable)' : 'Enable Luxury Cursor'}
            className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              customCursorEnabled
                ? 'border-teal-500/30 bg-teal-500/10 text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MousePointer className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">{customCursorEnabled ? 'Cursor: On' : 'Cursor: Off'}</span>
          </button>

          {/* User Streak Badge */}
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 whitespace-nowrap tabular-nums">
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{user.currentStreak} Day Streak</span>
            </div>
          )}

          {/* Auth Action Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('login')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'login'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 whitespace-nowrap"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-slate-800/60 bg-slate-950/90 px-3 py-2 gap-1.5 scrollbar-none">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
            activeTab === 'home' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
          }`}
        >
          <Home className="h-3.5 w-3.5" /> Home
        </button>
        <button
          onClick={() => handleProtectedTab('dashboard')}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
        </button>
        <button
          onClick={() => handleProtectedTab('analytics')}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" /> Analytics
        </button>
        <button
          onClick={() => handleProtectedTab('history')}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
            activeTab === 'history' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" /> Logs
        </button>
        {!isAuthenticated && (
          <>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                activeTab === 'login' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" /> Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                activeTab === 'signup' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};
