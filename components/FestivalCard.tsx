
import React from 'react';
// Fix: Import FestivalStyle instead of non-existent Festival type
import { FestivalStyle, Language } from '../types';

interface Props {
  // Fix: Align prop type with FestivalStyle interface
  festival: FestivalStyle;
  selected: boolean;
  onSelect: (id: string) => void;
  lang: Language;
}

export const FestivalCard: React.FC<Props> = ({ festival, selected, onSelect, lang }) => {
  return (
    <button
      onClick={() => onSelect(festival.id)}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all border-2 ${
        selected 
          ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105' 
          : 'border-transparent bg-white shadow-sm hover:shadow-md'
      }`}
    >
      {/* Fix: Updated to use thumbnailIcon and removed color property which doesn't exist in FestivalStyle */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl mb-2 bg-indigo-500 text-white`}>
        {festival.thumbnailIcon}
      </div>
      <span className={`text-sm font-semibold ${selected ? 'text-indigo-700' : 'text-slate-700'}`}>
        {lang === Language.EN ? festival.nameEn : festival.nameZh}
      </span>
      {selected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-white">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
