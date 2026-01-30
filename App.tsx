import React, { useState, useRef } from 'react';
import { Language, AppState, AspectRatio } from './types';
import { STYLES, FESTIVALS, TRANSLATIONS } from './constants';
import { generateFestivalCard } from './services/gemini';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for security and performance

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    selectedFestivalId: FESTIVALS[0].id,
    selectedStyleId: STYLES[0].id,
    aspectRatio: '3:4',
    language: Language.ZH,
    isGenerating: false,
    resultImage: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentT = TRANSLATIONS[state.language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Security Check: File Size
      if (file.size > MAX_FILE_SIZE) {
        setState(prev => ({ ...prev, error: state.language === Language.EN ? 'File too large (Max 5MB)' : '檔案過大 (上限 5MB)' }));
        return;
      }

      // Security Check: File Type
      if (!file.type.startsWith('image/')) {
        setState(prev => ({ ...prev, error: state.language === Language.EN ? 'Invalid file type' : '檔案格式不符' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string, resultImage: null, error: null }));
      };
      reader.onerror = () => {
        setState(prev => ({ ...prev, error: 'Failed to read file' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.image || !state.selectedFestivalId || !state.selectedStyleId) return;
    const festival = FESTIVALS.find(f => f.id === state.selectedFestivalId);
    const style = STYLES.find(s => s.id === state.selectedStyleId);
    if (!festival || !style) return;

    const variations = festival.greetingVariations || [];
    const allGreetings = [
      { en: festival.greetingEn, zh: festival.greetingZh },
      ...variations
    ];
    const selectedGreeting = allGreetings[Math.floor(Math.random() * allGreetings.length)];

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const result = await generateFestivalCard(
        state.image,
        festival.basePrompt,
        style.prompt,
        selectedGreeting.en,
        state.aspectRatio
      );
      setState(prev => ({ ...prev, resultImage: result, isGenerating: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isGenerating: false, error: currentT.error }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-slate-900">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">AI</div>
          <span className="font-bold text-xl tracking-tight">Festival <span className="text-red-600">Card Maker</span></span>
        </div>
        <button 
          onClick={() => setState(p => ({ ...p, language: p.language === Language.EN ? Language.ZH : Language.EN }))}
          className="text-xs font-bold uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
        >
          {currentT.switchLang}
        </button>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 space-y-10">
        {!state.resultImage ? (
          <>
            {/* Template Selection */}
            <section className="space-y-4">
              <h2 className="text-red-600 text-2xl font-black">{currentT.selectOrientation}</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: '3:4', label: currentT.vertical, icon: '▯' },
                  { id: '4:3', label: currentT.horizontal, icon: '▭' },
                  { id: '1:1', label: currentT.square, icon: '▢' }
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setState(p => ({ ...p, aspectRatio: ratio.id as AspectRatio }))}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                      state.aspectRatio === ratio.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <span className="text-xl leading-none">{ratio.icon}</span>
                    <span className="font-bold">{ratio.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Photo Upload */}
            <section className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative w-full aspect-[16/5] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden bg-white ${
                  state.image ? 'border-red-200' : 'border-slate-300 hover:border-red-400'
                }`}
              >
                {state.image ? (
                  <>
                    <img src={state.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="bg-white px-4 py-2 rounded-full font-bold shadow-lg">{currentT.changePhoto}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="font-bold text-slate-500">{currentT.uploadPrompt}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{currentT.petNotice}</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>
            </section>

            {/* Festival Selection */}
            <section className="space-y-4">
              <h2 className="text-red-600 text-2xl font-black">{currentT.selectFestival}</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {FESTIVALS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setState(p => ({ ...p, selectedFestivalId: f.id }))}
                    className={`flex flex-col items-center min-w-[120px] p-4 rounded-2xl border-2 transition-all ${
                      state.selectedFestivalId === f.id ? 'border-red-600 bg-red-50' : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl mb-2">{f.icon}</span>
                    <span className="text-xs font-bold whitespace-nowrap">{state.language === Language.EN ? f.nameEn : f.nameZh}</span>
                    <span className={`text-[10px] mt-1 whitespace-nowrap opacity-60 font-medium ${state.selectedFestivalId === f.id ? 'text-red-600' : 'text-slate-500'}`}>
                      {state.language === Language.EN ? f.dateEn : f.dateZh}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Style Selection */}
            <section className="space-y-4">
              <h2 className="text-red-600 text-2xl font-black">{currentT.selectStyle}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setState(p => ({ ...p, selectedStyleId: style.id }))}
                    className={`relative p-1 rounded-2xl transition-all ${
                      state.selectedStyleId === style.id ? 'ring-4 ring-red-600' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-3 overflow-hidden border border-slate-100">
                      <div className="text-5xl">{style.thumbnailIcon}</div>
                      <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-3 text-center border-t border-slate-100">
                        <p className="font-black text-[11px] uppercase tracking-tight">{state.language === Language.EN ? style.nameEn : style.nameZh}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{style.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Generate Action */}
            <div className="pt-8 flex flex-col items-center">
              <button 
                onClick={handleGenerate}
                disabled={!state.image || state.isGenerating}
                className={`w-full max-w-md py-6 rounded-full font-black text-2xl tracking-widest transition-all shadow-2xl ${
                  !state.image || state.isGenerating 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-red-200'
                }`}
               >
                {state.isGenerating ? currentT.generating : currentT.generateBtn}
               </button>
            </div>
          </>
        ) : (
          /* Result View */
          <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl font-black text-red-600 italic">Your Festive Art✨</h2>
               <button onClick={() => setState(p => ({ ...p, resultImage: null }))} className="text-slate-400 font-bold hover:text-red-600">Back</button>
            </div>
            
            <div className="max-w-md mx-auto relative group">
              <img 
                src={state.resultImage} 
                className="w-full rounded-3xl shadow-2xl border-8 border-white transition-transform" 
              />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg">祝</div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto pb-10">
              <a 
                href={state.resultImage} 
                download="AI_Festival_Canvas.png"
                className="flex-1 py-4 bg-red-600 text-white rounded-full font-bold text-lg text-center hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95"
              >
                {currentT.download}
              </a>
              <button 
                onClick={() => setState(p => ({ ...p, image: null, resultImage: null }))}
                className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-full font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                {currentT.restart}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {state.isGenerating && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-24 h-24 border-8 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
          <div className="space-y-2">
            <p className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{currentT.generating}</p>
            <p className="text-slate-400 text-sm max-w-xs">Removing distractions and painting your festive card...</p>
          </div>
        </div>
      )}

      {state.error && (
        <div className="fixed bottom-24 inset-x-6 z-[110] bg-red-600 text-white p-4 rounded-2xl shadow-2xl animate-bounce text-center">
          {state.error}
          <button onClick={() => setState(p => ({ ...p, error: null }))} className="ml-4 underline font-bold">Close</button>
        </div>
      )}

      <footer className="py-10 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold opacity-50">
        © 2024 AI Festival Card Maker • Multi-Culture Generation
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;