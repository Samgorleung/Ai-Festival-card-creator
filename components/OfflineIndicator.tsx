import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types';

interface OfflineIndicatorProps {
  language?: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language = Language.ZH }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  const isEn = language === Language.EN;

  return (
    <div className="fixed bottom-6 left-6 z-[160] flex items-center gap-2.5 rounded-2xl bg-amber-500/95 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom duration-300 border border-amber-400">
      <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
      <span>
        {isEn
          ? 'Offline Mode — Local gallery & cache are active.'
          : '離線模式中 — 已啟用本地快取與本機圖庫。'}
      </span>
    </div>
  );
};
