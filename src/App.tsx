import React, { useState, useEffect } from 'react';
import { ActiveTab, HabitLog, User } from './types';
import {
  getStoredLogs,
  saveLog,
  deleteLog as deleteStoredLog,
  getStoredUser,
  saveUser,
  clearStoredUser,
  getCursorPreference,
  setCursorPreference,
  clearUserLogs,
  loadSampleLogs,
  calculateUserStreak,
} from './lib/storage';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { DashboardPage } from './components/DashboardPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { HistoryPage } from './components/HistoryPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customCursorEnabled, setCustomCursorEnabled] = useState<boolean>(true);
  const [editingLog, setEditingLog] = useState<HabitLog | null>(null);

  // Initialize storage
  useEffect(() => {
    const loadedLogs = getStoredLogs();
    setLogs(loadedLogs);
    const storedUser = getStoredUser();
    if (storedUser) {
      const streaks = calculateUserStreak(storedUser.id, loadedLogs);
      const updatedUser = {
        ...storedUser,
        currentStreak: streaks.currentStreak,
        longestStreak: Math.max(storedUser.longestStreak, streaks.longestStreak),
      };
      setUser(updatedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setCustomCursorEnabled(getCursorPreference());
  }, []);

  const handleToggleCursor = (enabled: boolean) => {
    setCustomCursorEnabled(enabled);
    setCursorPreference(enabled);
  };

  // Derive current user's scoped logs
  const userLogs = user ? logs.filter((l) => l.userId === user.id) : [];

  const syncLogsAndStreak = (currentUser: User | null) => {
    const updatedLogs = getStoredLogs();
    setLogs(updatedLogs);
    if (currentUser) {
      const streaks = calculateUserStreak(currentUser.id, updatedLogs);
      const updatedUser: User = {
        ...currentUser,
        currentStreak: streaks.currentStreak,
        longestStreak: Math.max(currentUser.longestStreak, streaks.longestStreak),
      };
      setUser(updatedUser);
      saveUser(updatedUser);
    }
  };

  const handleSaveLog = (logData: Omit<HabitLog, 'id' | 'createdAt' | 'userId'> & { id?: string; userId?: string }) => {
    const targetUserId = user?.id || 'usr_guest';
    saveLog({ ...logData, userId: targetUserId });
    syncLogsAndStreak(user);
  };

  const handleDeleteLog = (id: string) => {
    deleteStoredLog(id);
    syncLogsAndStreak(user);
  };

  const handleClearLogs = () => {
    if (user) {
      clearUserLogs(user.id);
      syncLogsAndStreak(user);
    }
  };

  const handleLoadSampleLogs = () => {
    if (user) {
      loadSampleLogs(user.id);
      syncLogsAndStreak(user);
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    const currentLogs = getStoredLogs();
    const streaks = calculateUserStreak(loggedInUser.id, currentLogs);
    const syncedUser: User = {
      ...loggedInUser,
      currentStreak: streaks.currentStreak,
      longestStreak: Math.max(loggedInUser.longestStreak, streaks.longestStreak),
    };
    setUser(syncedUser);
    setIsAuthenticated(true);
    saveUser(syncedUser);
    setActiveTab('dashboard');
  };

  const handleSignupSuccess = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
    saveUser(newUser);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    clearStoredUser();
    setIsAuthenticated(false);
    setUser(null);
    setEditingLog(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Luxury Custom Cursor Follower */}
      <CustomCursor enabled={customCursorEnabled} />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        customCursorEnabled={customCursorEnabled}
        setCustomCursorEnabled={handleToggleCursor}
      />

      {/* Active Content View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            setActiveTab={setActiveTab}
            recentLogs={userLogs}
            onQuickLogSubmit={handleSaveLog}
            isAuthenticated={isAuthenticated}
          />
        )}

        {activeTab === 'dashboard' && (
          isAuthenticated ? (
            <DashboardPage
              logs={userLogs}
              user={user}
              onSaveLog={handleSaveLog}
              onLoadSampleLogs={handleLoadSampleLogs}
              editingLog={editingLog}
              onClearEditingLog={() => setEditingLog(null)}
            />
          ) : (
            <LoginPage
              setActiveTab={setActiveTab}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}

        {activeTab === 'analytics' && (
          isAuthenticated ? (
            <AnalyticsPage
              logs={userLogs}
              onLoadSampleLogs={handleLoadSampleLogs}
              setActiveTab={setActiveTab}
            />
          ) : (
            <LoginPage
              setActiveTab={setActiveTab}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}

        {activeTab === 'history' && (
          isAuthenticated ? (
            <HistoryPage
              logs={userLogs}
              onDeleteLog={handleDeleteLog}
              onEditLog={(logToEdit) => {
                setEditingLog(logToEdit);
                setActiveTab('dashboard');
              }}
              onClearLogs={handleClearLogs}
              onLoadSampleLogs={handleLoadSampleLogs}
              setActiveTab={setActiveTab}
            />
          ) : (
            <LoginPage
              setActiveTab={setActiveTab}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}

        {activeTab === 'login' && (
          <LoginPage
            setActiveTab={setActiveTab}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {activeTab === 'signup' && (
          <SignupPage
            setActiveTab={setActiveTab}
            onSignupSuccess={handleSignupSuccess}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
