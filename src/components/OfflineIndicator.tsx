import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../lib/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-slate-900/95 px-3.5 py-2 text-xs font-semibold text-amber-300 shadow-xl backdrop-blur-md">
      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      <WifiOff className="h-3.5 w-3.5 text-amber-400" />
      <span>Offline Mode — Using local cached habit data</span>
    </div>
  );
};
