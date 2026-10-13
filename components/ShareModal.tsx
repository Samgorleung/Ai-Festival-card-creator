import React, { useState, useEffect, useRef } from 'react';
import { Language, AspectRatio } from '../types';
import { TRANSLATIONS, FESTIVALS, STYLES } from '../constants';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  selectedFestivalId: string | null;
  selectedStyleId: string | null;
  aspectRatio: AspectRatio;
  customGreeting?: string | null;
  cardId?: string | null;
  cardImage?: string | null;
  initialTab?: 'all' | 'instagram' | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  language,
  selectedFestivalId,
  selectedStyleId,
  aspectRatio,
  customGreeting,
  cardId,
  cardImage,
  initialTab = 'all'
}) => {
  const [copyFeedback, setCopyFeedback] = useState<'link' | 'caption' | string | null>(null);
  const [showInstagramGuide, setShowInstagramGuide] = useState(initialTab === 'instagram');
  const instagramGuideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialTab === 'instagram') {
      setShowInstagramGuide(true);
      setTimeout(() => {
        instagramGuideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const t = (TRANSLATIONS[language] as any) || TRANSLATIONS[Language.EN];
  const festival = FESTIVALS.find(f => f.id === selectedFestivalId) || FESTIVALS[0];
  const style = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];

  // Construct Deep Link URL with query parameters
  const getDeepLink = (): string => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      if (cardId) url.searchParams.set('cardId', cardId);
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

  // Formatted social caption for sharing
  const getSocialCaption = (): string => {
    if (language === Language.ZH) {
      return `🧧 祝您「${greetingSnippet}」！我在 AI 節日賀卡工坊為【${festivalName}】打造了專屬藝術賀卡。用自拍一鍵變身大師級畫作：\n${deepLink}\n#AIFestiveLens #節日賀卡 #GeminiAI`;
    }
    if (language === Language.SC) {
      return `🧧 祝您“${greetingSnippet}”！我在 AI 节日贺卡工坊为【${festivalName}】打造了专属艺术贺卡。用自拍一键变身大师级画作：\n${deepLink}\n#AIFestiveLens #节日贺卡 #GeminiAI`;
    }
    if (language === Language.JA) {
      return `🎉「${greetingSnippet}」AIフェスティバルスタジオで【${festivalName}】の特製カードを作成しました！自撮りから本格アートへ：\n${deepLink}\n#AIFestiveLens #フェスティバル #AIアート`;
    }
    if (language === Language.KO) {
      return `🎉 "${greetingSnippet}"! AI 페스티벌 스튜디오에서 【${festivalName}】 맞춤 카드를 만들었습니다. 셀카로 만드는 예술 작품：\n${deepLink}\n#AIFestiveLens #축제카드 #AI아트`;
    }
    if (language === Language.DE) {
      return `🎉 "${greetingSnippet}"! Erstelle deine persönliche ${festivalName}-Grußkarte im AI Festival Studio:\n${deepLink}\n#AIFestiveLens #GreetingCard #GeminiAI`;
    }
    return `🎉 "${greetingSnippet}"! Created a custom ${festivalName} greeting card on AI Festive Lens. Transform your selfies into festive masterpieces:\n${deepLink}\n#AIFestiveLens #GreetingCards #GeminiAI`;
  };

  const socialCaption = getSocialCaption();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLink);
      setCopyFeedback('link');
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch {
      const input = document.createElement('textarea');
      input.value = deepLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopyFeedback('link');
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(socialCaption);
      setCopyFeedback('caption');
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch {
      const input = document.createElement('textarea');
      input.value = socialCaption;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopyFeedback('caption');
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  const handleSocialClick = async (platformName: string) => {
    // Automatically copy social caption to clipboard so user can paste it anywhere
    try {
      await navigator.clipboard.writeText(socialCaption);
    } catch {
      // Ignore if clipboard write fails
    }
    setCopyFeedback(platformName);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleDownloadCard = () => {
    if (!cardImage) return;
    try {
      const a = document.createElement('a');
      a.download = `${festival.id}-festive-card.png`;
      a.href = cardImage;
      a.click();
    } catch (e) {
      console.warn('Card download failed:', e);
    }
  };

  const handleInstagramShare = async () => {
    // 1. Always reveal the dedicated Instagram Sharing Hub
    setShowInstagramGuide(true);
    setCopyFeedback('Instagram');

    // 2. Automatically copy caption & hashtags to clipboard
    try {
      await navigator.clipboard.writeText(socialCaption);
    } catch {
      // Ignore
    }

    // 3. Automatically download card image so user has it ready
    if (cardImage) {
      handleDownloadCard();
    }

    // 4. Smoothly scroll into view so the user sees the Instagram actions immediately
    setTimeout(() => {
      instagramGuideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);

    setTimeout(() => {
      setCopyFeedback(null);
    }, 4000);
  };

  const handleInstagramSystemShare = async () => {
    if (cardImage && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      try {
        const res = await fetch(cardImage);
        const blob = await res.blob();
        const file = new File([blob], `${festival.id}-festive-card.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `AI Festive Lens - ${festivalName}`,
            text: socialCaption,
            files: [file]
          });
          return;
        }
      } catch (err) {
        console.warn('Device share sheet cancelled:', err);
      }
    }
    handleNativeShare();
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `AI Festive Lens - ${festivalName}`,
          text: socialCaption,
          url: deepLink
        });
      } catch (err) {
        console.warn('Native share cancelled:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Pre-calculated target URLs for genuine <a> links
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(socialCaption)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎉 "${greetingSnippet}" - Created on AI Festive Lens for ${festivalName}! ✨`)}&url=${encodeURIComponent(deepLink)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent(socialCaption)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(deepLink)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent(socialCaption)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`AI Festive Lens: ${festivalName}`)}&body=${encodeURIComponent(socialCaption)}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[130] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              🔗
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                {t.shareModalTitle || 'Share AI Festive Lens'}
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                {t.shareModalSubtitle || 'Distribute your festive creations with deep links'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Selected Festival Context Pill */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-lg">{festival.icon}</span>
            <div className="truncate">
              <span className="font-black text-slate-800">{festivalName}</span>
              <span className="text-slate-400 font-medium ml-1.5 hidden sm:inline">
                • {aspectRatio}
              </span>
            </div>
          </div>
          <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
            Deep Link Active
          </span>
        </div>

        {/* Card Thumbnail Preview (if attached) */}
        {cardImage && (
          <div className="flex items-center gap-3.5 p-3 bg-gradient-to-r from-red-50/50 to-indigo-50/50 border border-slate-200/80 rounded-2xl">
            <img
              src={cardImage}
              alt="Festival Card Preview"
              className="w-14 h-14 object-cover rounded-xl shadow-xs border border-white shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 truncate">{festivalName} Card</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full shrink-0">
                  Card Attached
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                "{greetingSnippet}"
              </p>
            </div>
          </div>
        )}

        {/* Deep Link Input & Copy */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Direct App Deep Link</span>
            {copyFeedback === 'link' && (
              <span className="text-emerald-600 font-bold text-xs animate-in fade-in">
                ✓ {t.copied || 'Copied to Clipboard!'}
              </span>
            )}
          </label>
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <input
              type="text"
              readOnly
              value={deepLink}
              className="flex-1 bg-transparent px-3 text-xs font-bold text-slate-700 outline-none select-all truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer ${
                copyFeedback === 'link'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-slate-900 text-white'
              }`}
            >
              <span>{copyFeedback === 'link' ? '✓' : '📋'}</span>
              <span>{copyFeedback === 'link' ? (t.copied || 'Copied!') : (t.copyLink || 'Copy Link')}</span>
            </button>
          </div>
        </div>

        {/* Shareable Social Post Caption Preview */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Social Media Caption & Tags</span>
            {copyFeedback === 'caption' && (
              <span className="text-emerald-600 font-bold text-xs animate-in fade-in">
                ✓ {t.copied || 'Copied to Clipboard!'}
              </span>
            )}
          </label>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed relative">
            <p className="whitespace-pre-line line-clamp-3">{socialCaption}</p>
            <button
              onClick={handleCopyCaption}
              className={`mt-2.5 w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                copyFeedback === 'caption'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-red-600 text-white'
              }`}
            >
              <span>{copyFeedback === 'caption' ? '✓' : '📝'}</span>
              <span>
                {copyFeedback === 'caption'
                  ? (t.copied || 'Caption Copied!')
                  : (t.copyCaption || 'Copy Caption & Link')}
              </span>
            </button>
          </div>
        </div>

        {/* 1-Click Social Media Distribution Icons (genuine <a> links that bypass iframe popup blocks) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t.socialShare || 'Distribute on Social Media'}
            </p>
            {copyFeedback && !['link', 'caption'].includes(copyFeedback) && (
              <span className="text-emerald-600 font-bold text-[10px] animate-in fade-in">
                ✓ Opening {copyFeedback} & Caption Copied!
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {/* Instagram (Image-first Stories & Post) */}
            <button
              type="button"
              onClick={handleInstagramShare}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90 transition-all shadow-sm cursor-pointer group text-center border-none"
              title="Share to Instagram Stories / Feed (Image + Caption)"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
              <span className="text-[10px] font-black">Instagram</span>
            </button>

            {/* WhatsApp */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialClick('WhatsApp')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all border border-emerald-200/60 cursor-pointer group text-center no-underline"
              title="Share to WhatsApp"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
              <span className="text-[10px] font-black">WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialClick('Twitter')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all border border-slate-200 cursor-pointer group text-center no-underline"
              title="Share to X (Twitter)"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">𝕏</span>
              <span className="text-[10px] font-black">Twitter</span>
            </a>

            {/* LINE */}
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialClick('LINE')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-green-50 hover:bg-green-100 text-green-700 transition-all border border-green-200/60 cursor-pointer group text-center no-underline"
              title="Share to LINE"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🟢</span>
              <span className="text-[10px] font-black">LINE</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialClick('Telegram')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 transition-all border border-sky-200/60 cursor-pointer group text-center no-underline"
              title="Share to Telegram"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">✈️</span>
              <span className="text-[10px] font-black">Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialClick('Facebook')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 transition-all border border-blue-200/60 cursor-pointer group text-center no-underline"
              title="Share to Facebook"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📘</span>
              <span className="text-[10px] font-black">Facebook</span>
            </a>

            {/* Email */}
            <a
              href={emailUrl}
              onClick={() => handleSocialClick('Email')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-all border border-amber-200/60 cursor-pointer group text-center no-underline"
              title="Share via Email"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">✉️</span>
              <span className="text-[10px] font-black">Email</span>
            </a>
          </div>

          {/* Instagram Step-by-Step Guide & Action Hub */}
          {showInstagramGuide && (
            <div
              ref={instagramGuideRef}
              className="bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 border-2 border-pink-300 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-pink-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-lg shadow-sm">
                    📸
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 tracking-tight">
                      {language === Language.ZH ? 'Instagram 發布助理' :
                       language === Language.SC ? 'Instagram 发布助手' :
                       language === Language.JA ? 'Instagram 投稿アシスタント' :
                       'Instagram Story & Post Assistant'}
                    </h4>
                    <p className="text-[10px] font-bold text-pink-700">
                      {language === Language.ZH ? '✓ 賀卡圖片已就緒 · 祝福文案已複製' :
                       language === Language.SC ? '✓ 贺卡图片已就绪 · 祝福文案已复制' :
                       '✓ Card image ready · Caption copied to clipboard'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstagramGuide(false)}
                  className="w-7 h-7 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 3 Step Workflow */}
              <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                {/* Step 1: Image Ready */}
                <div className="flex items-center justify-between p-3 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shrink-0">1</span>
                    <div className="truncate">
                      <span className="font-black text-slate-900">
                        {language === Language.ZH ? '賀卡圖片' : language === Language.SC ? '贺卡图片' : 'Card Image'}
                      </span>
                      <p className="text-[10px] text-slate-500 truncate">
                        {language === Language.ZH ? '已下載至您的裝置 (可手動重新下載)' : language === Language.SC ? '已下载至您的设备 (可手动重新下载)' : 'Downloaded to device'}
                      </p>
                    </div>
                  </div>
                  {cardImage && (
                    <button
                      type="button"
                      onClick={handleDownloadCard}
                      className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-black transition-all cursor-pointer shrink-0"
                    >
                      📥 {language === Language.ZH ? '下載圖片' : 'Download'}
                    </button>
                  )}
                </div>

                {/* Step 2: Caption Copied */}
                <div className="flex items-center justify-between p-3 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shrink-0">2</span>
                    <div className="truncate">
                      <span className="font-black text-slate-900">
                        {language === Language.ZH ? '專屬賀詞與標籤' : language === Language.SC ? '专属贺词与标签' : 'Caption & Hashtags'}
                      </span>
                      <p className="text-[10px] text-slate-500 truncate">
                        {copyFeedback === 'caption' ? '✓ ' + (t.copied || '已複製!') : (language === Language.ZH ? '已複製，在 IG 貼上即可' : 'Ready to paste')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-black transition-all cursor-pointer shrink-0"
                  >
                    📋 {copyFeedback === 'caption' ? (t.copied || '已複製') : (language === Language.ZH ? '複製文案' : 'Copy')}
                  </button>
                </div>

                {/* Step 3: Open Instagram */}
                <div className="pt-1">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-black text-sm shadow-lg shadow-pink-500/25 no-underline transition-all cursor-pointer active:scale-95"
                  >
                    <span>📸</span>
                    <span>
                      {language === Language.ZH ? '前往 Instagram 發布貼文 / 限時動態 ↗' :
                       language === Language.SC ? '前往 Instagram 发布帖子 / 快拍 ↗' :
                       'Open Instagram (Stories & Feed) ↗'}
                    </span>
                  </a>
                </div>
              </div>

              {/* Mobile Device Share Option */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <div className="pt-1 border-t border-pink-200/50">
                  <button
                    type="button"
                    onClick={handleInstagramSystemShare}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-700 font-bold text-xs transition-all border border-pink-200/80 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>📱</span>
                    <span>
                      {language === Language.ZH ? '使用系統分享選單 (手機若有安裝 IG App)' :
                       language === Language.SC ? '使用系统分享菜单 (手机若有安装 IG App)' :
                       'Try Device System Share Sheet (Mobile)'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Native Mobile Share if supported */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-slate-900 hover:to-slate-900 text-white rounded-2xl font-black text-xs tracking-tight transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>📱</span>
              <span>Share via Device System Menu</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
