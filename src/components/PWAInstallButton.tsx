import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // Hide when already running as an installed standalone PWA
  if (isInstalled) {
    return null;
  }

  // Native Chromium / Android / Desktop install prompt available
  if (isInstallable) {
    return (
      <button
        onClick={install}
        title="Install MindTrack App to your device"
        className="flex items-center gap-1.5 rounded-xl border border-teal-500/40 bg-teal-500/15 px-3 py-1.5 text-xs font-semibold text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.2)] hover:bg-teal-500/25 transition-all active:scale-95 whitespace-nowrap"
      >
        <Download className="h-3.5 w-3.5 text-teal-400" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari or fallback guided install instructions
  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        title="Install MindTrack as an App"
        className="flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 transition-all whitespace-nowrap"
      >
        <Smartphone className="h-3.5 w-3.5 text-teal-400" />
        <span className="hidden sm:inline">{isIOS ? 'Install on iOS' : 'Install App'}</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Install MindTrack PWA
                </h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>Install MindTrack on your iPhone or iPad for full-screen offline access:</p>
                <ol className="list-decimal list-inside space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-slate-200">
                  <li>
                    Tap the <strong>Share</strong> button in your Safari toolbar.
                  </li>
                  <li>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong>Add</strong> in the top-right corner.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  MindTrack is a Progressive Web App (PWA) with offline capability. To install it on your device:
                </p>
                <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-slate-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Chrome / Edge (Desktop):</strong> Click the <strong>Install MindTrack</strong> icon in the right side of your browser address bar.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Android Chrome:</strong> Tap the browser menu (<strong>⋮</strong>) and select <strong>Add to Home screen</strong> or <strong>Install app</strong>.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-teal-500/20 transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
