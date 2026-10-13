import React, { useState } from 'react';
import { GalleryItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { downloadCardImage } from '../services/gallery';

interface GallerySectionProps {
  items: GalleryItem[];
  onRevisit: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  language: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  onRevisit,
  onDelete,
  onClear,
  language
}) => {
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<GalleryItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const t = (TRANSLATIONS[language] as any) || TRANSLATIONS[Language.EN];

  const handleDownload = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    setDownloadingId(item.id);
    const cleanName = (item.festivalName || 'Festival').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
    const filename = `Festival_Card_${cleanName}_${new Date(item.timestamp).toISOString().slice(0, 10)}.jpg`;
    downloadCardImage(item.composedImage || item.rawImage || '', filename);
    setTimeout(() => setDownloadingId(null), 1500);
  };

  const formatTimestamp = (ts: number): string => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return language === Language.ZH ? '剛才' : language === Language.SC ? '刚刚' : 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const handleShare = async (item: GalleryItem) => {
    try {
      const res = await fetch(item.composedImage);
      const blob = await res.blob();
      const file = new File([blob], `Festival_Card_${item.id}.jpg`, { type: 'image/jpeg' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: item.festivalName,
          text: item.greeting,
          files: [file]
        });
      } else {
        handleDownload({ stopPropagation: () => {} } as any, item);
      }
    } catch {
      handleDownload({ stopPropagation: () => {} } as any, item);
    }
  };

  return (
    <section id="masterpiece-gallery" className="space-y-6 pt-4">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🖼️</span>
            <h2 className="text-slate-900 font-black text-xl md:text-2xl tracking-tight">
              {t.galleryTitle || 'Masterpiece Gallery'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 shadow-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{items.length} Cloud Cards</span>
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1">
            {t.gallerySubtitle || 'Saved in Firebase Cloud Database (Syncs across devices & refreshes)'}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
              title="Clear stored cards"
            >
              <span>🗑️</span>
              <span>{t.clearGallery || 'Clear Gallery'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-4 text-center border border-slate-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {t.clearGallery || 'Clear Gallery'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t.clearGalleryConfirm || 'Clear all 5 saved cards from your browser storage?'}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClear();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-slate-900 transition-all shadow-md cursor-pointer"
              >
                {t.deleteCard || 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="p-10 md:p-14 bg-gradient-to-b from-white to-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
            🎨
          </div>
          <h3 className="font-black text-base md:text-lg text-slate-800">
            {t.galleryEmpty || 'No saved cards yet. Generate your first masterpiece above!'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Whenever you create a new festival card with live selfies, AI art styles, and custom greetings, it will be automatically saved here for quick revisits and re-downloads.
          </p>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-red-300 transition-all overflow-hidden flex flex-col"
            >
              {/* Order Badge */}
              <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <span>#{idx + 1}</span>
                <span className="opacity-60">•</span>
                <span>{item.aspectRatio}</span>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/80 backdrop-blur-md hover:bg-red-600 hover:text-white text-slate-500 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer"
                title={t.deleteCard || 'Delete'}
              >
                ✕
              </button>

              {/* Card Image Thumbnail */}
              <div
                onClick={() => setSelectedPreviewItem(item)}
                className="relative bg-slate-100 aspect-[3/4] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.composedImage || item.rawImage}
                  alt={item.festivalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Hover Quick Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end gap-2">
                  <div className="text-white text-center pb-1">
                    <p className="text-[11px] font-black leading-tight line-clamp-2 drop-shadow-md">
                      "{item.greeting}"
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRevisit(item);
                      }}
                      className="flex-1 py-2 bg-red-600 hover:bg-white hover:text-slate-900 text-white rounded-xl text-[10px] font-black tracking-tight transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                      title="Open in editor"
                    >
                      <span>🔄</span>
                      <span>{t.revisit || 'Revisit'}</span>
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, item)}
                      className="flex-1 py-2 bg-white/90 hover:bg-white text-slate-900 rounded-xl text-[10px] font-black tracking-tight transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                      title="Download image"
                    >
                      <span>{downloadingId === item.id ? '✓' : '📥'}</span>
                      <span>{downloadingId === item.id ? (t.downloadSuccess || 'Saved!') : (t.redownload || 'Save')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="p-3.5 space-y-1.5 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-slate-800">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{item.festivalIcon || '🎉'}</span>
                      <span className="truncate">{item.festivalName}</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate italic mt-0.5">
                    "{item.greeting}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-bold border-t border-slate-50">
                  <span className="uppercase tracking-wider">
                    {item.styleName ? `Style: ${item.styleName}` : `Text: ${item.textStyle}`}
                  </span>
                  <button
                    onClick={() => setSelectedPreviewItem(item)}
                    className="text-red-600 hover:text-red-700 font-black cursor-pointer flex items-center gap-0.5"
                  >
                    <span>🔍</span>
                    <span>{t.previewCard || 'Preview'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {selectedPreviewItem && (
        <div
          onClick={() => setSelectedPreviewItem(null)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[2.5rem] max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPreviewItem.festivalIcon || '🎉'}</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none">
                    {selectedPreviewItem.festivalName}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    Created {new Date(selectedPreviewItem.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPreviewItem(null)}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* High-Res Image View */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl mx-auto w-full flex items-center justify-center max-h-[55vh]">
              <img
                src={selectedPreviewItem.composedImage || selectedPreviewItem.rawImage}
                alt={selectedPreviewItem.festivalName}
                className="max-h-[55vh] w-auto max-w-full object-contain block mx-auto rounded-2xl"
              />
            </div>

            {/* Greeting Display */}
            <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Greeting Message
              </span>
              <p className="text-base font-black text-slate-800 break-words">
                "{selectedPreviewItem.greeting}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={(e) => {
                  handleDownload(e, selectedPreviewItem);
                }}
                className="flex-1 py-4 bg-red-600 hover:bg-slate-900 text-white rounded-2xl font-black text-sm tracking-tight transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>📥</span>
                <span>{downloadingId === selectedPreviewItem.id ? (t.downloadSuccess || 'Downloaded!') : (t.redownload || 'Re-download')}</span>
              </button>

              <button
                onClick={() => {
                  onRevisit(selectedPreviewItem);
                  setSelectedPreviewItem(null);
                }}
                className="flex-1 py-4 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-black text-sm tracking-tight transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>🔄</span>
                <span>{t.revisit || 'Revisit & Edit in Studio'}</span>
              </button>

              <button
                onClick={() => handleShare(selectedPreviewItem)}
                className="py-4 px-5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                title="Share"
              >
                <span>📤</span>
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
