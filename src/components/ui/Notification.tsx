'use client';

import { useEffect } from 'react';
import { useCvStore } from '@/store/cv.store';

export function Notification() {
  const { notification, setNotification } = useCvStore();

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  if (!notification) return null;

  const { message, type } = notification;

  const styles = {
    error: {
      container: 'bg-[#180a0a] border-[#ffb4ab] text-white shadow-[0_0_15px_rgba(255,180,171,0.15)]',
      accentText: 'text-[#ffb4ab]',
      nodeBg: 'bg-[#ffb4ab]',
      icon: (
        <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    },
    success: {
      container: 'bg-[#0a180d] border-[#b8ffab] text-white shadow-[0_0_15px_rgba(184,255,171,0.15)]',
      accentText: 'text-[#b8ffab]',
      nodeBg: 'bg-[#b8ffab]',
      icon: (
        <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="16 9 11 14 8 11" />
        </svg>
      )
    },
    info: {
      container: 'bg-[#0a0f1d] border-[#bbc8d9] text-white shadow-[0_0_15px_rgba(187,200,217,0.15)]',
      accentText: 'text-[#bbc8d9]',
      nodeBg: 'bg-[#bbc8d9]',
      icon: (
        <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      role="alert"
      className={[
        'fixed top-6 left-1/2 -translate-x-1/2 z-[9999]',
        'w-[calc(100%-2rem)] max-w-md p-4',
        'border bg-opacity-90 backdrop-blur-md',
        'rounded-none flex items-start gap-3 transition-all duration-300',
        currentStyle.container
      ].join(' ')}
    >
      {/* Top-right geometric node */}
      <span
        aria-hidden="true"
        className={`absolute top-0 right-0 w-1.5 h-1.5 ${currentStyle.nodeBg}`}
        style={{ transform: 'translate(50%, -50%)' }}
      />

      {/* Icon */}
      <span className={currentStyle.accentText}>
        {currentStyle.icon}
      </span>

      {/* Message */}
      <div className="flex-1 text-xs uppercase tracking-widest font-mono font-medium leading-relaxed">
        {message}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => setNotification(null)}
        className="text-gray-400 hover:text-white transition-colors duration-150 p-0.5"
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
