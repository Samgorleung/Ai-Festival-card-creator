import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallButtonProps {
  language?: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language = Language.ZH }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA on home screen, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    await install();
    setIsInstalling(false);
  };

  const isEn = language === Language.EN;
  const isZh = language === Language.ZH;
  const isSc = language === Language.SC;
  const isJa = language === Language.JA;
  const isKo = language === Language.KO;

  const installLabel = isEn ? 'Install App' :
    isZh ? '安裝 App' :
    isSc ? '安装应用' :
    isJa ? 'アプリをインストール' :
    isKo ? '앱 설치' :
    'App installieren';

  const iosLabel = isEn ? 'Add to Home' :
    isZh ? '加入主畫面' :
    isSc ? '添加到主屏幕' :
    isJa ? 'ホーム画面に追加' :
    isKo ? '홈 화면에 추가' :
    'Zum Home-Bildschirm';

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-slate-900 hover:to-slate-900 text-white transition-all uppercase tracking-tight shadow-xs cursor-pointer active:scale-95 border border-emerald-500/40"
        title="Install AI Festive Lens as native application"
      >
        <span className="text-sm">📲</span>
        <span className="hidden sm:inline">{installLabel}</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all uppercase tracking-tight shadow-xs cursor-pointer border border-slate-200/80 active:scale-95"
          title="Add AI Festive Lens to iOS Home Screen"
        >
          <span className="text-sm">📲</span>
          <span className="hidden sm:inline">{iosLabel}</span>
        </button>

        {showIOSGuide && (
          <div
            onClick={() => setShowIOSGuide(false)}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[2rem] bg-white p-6 md:p-7 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 text-center"
            >
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
                📲
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {isEn ? 'Install on iPhone & iPad' :
                 isZh ? '將賀卡工坊安裝至 iPhone / iPad' :
                 isSc ? '将贺卡工坊安装至 iPhone / iPad' :
                 'Install on iOS Device'}
              </h3>
              <div className="text-xs text-slate-600 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 font-medium leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</span>
                  <span>
                    {isEn ? 'Tap the Share icon in the Safari bottom bar' :
                     isZh ? '點擊 Safari 底部工具列的「分享」圖示' :
                     isSc ? '点击 Safari 底部工具栏的“分享”图标' :
                     'Tap the Share button in Safari toolbar'} (<span className="font-bold">⎋ / ⇪</span>)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</span>
                  <span>
                    {isEn ? 'Scroll down and tap "Add to Home Screen"' :
                     isZh ? '向下滑動並選擇「加入主畫面」' :
                     isSc ? '向下滑动并选择“添加到主屏幕”' :
                     'Scroll down and select "Add to Home Screen"'} (<span className="font-bold">➕</span>)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</span>
                  <span>
                    {isEn ? 'Launch directly like a native app!' :
                     isZh ? '享受如同原生 App 的全螢幕沈浸創作體驗！' :
                     isSc ? '享受如同原生应用的全屏沉浸创作体验！' :
                     'Launch directly from your Home Screen!'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-black transition-all cursor-pointer shadow-md"
              >
                {isEn ? 'Got it' : isZh ? '我知道了' : isSc ? '我知道了' : 'OK'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // Fallback desktop / browser install prompt button
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all uppercase tracking-tight shadow-xs cursor-pointer border border-slate-200/80 active:scale-95"
        title="Install web app"
      >
        <span className="text-sm">📲</span>
        <span className="hidden lg:inline">{installLabel}</span>
      </button>

      {showDesktopGuide && (
        <div
          onClick={() => setShowDesktopGuide(false)}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[2rem] bg-white p-6 md:p-7 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 text-center"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
              💻
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {isEn ? 'Install on Desktop Browser' :
               isZh ? '在電腦瀏覽器中安裝' :
               isSc ? '在电脑浏览器中安装' :
               'Install on Desktop'}
            </h3>
            <div className="text-xs text-slate-600 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 font-medium leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</span>
                <span>
                  {isEn ? 'Look for the Install icon in the right side of the address bar' :
                   isZh ? '在瀏覽器網址列右側尋找「安裝」圖示' :
                   isSc ? '在浏览器地址栏右侧寻找“安装”图标' :
                   'Look for the Install icon in your browser address bar'} (<span className="font-bold">⊞ / 📥</span>)
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</span>
                <span>
                  {isEn ? 'Or open browser menu (⋮) → "Install AI Festive Lens"' :
                   isZh ? '或開啟瀏覽器選單 (⋮) → 選擇「安裝 AI Festive Lens」' :
                   isSc ? '或打开浏览器菜单 (⋮) → 选择“安装 AI Festive Lens”' :
                   'Or click browser menu (⋮) → "Install app"'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDesktopGuide(false)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black transition-all cursor-pointer shadow-md"
            >
              {isEn ? 'Got it' : isZh ? '我知道了' : isSc ? '我知道了' : 'OK'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
