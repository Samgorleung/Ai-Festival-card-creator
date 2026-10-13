import React, { useState, useRef, useEffect } from 'react';
import { Language, AppState, AspectRatio, TextStyle, ImageResolution, GalleryItem } from './types';
import { STYLES, FESTIVALS, TRANSLATIONS, FESTIVAL_CATEGORIES } from './constants';
import { generateFestivalCard } from './services/gemini';
import { CameraModal } from './components/CameraModal';
import { UserGuideModal } from './components/UserGuideModal';
import { GallerySection } from './components/GallerySection';
import { ShareModal } from './components/ShareModal';
import { SocialShareBar } from './components/SocialShareBar';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  fetchCardsFromFirestore,
  subscribeCardsFromFirestore,
  saveCardToFirestore,
  deleteCardFromFirestore,
  getCardByIdFromFirestore,
  compressCanvasForGallery
} from './services/firebaseGallery';
import { validateFirestoreConnection } from './services/firebase';
import { loadGallery, clearGallery as clearLocalGallery } from './services/gallery';

const getInitialStateFromParams = (): {
  festivalId: string;
  styleId: string;
  language: Language;
  aspectRatio: AspectRatio;
} => {
  const defaults = {
    festivalId: FESTIVALS[0].id,
    styleId: STYLES[0].id,
    language: Language.ZH,
    aspectRatio: '3:4' as AspectRatio
  };
  if (typeof window === 'undefined') return defaults;
  try {
    const params = new URLSearchParams(window.location.search);
    const fest = params.get('festival');
    const style = params.get('style');
    const lang = params.get('lang');
    const ar = params.get('ar');

    return {
      festivalId: (fest && FESTIVALS.some(f => f.id === fest)) ? fest : defaults.festivalId,
      styleId: (style && STYLES.some(s => s.id === style)) ? style : defaults.styleId,
      language: (lang && Object.values(Language).includes(lang as Language)) ? (lang as Language) : defaults.language,
      aspectRatio: (ar && ['1:1', '3:4', '4:3', '9:16', '16:9'].includes(ar)) ? (ar as AspectRatio) : defaults.aspectRatio
    };
  } catch {
    return defaults;
  }
};

const App: React.FC = () => {
  const initialParams = getInitialStateFromParams();
  const [state, setState] = useState<AppState>({
    image: null,
    customGreeting: null,
    textStyle: 'light',
    customBackgroundPrompt: null,
    customBackgroundImage: null,
    selectedFestivalId: initialParams.festivalId,
    selectedStyleId: initialParams.styleId,
    aspectRatio: initialParams.aspectRatio,
    resolution: '2K',
    language: initialParams.language,
    isGenerating: false,
    resultImage: null,
    error: null,
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => loadGallery());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareInitialTab, setShareInitialTab] = useState<'all' | 'instagram'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedFestivalCategory, setSelectedFestivalCategory] = useState<'all' | 'eastern' | 'western' | 'lifestyle'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selfieCameraInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const festivalScrollRef = useRef<HTMLDivElement>(null);
  const currentT = TRANSLATIONS[state.language] as any;

  // Validate Firestore connection and subscribe to live cloud cards on startup
  useEffect(() => {
    validateFirestoreConnection().then(connected => {
      if (connected) {
        console.log('Firebase Firestore connection verified.');
      }
    });

    // Check if URL has a cardId parameter to load directly from Firestore
    try {
      const params = new URLSearchParams(window.location.search);
      const sharedCardId = params.get('cardId');
      if (sharedCardId) {
        getCardByIdFromFirestore(sharedCardId).then(sharedCard => {
          if (sharedCard) {
            setState(prev => ({
              ...prev,
              resultImage: sharedCard.rawImage || sharedCard.composedImage,
              customGreeting: sharedCard.greeting,
              textStyle: sharedCard.textStyle,
              aspectRatio: sharedCard.aspectRatio,
              selectedFestivalId: sharedCard.festivalId,
              selectedStyleId: sharedCard.styleId || prev.selectedStyleId
            }));
            setActiveCardId(sharedCard.id);
            setToastMessage('Loaded shared festival card from cloud!');
            setTimeout(() => setToastMessage(null), 3500);
          }
        }).catch(err => {
          console.warn('Could not load shared card from cloud:', err);
        });
      }
    } catch {
      // Ignore URL parsing errors
    }

    // Subscribe to cards from Firestore
    const unsubscribe = subscribeCardsFromFirestore(
      (cards) => {
        if (cards && cards.length > 0) {
          setGalleryItems(cards);
        } else {
          // If Firestore is empty initially, fall back to local items
          const local = loadGallery();
          if (local.length > 0) {
            setGalleryItems(local);
            // Optionally backfill local cards to Firestore
            local.forEach(c => saveCardToFirestore(c).catch(() => {}));
          }
        }
      },
      (error) => {
        console.warn('Live subscription error, relying on local backup:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const scrollFestivals = (direction: 'left' | 'right') => {
    if (festivalScrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      festivalScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId: 'all' | 'eastern' | 'western' | 'lifestyle') => {
    setSelectedFestivalCategory(catId);
    if (festivalScrollRef.current) {
      festivalScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleOpenSelfie = () => {
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      setIsCameraOpen(true);
    } else {
      selfieCameraInputRef.current?.click();
    }
  };

  const handleCameraCapture = (base64Image: string) => {
    setState(prev => ({ ...prev, image: base64Image, resultImage: null }));
  };

  const selectedFestival = FESTIVALS.find(f => f.id === state.selectedFestivalId) || FESTIVALS[0];
  const filteredFestivals = selectedFestivalCategory === 'all'
    ? FESTIVALS
    : FESTIVALS.filter(f => (FESTIVAL_CATEGORIES[f.id] || f.category) === selectedFestivalCategory);

  useEffect(() => {
    const festival = FESTIVALS.find(f => f.id === state.selectedFestivalId);
    if (festival) {
      let greeting = festival.greetingEn;
      if (state.language === Language.ZH) greeting = festival.greetingZh;
      else if (state.language === Language.SC) greeting = festival.greetingSc;
      else if (state.language === Language.JA) greeting = festival.greetingJa;
      else if (state.language === Language.KO) greeting = festival.greetingKo;
      else if (state.language === Language.DE) greeting = festival.greetingDe;
      
      setState(prev => ({ 
        ...prev, 
        customGreeting: greeting 
      }));
    }
  }, [state.selectedFestivalId, state.language]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string, resultImage: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createComposedCard = async (
    imageUrl: string,
    greeting: string | null,
    textStyle: TextStyle
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageUrl;
    await new Promise(r => img.onload = r);

    canvas.width = img.naturalWidth || 1080;
    canvas.height = img.naturalHeight || 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageUrl;

    ctx.drawImage(img, 0, 0);

    const fontSize = canvas.width * 0.08;
    ctx.font = `bold ${fontSize}px "Noto Sans TC", "Noto Sans JP", "Inter", sans-serif`;
    ctx.textAlign = 'center';

    if (textStyle === 'light') ctx.fillStyle = '#FFFFFF';
    else if (textStyle === 'dark') ctx.fillStyle = '#1e293b';
    else if (textStyle === 'gold') ctx.fillStyle = '#FFD700';
    else ctx.fillStyle = '#00FFFF';

    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = canvas.width * 0.02;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const lines = greeting?.split('\n') || [];
    const totalTextHeight = lines.length * fontSize * 1.2;
    const startY = (canvas.height * 0.88) - (totalTextHeight / 2);

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + (i * fontSize * 1.2));
    });

    return compressCanvasForGallery(canvas, 1000, 0.82);
  };

  const handleGenerate = async () => {
    if (!state.image) return;
    const festival = selectedFestival;
    const style = STYLES.find(s => s.id === state.selectedStyleId);
    if (!festival || !style) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const result = await generateFestivalCard(
        state.image,
        festival.basePrompt,
        style.prompt,
        state.aspectRatio,
        state.customBackgroundPrompt,
        state.customBackgroundImage,
        state.resolution
      );
      setState(prev => ({ ...prev, resultImage: result, isGenerating: false }));

      // Automatically compose and store generated card in Firebase Firestore
      const cardUniqueId = `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setActiveCardId(cardUniqueId);

      try {
        const greetingText = state.customGreeting || '';
        const composedUrl = await createComposedCard(result, greetingText, state.textStyle);
        const festName = state.language === Language.EN ? festival.nameEn :
          state.language === Language.ZH ? festival.nameZh :
          state.language === Language.SC ? festival.nameSc :
          state.language === Language.JA ? festival.nameJa :
          state.language === Language.KO ? festival.nameKo :
          festival.nameDe;
        const sName = state.language === Language.EN ? style.nameEn :
          state.language === Language.ZH ? style.nameZh :
          state.language === Language.SC ? style.nameSc :
          state.language === Language.JA ? style.nameJa :
          state.language === Language.KO ? style.nameKo :
          style.nameDe;

        const newGalleryCard: GalleryItem = {
          id: cardUniqueId,
          timestamp: Date.now(),
          composedImage: composedUrl,
          rawImage: result,
          festivalId: festival.id,
          festivalName: festName,
          festivalIcon: festival.icon,
          styleId: style.id,
          styleName: sName,
          greeting: greetingText,
          textStyle: state.textStyle,
          aspectRatio: state.aspectRatio,
          resolution: state.resolution,
          isPublic: true
        };

        // Save persistently to Firebase Firestore (and local storage backup)
        await saveCardToFirestore(newGalleryCard);
        setToastMessage('Saved to Firebase Cloud Gallery!');
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        console.warn('Failed to auto-save card to Firebase:', err);
      }
    } catch (err) {
      setState(prev => ({ ...prev, isGenerating: false, error: currentT.error }));
    }
  };

  const handleRevisitCard = (item: GalleryItem) => {
    setActiveCardId(item.id);
    setState(prev => ({
      ...prev,
      resultImage: item.rawImage || item.composedImage,
      customGreeting: item.greeting,
      textStyle: item.textStyle,
      aspectRatio: item.aspectRatio,
      selectedFestivalId: item.festivalId,
      selectedStyleId: item.styleId || prev.selectedStyleId,
      error: null
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      await deleteCardFromFirestore(id);
      setGalleryItems(prev => prev.filter(item => item.id !== id));
      setToastMessage('Card removed from cloud gallery');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.warn('Failed to delete card from Firestore:', err);
    }
  };

  const handleClearGallery = async () => {
    clearLocalGallery();
    // Delete cards one by one from Firestore
    try {
      await Promise.all(galleryItems.map(item => deleteCardFromFirestore(item.id).catch(() => {})));
    } catch {
      // Ignore
    }
    setGalleryItems([]);
    setToastMessage('Gallery cleared');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const generateCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!state.resultImage || !cardRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = state.resultImage;
    
    await new Promise(r => img.onload = r);
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0);

    const fontSize = canvas.width * 0.08;
    ctx.font = `bold ${fontSize}px "Noto Sans TC", "Noto Sans JP", "Inter", sans-serif`;
    ctx.textAlign = 'center';

    if (state.textStyle === 'light') ctx.fillStyle = '#FFFFFF';
    else if (state.textStyle === 'dark') ctx.fillStyle = '#1e293b';
    else if (state.textStyle === 'gold') ctx.fillStyle = '#FFD700';
    else ctx.fillStyle = '#00FFFF';

    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = canvas.width * 0.02;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const lines = state.customGreeting?.split('\n') || [];
    const totalTextHeight = lines.length * fontSize * 1.2;
    const startY = (canvas.height * 0.88) - (totalTextHeight / 2);

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + (i * fontSize * 1.2));
    });

    return canvas;
  };

  const saveMasterpiece = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Festival_Card_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Sync edited text and style with the active gallery item in Firestore
    try {
      if (galleryItems.length > 0) {
        const compressed = compressCanvasForGallery(canvas, 1000, 0.82);
        const targetCard = (activeCardId ? galleryItems.find(g => g.id === activeCardId) : null) || galleryItems[0];
        if (targetCard) {
          const updatedCard: GalleryItem = {
            ...targetCard,
            composedImage: compressed,
            greeting: state.customGreeting || targetCard.greeting,
            textStyle: state.textStyle
          };
          saveCardToFirestore(updatedCard).catch(err => {
            console.warn('Failed to update card in Firestore:', err);
          });
          setGalleryItems(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
        }
      }
    } catch (e) {
      console.warn('Sync to gallery on download failed:', e);
    }
  };

  const shareMasterpiece = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `Festival_Card_${Date.now()}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: currentT.title,
            text: state.customGreeting || '',
            files: [file]
          });
        } catch (err) {
          console.error('Share failed:', err);
        }
      } else {
        setState(p => ({ ...p, error: (currentT as any).shareNotSupported || 'Sharing not supported on this device.' }));
      }
    }, 'image/png');
  };

  const textStyleClasses: Record<TextStyle, string> = {
    light: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
    dark: 'text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]',
    gold: 'text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-yellow-400',
    neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-slate-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white font-bold transform rotate-3 shadow-lg">祝</div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none">Festival <span className="text-red-600">Studio</span></h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{currentT.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* PWA In-App Install Prompt */}
          <PWAInstallButton language={state.language} />

          {/* Share Link Button */}
          <button
            onClick={() => {
              setShareInitialTab('all');
              setIsShareModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-indigo-600 hover:from-slate-900 hover:to-slate-900 text-white transition-all uppercase tracking-tight shadow-xs cursor-pointer hover:shadow-red-500/20 active:scale-95"
            title="Share deep link on social media"
          >
            <span>🔗</span>
            <span className="hidden sm:inline">{currentT.shareLink || 'Share Link'}</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('masterpiece-gallery');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 transition-all uppercase tracking-tight shadow-xs cursor-pointer border border-slate-200/60"
            title="Masterpiece Gallery"
          >
            <span>🖼️</span>
            <span className="hidden sm:inline">{currentT.galleryTitle || 'Gallery'}</span>
            <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] rounded-full font-bold">
              {galleryItems.length}
            </span>
          </button>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 transition-all uppercase tracking-tight shadow-xs cursor-pointer border border-slate-200/60"
            title="User Guide & Changelog"
          >
            <span>💡</span>
            <span className="hidden sm:inline">{currentT.guide || 'Guide'}</span>
          </button>
          <select 
            value={state.language}
            onChange={(e) => setState(p => ({ ...p, language: e.target.value as Language }))}
            className="text-xs font-black bg-slate-900 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition-all uppercase tracking-tighter outline-none cursor-pointer"
          >
            <option value={Language.EN}>English</option>
            <option value={Language.ZH}>繁體中文</option>
            <option value={Language.SC}>简体中文</option>
            <option value={Language.JA}>日本語</option>
            <option value={Language.KO}>한국어</option>
            <option value={Language.DE}>Deutsch</option>
          </select>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 space-y-12">
        {!state.resultImage ? (
          <div className="space-y-12">
            {/* Step 1: Photo & Greeting */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-red-600 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs italic">1</span>
                    {currentT.uploadPrompt}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[11px] font-bold text-slate-400 italic">
                      {currentT.petNotice}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsGuideOpen(true)}
                      className="text-[11px] font-black text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>💡</span> {currentT.howItWorks || 'How it works'}
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-3xl border-2 border-dashed border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col items-center justify-center">
                  {state.image ? (
                    <div className="relative w-full h-full group">
                      <img src={state.image} className="w-full h-full object-cover" alt="User selfie" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4 backdrop-blur-xs">
                        <button
                          onClick={handleOpenSelfie}
                          className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:bg-red-700 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <span>📸</span> {currentT.takeSelfie || '現場自拍'}
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <span>📁</span> {currentT.uploadPhoto || '上傳檔案'}
                        </button>
                        <button
                          onClick={() => setState(p => ({ ...p, image: null, resultImage: null }))}
                          title="Remove Photo"
                          className="w-9 h-9 bg-black/60 hover:bg-black/90 text-white rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      {/* Mobile friendly quick bar */}
                      <div className="md:hidden absolute bottom-2 inset-x-2 flex items-center justify-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl">
                        <button
                          onClick={handleOpenSelfie}
                          className="flex-1 py-1.5 px-3 bg-red-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>📸</span> {currentT.takeSelfie}
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 py-1.5 px-3 bg-white/20 text-white rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>📁</span> {currentT.uploadPhoto}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center w-full flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl text-red-600 shadow-inner">
                        📸
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-base">
                          {currentT.uploadPrompt}
                        </h3>
                        <p className="text-slate-400 text-xs font-bold mt-1">
                          {currentT.petNotice}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs pt-1">
                        <button
                          type="button"
                          onClick={handleOpenSelfie}
                          className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 group cursor-pointer"
                        >
                          <span className="text-base group-hover:scale-110 transition-transform">📸</span>
                          <span>{currentT.takeSelfie || '現場自拍'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <span className="text-base">📁</span>
                          <span>{currentT.uploadPhoto || '上傳檔案'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <input
                    type="file"
                    ref={selfieCameraInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                    capture="user"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-red-600 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs italic">2</span>
                  {currentT.customGreetingHeader}
                </h2>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                  <textarea 
                    value={state.customGreeting || ''}
                    onChange={(e) => setState(p => ({ ...p, customGreeting: e.target.value }))}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-400 focus:bg-white focus:outline-none h-32 resize-none font-bold text-lg text-slate-800 transition-all"
                    placeholder={currentT.customGreetingPlaceholder}
                  />
                  <div className="flex flex-wrap gap-2">
                    {(['light', 'dark', 'gold', 'neon'] as TextStyle[]).map(s => (
                      <button 
                        key={s} 
                        onClick={() => setState(p => ({ ...p, textStyle: s }))}
                        className={`flex-1 min-w-[80px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${state.textStyle === s ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Step 2: Festival Selection */}
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-red-600 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs italic">3</span>
                    {currentT.selectFestival}
                  </h2>
                  <p className="text-xs font-bold text-slate-400">
                    {filteredFestivals.length} {state.language === Language.EN ? 'festivals available' : '個可用節慶'}
                  </p>
                </div>
                <div className="bg-red-50 px-6 py-4 rounded-2xl border border-red-100 flex items-center gap-4 animate-in slide-in-from-right duration-500">
                  <span className="text-4xl filter drop-shadow-md">{selectedFestival.icon}</span>
                  <div>
                    <h3 className="font-black text-xl text-red-700 leading-none">
                      {state.language === Language.EN ? selectedFestival.nameEn : 
                       state.language === Language.ZH ? selectedFestival.nameZh :
                       state.language === Language.SC ? selectedFestival.nameSc :
                       state.language === Language.JA ? selectedFestival.nameJa :
                       state.language === Language.KO ? selectedFestival.nameKo :
                       selectedFestival.nameDe}
                    </h3>
                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1 italic">
                      {state.language === Language.EN ? selectedFestival.dateEn : 
                       state.language === Language.ZH ? selectedFestival.dateZh :
                       state.language === Language.SC ? selectedFestival.dateSc :
                       state.language === Language.JA ? selectedFestival.dateJa :
                       state.language === Language.KO ? selectedFestival.dateKo :
                       selectedFestival.dateDe}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Filter Tabs & Navigation Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all' as const, icon: '🌟', label: currentT.catAll || 'All Festivals' },
                    { id: 'eastern' as const, icon: '🧧', label: currentT.catEastern || 'Lunar & Asian' },
                    { id: 'western' as const, icon: '🎄', label: currentT.catWestern || 'Western & Global' },
                    { id: 'lifestyle' as const, icon: '💖', label: currentT.catLifestyle || 'Romantic & Fun' }
                  ].map(tab => {
                    const count = tab.id === 'all'
                      ? FESTIVALS.length
                      : FESTIVALS.filter(f => (FESTIVAL_CATEGORIES[f.id] || f.category) === tab.id).length;
                    const isActive = selectedFestivalCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleSelectCategory(tab.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                          isActive
                            ? 'bg-red-600 text-white shadow-md shadow-red-500/25 scale-102'
                            : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                          isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden sm:flex items-center gap-2 self-end">
                  <button
                    type="button"
                    onClick={() => scrollFestivals('left')}
                    title={currentT.scrollLeft || 'Scroll left'}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50 text-slate-700 font-black text-lg flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollFestivals('right')}
                    title={currentT.scrollRight || 'Scroll right'}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50 text-slate-700 font-black text-lg flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Scrollable Festival Cards with Custom Scrollbar */}
              <div 
                ref={festivalScrollRef}
                className="flex gap-4 overflow-x-auto py-4 px-2 custom-scrollbar snap-x scroll-smooth"
              >
                {filteredFestivals.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => setState(p => ({ ...p, selectedFestivalId: f.id }))}
                    className={`snap-center flex-shrink-0 w-40 md:w-48 p-6 rounded-[2.5rem] border-4 transition-all duration-300 group cursor-pointer ${state.selectedFestivalId === f.id ? 'border-red-600 bg-white shadow-2xl shadow-red-200 -translate-y-2' : 'border-transparent bg-white shadow-md hover:shadow-xl opacity-70 grayscale-[0.3] hover:opacity-100 hover:grayscale-0'}`}
                  >
                    <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-5xl mb-4 transition-all duration-500 ${state.selectedFestivalId === f.id ? 'scale-110 rotate-3' : 'group-hover:rotate-6'}`}>
                      {f.icon}
                    </div>
                    <div className="text-center">
                      <div className={`font-black text-sm uppercase tracking-tight ${state.selectedFestivalId === f.id ? 'text-red-600' : 'text-slate-600'}`}>
                        {state.language === Language.EN ? f.nameEn : 
                         state.language === Language.ZH ? f.nameZh :
                         state.language === Language.SC ? f.nameSc :
                         state.language === Language.JA ? f.nameJa :
                         state.language === Language.KO ? f.nameKo :
                         f.nameDe}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {state.language === Language.EN ? f.dateEn : 
                         state.language === Language.ZH ? f.dateZh :
                         state.language === Language.SC ? f.dateSc :
                         state.language === Language.JA ? f.dateJa :
                         state.language === Language.KO ? f.dateKo :
                         f.dateDe}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Style Selection */}
            <section className="space-y-6">
              <h2 className="text-red-600 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs italic">4</span>
                {currentT.selectStyle}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {STYLES.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setState(p => ({ ...p, selectedStyleId: s.id }))}
                    className={`flex-shrink-0 min-w-[140px] p-5 rounded-3xl border-2 transition-all ${state.selectedStyleId === s.id ? 'border-red-600 bg-red-50 shadow-lg' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className="text-4xl mb-3 flex justify-center">{s.thumbnailIcon}</div>
                    <div className="text-xs font-black uppercase tracking-widest text-center">
                      {state.language === Language.EN ? s.nameEn : 
                       state.language === Language.ZH ? s.nameZh :
                       state.language === Language.SC ? s.nameSc :
                        state.language === Language.JA ? s.nameJa :
                        state.language === Language.KO ? s.nameKo :
                        s.nameDe}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-8 pb-16">
              <button 
                onClick={handleGenerate}
                disabled={!state.image || state.isGenerating}
                className={`w-full max-w-lg py-6 rounded-full font-black text-2xl tracking-widest shadow-2xl transition-all ${!state.image || state.isGenerating ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-slate-900 active:scale-95 hover:shadow-red-500/20'}`}
              >
                {state.isGenerating ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {currentT.generating}
                  </span>
                ) : currentT.generateBtn}
              </button>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="flex flex-col items-center space-y-10 animate-in fade-in zoom-in duration-1000 pb-20">
            <div className="relative w-full max-w-lg bg-white p-3 rounded-[3rem] shadow-2xl shadow-slate-300/50 overflow-hidden ring-1 ring-slate-100" ref={cardRef}>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 aspect-[3/4]">
                <img src={state.resultImage} className="w-full h-full object-cover block" />
                <div className="absolute inset-x-0 bottom-0 p-10 text-center pointer-events-none">
                  <h2 className={`text-4xl md:text-5xl font-black leading-tight break-words whitespace-pre-wrap ${textStyleClasses[state.textStyle]}`}>
                    {state.customGreeting}
                  </h2>
                </div>
              </div>
            </div>

            <div className="w-full max-w-lg space-y-6">
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{currentT.editMessage}</label>
                  <div className="flex gap-3">
                    {(['light', 'dark', 'gold', 'neon'] as TextStyle[]).map(s => (
                      <button 
                        key={s} 
                        onClick={() => setState(p => ({ ...p, textStyle: s }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 shadow-sm ${state.textStyle === s ? 'border-red-600 scale-125 ring-4 ring-red-50' : 'border-slate-100'} ${s === 'light' ? 'bg-white' : s === 'dark' ? 'bg-slate-900' : s === 'gold' ? 'bg-yellow-400' : 'bg-cyan-400'}`}
                      />
                    ))}
                  </div>
                </div>
                <textarea 
                  value={state.customGreeting || ''} 
                  onChange={(e) => setState(p => ({ ...p, customGreeting: e.target.value }))}
                  className="w-full p-4 bg-slate-50 rounded-2xl font-black text-center text-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all resize-none h-24"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={saveMasterpiece}
                  className="flex-1 py-4 bg-red-600 text-white rounded-full font-black text-lg hover:bg-slate-900 transition-all shadow-xl hover:shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📥</span>
                  <span>{currentT.download}</span>
                </button>
                <button 
                  onClick={() => {
                    setShareInitialTab('all');
                    setIsShareModalOpen(true);
                  }}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-full font-black text-lg hover:bg-slate-900 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔗</span>
                  <span>{currentT.shareLink || 'Share Link'}</span>
                </button>
                <button 
                  onClick={shareMasterpiece}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📤</span>
                  <span>{(currentT as any).share || 'Share Image'}</span>
                </button>
                <button 
                  onClick={() => setState(p => ({ ...p, resultImage: null }))}
                  className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-full font-black text-lg hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                >
                  {currentT.restart}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Social Distribution Section */}
        <SocialShareBar
          language={state.language}
          selectedFestivalId={state.selectedFestivalId}
          selectedStyleId={state.selectedStyleId}
          aspectRatio={state.aspectRatio}
          customGreeting={state.customGreeting}
          onOpenModal={() => {
            setShareInitialTab('all');
            setIsShareModalOpen(true);
          }}
          onOpenInstagram={() => {
            setShareInitialTab('instagram');
            setIsShareModalOpen(true);
          }}
        />

        {/* Masterpiece Gallery: Stores last 5 cards in local storage */}
        <GallerySection
          items={galleryItems}
          onRevisit={handleRevisitCard}
          onDelete={handleDeleteGalleryItem}
          onClear={handleClearGallery}
          language={state.language}
        />
      </main>

      {state.isGenerating && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">🎨</div>
          </div>
          <p className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mt-8">{currentT.generating}</p>
          <div className="max-w-xs mt-4 space-y-2">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{currentT.saveNotice}</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-600 h-full animate-progress-indefinite"></div>
            </div>
          </div>
        </div>
      )}

      {state.error && (
        <div className="fixed bottom-8 inset-x-8 max-w-md mx-auto bg-red-600 text-white p-6 rounded-3xl shadow-2xl flex items-center justify-between z-[120] animate-in slide-in-from-bottom duration-300">
          <p className="font-black italic tracking-tight">{state.error}</p>
          <button onClick={() => setState(p => ({ ...p, error: null }))} className="bg-white/20 px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-white/30 transition-all">OK</button>
        </div>
      )}

      {/* Live Selfie Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        language={state.language}
      />

      {/* Interactive User Guide & Changelog Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={state.language}
      />

      {/* Social Share & Deep Link Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        language={state.language}
        selectedFestivalId={state.selectedFestivalId}
        selectedStyleId={state.selectedStyleId}
        aspectRatio={state.aspectRatio}
        customGreeting={state.customGreeting}
        cardId={activeCardId}
        cardImage={state.resultImage || (activeCardId ? galleryItems.find(g => g.id === activeCardId)?.composedImage : galleryItems[0]?.composedImage) || null}
        initialTab={shareInitialTab}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[140] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-top-4 duration-300 border border-slate-800">
          <span className="text-emerald-400 text-base">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Connectivity & Offline Mode Indicator */}
      <OfflineIndicator language={state.language} />

      <footer className="py-16 text-center">
        <div className="w-12 h-1 bg-slate-100 mx-auto mb-6 rounded-full"></div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] opacity-80 flex items-center justify-center gap-2">
          <span>AI Festival Studio v1.5.2 (Instagram Hub & PWA)</span>
          <span>•</span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-red-600 hover:text-red-700 underline cursor-pointer transition-colors"
          >
            {currentT.guide || 'Guide'} & Changelog
          </button>
        </p>
      </footer>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(239, 68, 68, 0.45) rgba(241, 245, 249, 0.9);
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f87171;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes progress-indefinite {
          0% { transform: translateX(-100%); width: 30%; }
          50% { transform: translateX(100%); width: 60%; }
          100% { transform: translateX(200%); width: 30%; }
        }
        .animate-progress-indefinite {
          animation: progress-indefinite 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;