import React, { useState } from 'react';
import { Language, AspectRatio } from '../types';
import { TRANSLATIONS, FESTIVALS } from '../constants';

interface SocialShareBarProps {
  language: Language;
  selectedFestivalId: string | null;
  selectedStyleId: string | null;
  aspectRatio: AspectRatio;
  customGreeting?: string | null;
  onOpenModal: () => void;
  onOpenInstagram?: () => void;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  language,
  selectedFestivalId,
  selectedStyleId,
  aspectRatio,
  customGreeting,
  onOpenModal,
  onOpenInstagram
}) => {
  const [copied, setCopied] = useState(false);
  const t = (TRANSLATIONS[language] as any) || TRANSLATIONS[Language.EN];
  const festival = FESTIVALS.find(f => f.id === selectedFestivalId) || FESTIVALS[0];

  const getDeepLink = (): string => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      if (selectedFestivalId) url.searchParams.set('festival', selectedFestivalId);
      if (selectedStyleId) url.searchParams.set('style', selectedStyleId);
      if (language) url.searchParams.set('lang', language);
      if (aspectRatio) url.searchParams.set('ar', aspectRatio);
      return url.toString();
    } catch {
      return window.location.href;
    }
  };

  const deepLink = getDeepLink();

  const festivalName = language === Language.ZH ? festival.nameZh :
    language === Language.SC ? festival.nameSc :
    language === Language.JA ? festival.nameJa :
    language === Language.KO ? festival.nameKo :
    language === Language.DE ? festival.nameDe :
    festival.nameEn;

  const greetingSnippet = customGreeting || (
    language === Language.ZH ? festival.greetingZh :
    language === Language.SC ? festival.greetingSc :
    language === Language.JA ? festival.greetingJa :
    language === Language.KO ? festival.greetingKo :
    language === Language.DE ? festival.greetingDe :
    festival.greetingEn
  );

  const socialCaption = `🎉 "${greetingSnippet}" - ${festivalName} greeting card made on AI Festive Lens:\n${deepLink}\n#AIFestiveLens #GeminiAI`;

  const handleQuickCopy = async () => {
    try {
      await navigator.clipboard.writeText(deepLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const input = document.createElement('textarea');
      input.value = deepLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSocialClick = async () => {
    try {
      await navigator.clipboard.writeText(socialCaption);
    } catch {
      // Ignore
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎉 "${greetingSnippet}" - Created on AI Festive Lens for ${festivalName}! ✨`)}&url=${encodeURIComponent(deepLink)}`;
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(socialCaption)}`;

  return (
    <div className="bg-gradient-to-r from-red-50 via-white to-indigo-50 border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 text-center md:text-left">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm shrink-0">
          🎁
        </div>
        <div>
          <h4 className="font-black text-slate-900 text-sm md:text-base tracking-tight flex items-center gap-2 justify-center md:justify-start">
            <span>{t.shareModalTitle || 'Share AI Festive Lens'}</span>
            <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
              Deep Link
            </span>
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t.shareModalSubtitle || 'Distribute your festive creations with deep links'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
        {/* Quick Copy Link Button */}
        <button
          onClick={handleQuickCopy}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200'
          }`}
          title="Copy deep link to clipboard"
        >
          <span>{copied ? '✓' : '🔗'}</span>
          <span>{copied ? (t.copied || 'Copied!') : (t.copyLink || 'Copy Link')}</span>
        </button>

        {/* Instagram Quick Share (image-first workflow) */}
        <button
          onClick={onOpenInstagram || onOpenModal}
          className="p-2.5 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1 border-none shadow-xs hover:opacity-90"
          title="Share to Instagram Stories / Feed"
        >
          <span>📸</span>
          <span className="hidden sm:inline">Instagram</span>
        </button>

        {/* WhatsApp Quick Share (native <a> link) */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSocialClick}
          className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 text-xs font-black transition-all cursor-pointer flex items-center gap-1 no-underline"
          title="Share to WhatsApp"
        >
          <span>💬</span>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* X / Twitter Quick Share (native <a> link) */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSocialClick}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-black transition-all cursor-pointer flex items-center gap-1 no-underline"
          title="Share to X"
        >
          <span>𝕏</span>
          <span className="hidden sm:inline">Twitter</span>
        </a>

        {/* Full Share Options Modal Trigger */}
        <button
          onClick={onOpenModal}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-slate-900 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <span>🚀</span>
          <span>{t.shareLink || 'More Options'}</span>
        </button>
      </div>
    </div>
  );
};
