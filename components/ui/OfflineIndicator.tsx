'use client';

import React from 'react';
import { useOfflineDetection } from '../../lib/utils/errorHandling';

const WifiOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364m12.728 0L5.636 5.636M8.11 8.11a4 4 0 015.78 0M12 12h.01M21 12a9 9 0 00-9-9 9 9 0 00-9 9" />
  </svg>
);

const WifiIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

export function OfflineIndicator() {
  const isOffline = useOfflineDetection();
  const [showReconnected, setShowReconnected] = React.useState(false);
  const [wasOffline, setWasOffline] = React.useState(false);

  React.useEffect(() => {
    if (wasOffline && !isOffline) {
      // Show reconnected message briefly
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setWasOffline(isOffline);
  }, [isOffline, wasOffline]);

  if (!isOffline && !showReconnected) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {isOffline ? (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down">
          <WifiOffIcon className="w-5 h-5" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
      ) : showReconnected ? (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down">
          <WifiIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back online</span>
        </div>
      ) : null}
    </div>
  );
}

export default OfflineIndicator;