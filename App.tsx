import React, { useState, useRef, useEffect } from 'react';
import { Language, AppState, AspectRatio, TextStyle } from './types';
import { STYLES, FESTIVALS, TRANSLATIONS } from './constants';
import { generateFestivalCard } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    customGreeting: null,
    textStyle: 'light',
    customBackgroundPrompt: null,
    customBackgroundImage: null,
    selectedFestivalId: FESTIVALS[0].id,
    selectedStyleId: STYLES[0].id,
    aspectRatio: '3:4',
    language: Language.ZH,
    isGenerating: false,
    resultImage: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const currentT = TRANSLATIONS[state.language];

  const selectedFestival = FESTIVALS.find(f => f.id === state.selectedFestivalId) || FESTIVALS[0];

  useEffect(() => {
    const festival = FESTIVALS.find(f => f.id === state.selectedFestivalId);
    if (festival) {
      setState(prev => ({ 
        ...prev, 
        customGreeting: state.language === Language.EN ? festival.greetingEn : festival.greetingZh 
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
        state.customBackgroundImage
      );
      setState(prev => ({ ...prev, resultImage: result, isGenerating: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isGenerating: false, error: currentT.error }));
    }
  };

  const saveMasterpiece = async () => {
    if (!state.resultImage || !cardRef.current) return;
    
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = state.resultImage;
    
    await new Promise(r => img.onload = r);
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const link = document.createElement('a');
    link.download = `Festival_Card_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
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
        <button 
          onClick={() => setState(p => ({ ...p, language: p.language === Language.EN ? Language.ZH : Language.EN }))}
          className="text-xs font-black bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-red-600 transition-all uppercase tracking-tighter"
        >
          {currentT.switchLang}
        </button>
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
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[4/3] rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all bg-white overflow-hidden shadow-sm group"
                >
                  {state.image ? (
                    <img src={state.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-4xl text-slate-300">📸</span>
                      </div>
                      <p className="text-slate-400 font-bold text-sm tracking-tight">{currentT.uploadPrompt}</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
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
                <h2 className="text-red-600 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs italic">3</span>
                  {currentT.selectFestival}
                </h2>
                <div className="bg-red-50 px-6 py-4 rounded-2xl border border-red-100 flex items-center gap-4 animate-in slide-in-from-right duration-500">
                  <span className="text-4xl filter drop-shadow-md">{selectedFestival.icon}</span>
                  <div>
                    <h3 className="font-black text-xl text-red-700 leading-none">
                      {state.language === Language.EN ? selectedFestival.nameEn : selectedFestival.nameZh}
                    </h3>
                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1 italic">
                      {state.language === Language.EN ? selectedFestival.dateEn : selectedFestival.dateZh}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto py-4 px-2 no-scrollbar snap-x">
                {FESTIVALS.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => setState(p => ({ ...p, selectedFestivalId: f.id }))}
                    className={`snap-center flex-shrink-0 w-40 md:w-48 p-6 rounded-[2.5rem] border-4 transition-all duration-300 group ${state.selectedFestivalId === f.id ? 'border-red-600 bg-white shadow-2xl shadow-red-200 -translate-y-2' : 'border-transparent bg-white shadow-md hover:shadow-xl opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'}`}
                  >
                    <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-5xl mb-4 transition-all duration-500 ${state.selectedFestivalId === f.id ? 'scale-110 rotate-3' : 'group-hover:rotate-6'}`}>
                      {f.icon}
                    </div>
                    <div className="text-center">
                      <div className={`font-black text-sm uppercase tracking-tight ${state.selectedFestivalId === f.id ? 'text-red-600' : 'text-slate-500'}`}>
                        {state.language === Language.EN ? f.nameEn : f.nameZh}
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
                      {state.language === Language.EN ? s.nameEn : s.nameZh}
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

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={saveMasterpiece}
                  className="py-5 bg-red-600 text-white rounded-full font-black text-lg hover:bg-slate-900 transition-all shadow-xl hover:shadow-red-500/20 active:scale-95"
                >
                  {currentT.download}
                </button>
                <button 
                  onClick={() => setState(p => ({ ...p, resultImage: null }))}
                  className="py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-full font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
                >
                  {currentT.restart}
                </button>
              </div>
            </div>
          </div>
        )}
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

      <footer className="py-16 text-center">
        <div className="w-12 h-1 bg-slate-100 mx-auto mb-6 rounded-full"></div>
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] opacity-80">
          AI Festival Studio • Crafting Digital Memories
        </p>
      </footer>

      <style>{`
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