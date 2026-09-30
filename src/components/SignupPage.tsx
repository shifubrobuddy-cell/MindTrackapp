import React, { useState } from 'react';
import { ActiveTab, User } from '../types';
import { findOrCreateUserAccount } from '../lib/storage';
import { Activity, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';

interface SignupPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSignupSuccess: (user: User) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  setActiveTab,
  onSignupSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-800' };
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-teal-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (username.length < 3 || username.length > 20) {
      newErrors.username = 'Username must be 3 to 20 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms & conditions.';
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
      const newUser = findOrCreateUserAccount(username.trim(), email.trim());
      onSignupSuccess(newUser);
    }, 600);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-teal-500/15 blur-[120px]" />

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-[0_0_20px_rgba(45,212,191,0.3)] mx-auto">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Create Your <span className="bg-gradient-to-r from-teal-300 to-indigo-300 bg-clip-text text-transparent">MindTrack</span> Account
          </h1>
          <p className="text-xs text-slate-400">
            Start tracking your daily habits, sleep, water, and mood analytics today
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="shifa_2026"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    errors.username ? 'border-rose-500/60' : 'border-slate-800 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.username && <p className="text-[11px] text-rose-400 font-medium">{errors.username}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shifa@college.edu"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-500/60' : 'border-slate-800 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-400 font-medium">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    errors.password ? 'border-rose-500/60' : 'border-slate-800 focus:border-teal-500'
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
              {/* Password Strength Meter */}
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>Password Strength:</span>
                    <span className="capitalize">{strength.label}</span>
                  </div>
                  <div className="flex h-1.5 gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-colors ${
                          step <= strength.score ? strength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-rose-400 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-rose-500/60' : 'border-slate-800 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-400 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-teal-500/30"
                />
                <span>
                  I accept the <span className="text-slate-200 underline">Terms of Service</span> &amp; <span className="text-slate-200 underline">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && <p className="text-[11px] text-rose-400 font-medium">{errors.terms}</p>}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setActiveTab('login')}
              className="font-bold text-teal-400 hover:underline"
            >
              Log In Instead
            </button>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 font-bold text-teal-400">
            <ShieldCheck className="h-4 w-4" /> Account Protection
          </div>
          <p className="text-[11px] text-slate-400">
            All user registration data is validated and scoped to your personal wellness profile.
          </p>
        </div>
      </div>
    </div>
  );
};
