import React, { useState } from 'react';
import { Language } from '../types';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface GuideContent {
  guideTitle: string;
  tabGuide: string;
  tabChangelog: string;
  stepsTitle: string;
  tipsTitle: string;
  gotIt: string;
  steps: {
    num: string;
    icon: string;
    title: string;
    desc: string;
  }[];
  tips: {
    icon: string;
    title: string;
    desc: string;
  }[];
}

const GUIDE_LOCALIZATION: Record<Language, GuideContent> = {
  [Language.EN]: {
    guideTitle: 'How to Create Your Card',
    tabGuide: 'User Guide',
    tabChangelog: 'Changelog',
    stepsTitle: '4 Easy Steps',
    tipsTitle: 'Pro Tips for Best Results',
    gotIt: 'Got It, Let’s Start!',
    steps: [
      {
        num: '1',
        icon: '📸',
        title: 'Snap a Selfie or Upload',
        desc: 'Use the live camera with timer or upload a photo from your device. Solo selfies, couples, family groups, and pets are all welcome!'
      },
      {
        num: '2',
        icon: '🏮',
        title: 'Choose the Festival',
        desc: 'Select a festive occasion like Lunar New Year, Lantern Festival, Diwali, White Valentine, or New Year Day.'
      },
      {
        num: '3',
        icon: '🎨',
        title: 'Select an Art Style',
        desc: 'Pick your preferred artistic medium: Traditional Ink Wash, Classic Oil Painting, Anime, Cyberpunk Neon, or Watercolor.'
      },
      {
        num: '4',
        icon: '✨',
        title: 'Personalize & Share',
        desc: 'Customize the greeting message, choose your typography palette (Light, Dark, Gold, Neon), then download high-res PNG or share instantly.'
      }
    ],
    tips: [
      {
        icon: '💡',
        title: 'Good Lighting',
        desc: 'Well-lit faces help Gemini preserve your recognizable likeness and expressions in the new art style.'
      },
      {
        icon: '🐾',
        title: 'Family & Pets',
        desc: 'Our AI prompt rules instruct the model to keep all foreground subjects, friends, and pets in the final festive scene.'
      },
      {
        icon: '🌐',
        title: 'Multilingual Greetings',
        desc: 'Switch the language at any time in the top-right menu to get native greetings in English, Chinese, Japanese, Korean, or German.'
      },
      {
        icon: '🛡️',
        title: 'Privacy Best Practice',
        desc: 'When creating photo birthday cards, use nicknames or universal blessings instead of real full names to protect your personal privacy.'
      }
    ]
  },
  [Language.ZH]: {
    guideTitle: '製作專屬節日賀卡指南',
    tabGuide: '使用指南',
    tabChangelog: '版本更新日誌',
    stepsTitle: '輕鬆 4 步打造賀卡',
    tipsTitle: '達人建議與小貼士',
    gotIt: '了解，開始製作！',
    steps: [
      {
        num: '1',
        icon: '📸',
        title: '現場自拍或上傳照片',
        desc: '可使用內置倒數相機自拍，或從手機/電腦上傳照片。個人、情侶、全家福及毛孩寵物皆可！'
      },
      {
        num: '2',
        icon: '🎂',
        title: '挑選節日或生日場合',
        desc: '選擇農曆新年、元宵節、浪漫情人節、中秋節，或全新推出的專屬「生日慶典」！'
      },
      {
        num: '3',
        icon: '🎨',
        title: '挑選藝術風格',
        desc: '選取心儀的藝術畫風：傳統水墨、厚塗油畫、熱血動漫、賽博朋克霓虹或典雅水彩。'
      },
      {
        num: '4',
        icon: '✨',
        title: '自訂祝福與分享',
        desc: '自訂祝福語與文字配色（白光、深墨、尊貴金、霓虹青），一鍵合成超高畫質賀卡並下載或分享！'
      }
    ],
    tips: [
      {
        icon: '💡',
        title: '光線充足效果佳',
        desc: '清晰的正面光源能讓 Gemini 更精準地在手繪畫風中還原您的神情特徵。'
      },
      {
        icon: '🐾',
        title: '多人與毛孩合影',
        desc: 'AI 已設定主體保護規則，會完整保留前景中的每位親友與寵物。'
      },
      {
        icon: '🌐',
        title: '多語言智能切換',
        desc: '右上角隨時切換語言，自動提供繁中、簡中、英文、日文、韓文與德文的應節祝詞。'
      },
      {
        icon: '🛡️',
        title: '相片賀卡私隱提醒',
        desc: '製作相片生日卡時，強烈建議使用通用暱稱或祝福語，切勿輸入真實全名以防私隱洩漏。'
      }
    ]
  },
  [Language.SC]: {
    guideTitle: '制作专属节日贺卡指南',
    tabGuide: '使用指南',
    tabChangelog: '版本更新日志',
    stepsTitle: '轻松 4 步打造贺卡',
    tipsTitle: '达人建议与小贴士',
    gotIt: '了解，开始制作！',
    steps: [
      {
        num: '1',
        icon: '📸',
        title: '现场自拍或上传照片',
        desc: '可使用内置倒计时相机自拍，或从手机/电脑上传照片。个人、情侣、全家福及宠物皆可！'
      },
      {
        num: '2',
        icon: '🏮',
        title: '挑选节日场合',
        desc: '选择农历除夕团年饭、春节初一、人日、元宵节、白色情人节、排灯节或元旦新年等场合。'
      },
      {
        num: '3',
        icon: '🎨',
        title: '挑选艺术风格',
        desc: '选取心仪的艺术画风：传统水墨、厚涂油画、热血动漫、赛博朋克霓虹或典雅水彩。'
      },
      {
        num: '4',
        icon: '✨',
        title: '自订祝福与分享',
        desc: '自订祝福语与文字配色（白光、深墨、尊贵金、霓虹青），一键合成超高画质贺卡并下载或分享！'
      }
    ],
    tips: [
      {
        icon: '💡',
        title: '光线充足效果佳',
        desc: '清晰的正面光源能让 Gemini 更精准地在手绘风格中还原您的神采特征。'
      },
      {
        icon: '🐾',
        title: '多人与宠物合影',
        desc: 'AI 已设定主体保护规则，会完整保留前景中的每位亲友与宠物。'
      },
      {
        icon: '🌐',
        title: '多语言智能切换',
        desc: '右上角随时切换语言，自动提供繁中、简中、英文、日文、韩文与德文的应节祝词。'
      }
    ]
  },
  [Language.JA]: {
    guideTitle: 'カード作成ガイド',
    tabGuide: '使い方',
    tabChangelog: '更新履歴',
    stepsTitle: '簡単な4ステップ',
    tipsTitle: 'おすすめのヒント',
    gotIt: '了解しました！',
    steps: [
      {
        num: '1',
        icon: '📸',
        title: '自撮りまたは写真をアップロード',
        desc: 'タイマー付きのライブカメラで撮影するか、端末から写真をアップロードします。ペットや友達も大歓迎！'
      },
      {
        num: '2',
        icon: '🏮',
        title: '行事やテーマを選択',
        desc: '旧正月、元宵節、ホワイトデー、ディワリ、新年などのイベントを選びます。'
      },
      {
        num: '3',
        icon: '🎨',
        title: 'アートスタイルを選択',
        desc: '水墨画、油絵、アニメ調、サイバーパンク、水彩画などお好みのスタイルを選択。'
      },
      {
        num: '4',
        icon: '✨',
        title: 'メッセージを編集してシェア',
        desc: 'お祝いメッセージと文字デザインを選び、高画質画像をダウンロードまたは共有します。'
      }
    ],
    tips: [
      {
        icon: '💡',
        title: '明るい照明',
        desc: '顔がはっきりと写っていると、アート化後も自然な表情が保たれます。'
      },
      {
        icon: '🐾',
        title: '友達やペットも一緒に',
        desc: 'AIは主要な人物やペットを認識し、背景のみを祝日風に描き換えます。'
      },
      {
        icon: '🌐',
        title: '多言語対応',
        desc: '右上からいつでも言語を変更でき、各国語のメッセージに対応します。'
      }
    ]
  },
  [Language.KO]: {
    guideTitle: '카드 제작 가이드',
    tabGuide: '사용 가이드',
    tabChangelog: '업데이트 내역',
    stepsTitle: '쉬운 4단계',
    tipsTitle: '최상의 결과를 위한 팁',
    gotIt: '시작하기!',
    steps: [
      {
        num: '1',
        icon: '📸',
        title: '셀카 촬영 또는 업로드',
        desc: '타이머 카메라로 바로 촬영하거나 기기에서 사진을 업로드하세요. 친구나 반려동물도 함께 가능합니다!'
      },
      {
        num: '2',
        icon: '🏮',
        title: '명절 및 행사 선택',
        desc: '설날, 원소절, 화이트데이, 디왈리, 새해 첫날 등 다양한 명절을 선택하세요.'
      },
      {
        num: '3',
        icon: '🎨',
        title: '아트 스타일 선택',
        desc: '수묵화, 유화, 애니메이션, 사이버펑크 네온, 수채화 중 원하는 스타일을 고르세요.'
      },
      {
        num: '4',
        icon: '✨',
        title: '문구 편집 및 공유',
        desc: '축하 문구와 글꼴 색상을 꾸민 뒤, 고화질 카드를 다운로드하거나 바로 공유하세요.'
      }
    ],
    tips: [
      {
        icon: '💡',
        title: '밝은 조명',
        desc: '얼굴이 선명할수록 AI가 특징을 살려 예술적으로 변환합니다.'
      },
      {
        icon: '🐾',
        title: '가족 및 반려동물',
        desc: '전경의 모든 인물과 반려동물이 자연스럽게 카드에 담깁니다.'
      },
      {
        icon: '🌐',
        title: '다국어 지원',
        desc: '우측 상단 메뉴에서 언어를 전환해 다양한 축하 문구를 이용하세요.'
      }
    ]
  },
  [Language.DE]: {
    guideTitle: 'Anleitung zur Kartenerstellung',
    tabGuide: 'Anleitung',
    tabChangelog: 'Versionsverlauf',
    stepsTitle: 'In 4 einfachen Schritten',
    tipsTitle: 'Tipps für beste Ergebnisse',
    gotIt: 'Verstanden, los geht’s!',
    steps: [
      {
        num: '1',
        icon: '📸',
        title: 'Selfie aufnehmen oder hochladen',
        desc: 'Nutzen Sie die Live-Kamera mit Selbstauslöser oder laden Sie ein Foto hoch. Freunde und Haustiere sind willkommen!'
      },
      {
        num: '2',
        icon: '🏮',
        title: 'Anlass auswählen',
        desc: 'Wählen Sie Mondneujahr, Laternenfest, Diwali, Weißer Valentinstag oder Neujahrstag.'
      },
      {
        num: '3',
        icon: '🎨',
        title: 'Kunststil wählen',
        desc: 'Wählen Sie zwischen Tuschemalerei, klassischem Ölgemälde, Anime, Cyberpunk oder Aquarell.'
      },
      {
        num: '4',
        icon: '✨',
        title: 'Personalisieren & Teilen',
        desc: 'Passen Sie Ihren Grußtext und Typografie an, dann laden Sie die hochauflösende Karte herunter.'
      }
    ],
    tips: [
      {
        icon: '💡',
        title: 'Gute Beleuchtung',
        desc: 'Ein gut ausgeleuchtetes Gesicht hilft Gemini, Ihre Gesichtszüge im Kunststil präzise zu bewahren.'
      },
      {
        icon: '🐾',
        title: 'Freunde & Haustiere',
        desc: 'Die KI bewahrt Personen und Haustiere im Vordergrund zuverlässig.'
      },
      {
        icon: '🌐',
        title: 'Mehrsprachig',
        desc: 'Wechseln Sie oben rechts jederzeit die Sprache für passende Grüße in 6 Sprachen.'
      }
    ]
  }
};

const CHANGELOG_ENTRIES = [
  {
    version: 'v1.6.1',
    date: '2026-10-13',
    badge: 'Latest',
    items: [
      'Credential Security & Git Protection: Added firebase-applet-config.json to .gitignore and provided clean firebase-applet-config.example.json template without exposed keys.',
      'Decoupled Gemini & Firebase Architecture: Gemini API key strictly isolated to server/environment variables (GEMINI_API_KEY) in AI Studio Secrets, completely separate from Firebase public web client parameters.',
      'Dynamic Environment Configuration: Firebase loader dynamically reads VITE_FIREBASE_* environment variables with safe fallback to local files.',
      'Secret Scanning Remediation: Verified client asset bundles to ensure zero raw secrets are hardcoded or leaked into client bundles.'
    ]
  },
  {
    version: 'v1.6.0',
    date: '2026-10-13',
    badge: 'Birthday AI',
    items: [
      'AI Birthday Card Studio: Added Birthday Celebration under festival categories with celebratory balloons, cakes, confetti, and ambient bokeh.',
      'Photo-Aware Greeting Assistant (Gemini 3.8 Flash): Multimodal AI analyzes photo subjects (couples, family, elders, friends, pets) to recommend tailored, heartfelt greetings.',
      'Automated Privacy Safeguards (Anti-Name Leak): Built-in real-time name detection warns users against entering full personal names alongside personal photos to safeguard privacy.',
      '1-Tap Preset Application: Instantly apply AI recommended greeting presets with interactive pills and real-time canvas preview.'
    ]
  },
  {
    version: 'v1.5.2',
    date: '2026-10-13',
    badge: 'Instagram',
    items: [
      'Instagram Publishing Assistant: Dedicated in-app Instagram workflow that prevents desktop OS share dialog hijacking and guarantees instant access to Instagram sharing.',
      '1-Click Instagram Launch: Added direct launcher to instagram.com with automated card image download and formatted caption copying.',
      'Manual Re-download & Copy Controls: Individual interactive buttons inside the Instagram Hub to re-download card art or re-copy greeting captions.',
      'Opt-In Mobile Share Sheet: Specialized device share button available for mobile users with the native Instagram app installed.'
    ]
  },
  {
    version: 'v1.5.1',
    date: '2026-10-12',
    badge: 'Social',
    items: [
      'Instagram Image-First Sharing: Tailored sharing flow for Instagram Stories & Feed with native image file dispatch on mobile and 1-click auto-download + caption copy on desktop.',
      'Card Attachment Preview: Live visual card thumbnail inside the Share Modal confirming attached artwork and deep link.',
      'Desktop & iOS Installation Polish: Replaced browser alerts with elegant in-app install guides across Chrome, Safari, Edge, and iOS.',
      'Multi-Platform Social Distribution: Instant 1-click publishing across Instagram, WhatsApp, 𝕏 (Twitter), LINE, Telegram, and Facebook.'
    ]
  },
  {
    version: 'v1.5.0',
    date: '2026-10-12',
    badge: 'PWA',
    items: [
      'Progressive Web App (PWA) Support: Install AI Festive Lens directly onto your smartphone home screen or desktop for a fullscreen, native app experience.',
      'Offline Service Worker: Automatic background caching ensures quick loading and offline access to your local festival cards.',
      'In-App Install Prompt: 1-click install button in the top navigation bar with step-by-step guidance for iOS Safari users.',
      'Mobile Home Icons: Custom festive launcher icons (192x192, 512x512, and maskable) with celebratory styling.'
    ]
  },
  {
    version: 'v1.4.1',
    date: '2026-10-12',
    badge: 'Fix',
    items: [
      'Firestore Permission Fix: Resolved insufficient permissions error by aligning security rules with rawImage and resolution attributes.',
      'Schema Hardening: Updated firebase-blueprint.json intermediate representation with complete payload schema.',
      'Defensive Payload Sanitizer: Pre-filters undefined keys to ensure 100% compliance with Firestore Zero-Trust rules.'
    ]
  },
  {
    version: 'v1.4.0',
    date: '2026-10-12',
    badge: 'Cloud Sync',
    items: [
      'Firebase Cloud Database Persistence: Festival cards are now saved persistently in Firebase Firestore — no more disappearing cards on page reloads or across devices!',
      'Live Real-time Gallery Synchronization: Cards automatically sync across browser sessions in real-time with offline cache fallback.',
      'Cloud Card Deep Linking: Shared links now include ?cardId= to immediately retrieve and display the author\'s cloud card on any device.',
      'Hardened Security Rules: Enterprise Firestore ABAC rules with zero-trust validation and robust error handling.'
    ]
  },
  {
    version: 'v1.3.3',
    date: '2026-10-12',
    badge: 'Social',
    items: [
      'Share Link & Social Distribution: 1-click clipboard copy of active deep links with URL parameters for instant social sharing.',
      'Auto-Configured Deep Linking: Incoming shared URLs automatically pre-select festival theme, art style, aspect ratio, and language.',
      'Interactive Share Modal: Formatted social media captions and direct 1-click distribution to WhatsApp, 𝕏 (Twitter), Telegram, and Facebook.',
      'Dedicated Social Share Bar: Quick-share banner integrated into the studio layout with live copy feedback.'
    ]
  },
  {
    version: 'v1.3.2',
    date: '2026-10-12',
    badge: 'Gallery',
    items: [
      'Masterpiece Gallery: Automatically stores your last 5 generated festival cards in browser local storage.',
      'Revisit & Edit: One-click reload of previous masterpieces into the editor to adjust typography, greetings, and styles.',
      'Instant Re-download: Download previous festival cards directly from the gallery or enlarged preview lightbox.',
      'Storage Optimization: Intelligent canvas compression ensures zero quota errors with high-definition visual fidelity.',
      'Header Quick Jump: Direct gallery shortcut with live badge counter in the top navigation bar.'
    ]
  },
  {
    version: 'v1.3.1',
    date: '2026-10-12',
    badge: 'Festival Update',
    items: [
      'Added Halloween (萬聖節 🎃) with glowing Jack-o\'-lanterns and gothic festive aesthetics.',
      'Added Festival Category Quick-Filter Tabs (🌟 全部, 🧧 東方傳統, 🎄 西方慶典, 💖 浪漫與生活).',
      'Added Left & Right navigation scroll arrows and visible custom scrollbar for seamless desktop browsing.',
      'Hardened selfie camera with persistent stream management and system camera fallback.'
    ]
  },
  {
    version: 'v1.3.0',
    date: '2026-10-12',
    badge: 'Model Update',
    items: [
      'Engine upgraded to Nano Banana 2.1 (gemini-nano-banana-2.1) for cutting-edge multimodal portrait generation.',
      'Significantly enhanced facial likeness retention, style coherence, and group/pet preservation across all artistic mediums.',
      'Active integration with verified paid Gemini API key tier.'
    ]
  },
  {
    version: 'v1.2.0',
    date: '2026-10-01',
    badge: 'Guide',
    items: [
      'Interactive in-app User Guide with step-by-step instructions and photography tips.',
      'Comprehensive CHANGELOG.md documentation stored in package root.',
      'Version and release log viewer integrated directly into the app.'
    ]
  },
  {
    version: 'v1.1.0',
    date: '2026-10-01',
    badge: 'Feature',
    items: [
      'Live Camera viewfinder with real-time video stream (HTML5 getUserMedia).',
      'Configurable self-timer countdown (0s, 3s, 5s) with visual flash shutter effect.',
      'Selfie mirror toggle and multi-camera front/rear lens switcher.',
      'Instant retake and photo replacement controls.'
    ]
  },
  {
    version: 'v1.0.1',
    date: '2026-06-11',
    badge: 'Model Update',
    items: [
      'Upgraded card rendering engine to Gemini 3.1 Flash Image (Nano Banana 2).',
      'Enhanced artistic likeness retention and high-resolution output support.',
      'Secured paid API key setup in AI Studio.'
    ]
  },
  {
    version: 'v1.0.0',
    date: 'Initial',
    badge: 'Release',
    items: [
      'AI Festive greeting card generator supporting 7+ global festive occasions.',
      'Multi-style artistic transformations (Ink Wash, Oil Painting, Anime, Cyberpunk, Watercolor).',
      'HTML5 Canvas typography compositor with Light, Dark, Gold, and Neon styles.',
      'One-click PNG download & native mobile Web Share integration.',
      'Full localization in English, Traditional Chinese, Simplified Chinese, Japanese, Korean, and German.'
    ]
  }
];

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'changelog'>('guide');

  if (!isOpen) return null;

  const loc = GUIDE_LOCALIZATION[language] || GUIDE_LOCALIZATION[Language.EN];

  return (
    <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center text-xl shadow-md shadow-red-500/30">
              💡
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                {loc.guideTitle}
              </h2>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg transition-all ${
                    activeTab === 'guide'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  {loc.tabGuide}
                </button>
                <button
                  onClick={() => setActiveTab('changelog')}
                  className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg transition-all ${
                    activeTab === 'changelog'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  {loc.tabChangelog} (v1.2.0)
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-all"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {activeTab === 'guide' ? (
            <>
              {/* 4 Steps Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  {loc.stepsTitle}
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {loc.steps.map(step => (
                    <div
                      key={step.num}
                      className="p-5 rounded-3xl bg-slate-50 border border-slate-100/80 hover:border-red-200 hover:bg-red-50/20 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center font-black text-xs text-red-600">
                          {step.num}
                        </span>
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm tracking-tight">
                          {step.title}
                        </h4>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tips Section */}
              <section className="space-y-4 pt-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  {loc.tipsTitle}
                </h3>

                <div className="space-y-3">
                  {loc.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-start gap-3.5"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{tip.icon}</span>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs">
                          {tip.title}
                        </h5>
                        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                          {tip.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            /* Changelog Tab */
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                Full documentation is maintained in <code className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-900 font-mono font-bold">CHANGELOG.md</code> inside the package root.
              </div>

              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {CHANGELOG_ENTRIES.map((entry, index) => (
                  <div key={index} className="relative pl-9 space-y-2">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-100"></div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-black text-sm text-slate-900 font-mono">
                        {entry.version}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {entry.date}
                      </span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                        {entry.badge}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {entry.items.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-900 transition-all shadow-lg shadow-red-500/25 active:scale-95"
          >
            {loc.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
};
