
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  current: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<Props> = ({ current, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(current === Language.EN ? Language.ZH : Language.EN)}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium text-slate-700"
    >
      {TRANSLATIONS[current].switchLang}
    </button>
  );
};
