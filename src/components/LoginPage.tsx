import React, { useState } from 'react';
import { ActiveTab, User } from '../types';
import { findOrCreateUserAccount } from '../lib/storage';
import { Activity, AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  setActiveTab,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Username or email is required.';
    } else if (identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      newErrors.identifier = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      setIsLoading(false);

      if (password === 'wrongpass') {
        setErrors({ general: 'Invalid credentials. Please check your username and password.' });
        return;
      }

      const userAccount = findOrCreateUserAccount(identifier);
      onLoginSuccess(userAccount);
    }, 600);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-950">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-[0_0_20px_rgba(45,212,191,0.3)] mx-auto">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome Back to <span className="bg-gradient-to-r from-teal-300 to-indigo-300 bg-clip-text text-transparent">MindTrack</span>
          </h1>
          <p className="text-xs text-slate-400">
            Log in to view your daily habit streaks and mood insights
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {errors.general && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Username/Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Email or Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  placeholder="shifa_2026 or email@example.com"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    errors.identifier
                      ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                      : 'border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30'
                  }`}
                />
              </div>
              {errors.identifier && (
                <p className="text-[11px] font-medium text-rose-400">{errors.identifier}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••••••"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    errors.password
                      ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                      : 'border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-medium text-rose-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-teal-500/30"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg hover:shadow-teal-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => setActiveTab('signup')}
              className="font-bold text-teal-400 hover:underline"
            >
              Create Account Free
            </button>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 font-bold text-teal-400">
            <ShieldCheck className="h-4 w-4" /> Private &amp; Scoped Workspace
          </div>
          <p className="text-[11px] text-slate-400">
            Your habit logs and personal wellness insights are isolated to your account session.
          </p>
        </div>
      </div>
    </div>
  );
};
