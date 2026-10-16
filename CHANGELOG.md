# Changelog

All notable changes to the **AI Festive Lens** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.7.0] - 2026-10-16

### Added
- **Card Favorites & Heart System (`components/GallerySection.tsx`)**:
  - Interactive heart / favorite button on each gallery card thumbnail (`❤️` / `🤍`) with instant toggle feedback and persistent local storage sync.
  - Full-screen Lightbox Preview modal updated with dedicated favorite button for quick toggling during high-res inspection.
- **Favorites View Filter Toggle (`components/GallerySection.tsx`, `constants.ts`)**:
  - Segmented view control in the gallery header: **All Cards** vs **Favorites** with live count badges.
  - Dedicated empty state for Favorites view prompting users to tap heart icons to bookmark cards, with a quick 1-click button to return to all cards.
  - Multilingual translations added for favorites controls in English, Traditional Chinese, Simplified Chinese, Japanese, Korean, and German.

---

## [1.6.1] - 2026-10-13

### Security & Hardening
- **Git Credential Protection (`.gitignore`, `firebase-applet-config.example.json`)**:
  - Added `firebase-applet-config.json` to `.gitignore` so local Firebase credentials and project parameters are never committed to GitHub or exposed in public repositories.
  - Provided clean `firebase-applet-config.example.json` containing the schema structure with dummy tokens for open-source reference.
- **Strict Decoupling of Gemini AI and Firebase Architecture**:
  - Gemini AI model calls exclusively read from `process.env.GEMINI_API_KEY` / `import.meta.env.VITE_GEMINI_API_KEY` managed in AI Studio Secrets.
  - Firebase Web Client parameters are strictly isolated to public client SDK parameters (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `firestoreDatabaseId`).
- **Dynamic Environment Variable Loader (`services/firebase.ts`)**:
  - Refactored Firebase initialization to prioritize `VITE_FIREBASE_*` environment variables over static local files, with seamless fallback for AI Studio development.
- **Asset Hygiene & Key Rotation Workflow**:
  - Verified Vite production build assets to ensure zero raw private keys or server secrets are embedded.
  - Documented complete key rotation in Google Cloud Console and GitHub secret scanning alert remediation.

---

## [1.6.0] - 2026-10-13

### Added
- **AI Birthday Card Maker (`constants.ts`, `App.tsx`)**:
  - Integrated a dedicated **Birthday Celebration (生日慶典 🎂)** occasion into the studio occasion directory under Lifestyle categories.
  - Generates luxurious celebratory environments with three-tier birthday cakes, glowing candles, metallic and pastel floating balloons, celebratory confetti, champagne flutes, and warm bokeh fairy lighting.
  - Highlighted with a featured occasion badge (`✨ 特有場合 / Featured`) in the occasion selector.

- **Photo-Aware Greeting Assistant powered by Gemini 3.8 Flash (`services/gemini.ts`, `App.tsx`)**:
  - Multimodal AI automatically analyzes uploaded or selfie photos to identify the depicted subjects and relationship context:
    - **Couples / Romantic**: 感情日增, 歲歲相伴, 甜甜蜜蜜
    - **Family & Children**: 家庭和順, 歲歲常歡愉, 平安喜樂
    - **Elders & Seniors**: 福如東海, 身體健康, 龍馬精神, 松柏長青
    - **Friends & Peers**: 青春常駐, 暴富暴美, 心想事成, 歡樂常在
  - Provides 1-click interactive greeting pills allowing users to apply custom, tailored greetings in real time with immediate canvas synchronization.

- **Automated Client-Side Privacy Safeguards (`services/gemini.ts`, `App.tsx`)**:
  - Real-time client-side name detector (`checkGreetingPrivacy`) flags full personal Chinese or English names typed in the greeting box alongside personal photos.
  - Displays high-visibility amber privacy warning dialogs with detected name chips advising users to use generic titles or nicknames to prevent personal data leakage.
  - Proactive privacy notices embedded within the Birthday greeting overlay reminding users to avoid using full personal names.

---

## [1.5.2] - 2026-10-13

### Fixed
- **Instagram Publishing Assistant & Desktop Share Interception Fix (`components/ShareModal.tsx`, `components/SocialShareBar.tsx`)**:
  - Resolved desktop OS share sheet hijacking: On desktop platforms (e.g. Windows), `navigator.canShare({ files })` previously triggered the operating system's generic file share sheet (which does not support Instagram), preventing the user from accessing the Instagram workflow.
  - Engineered the dedicated in-app **Instagram Publishing Assistant** that immediately opens upon clicking the Instagram button without being intercepted by OS dialogs.
  - Automated 3-step posting pipeline: auto-downloads the high-res card image (`.png`), copies the curated festive greeting caption & tags to the clipboard, and presents a direct 1-click button to launch **Instagram (instagram.com) ↗**.
  - Added individual interactive buttons to re-download the card artwork and re-copy caption text at any time.
  - Added an opt-in **"Try Device System Share Sheet"** button tailored for mobile users with the native Instagram app installed.
  - Connected the main studio `SocialShareBar` Instagram button to open the share modal with the Instagram assistant pre-expanded and centered.

---

## [1.5.1] - 2026-10-12

### Added
- **Instagram Image-First Sharing Workflow (`components/ShareModal.tsx`, `components/SocialShareBar.tsx`)**:
  - Engineered tailored sharing pipeline for Instagram Stories and Feed: Instagram requires an image file rather than a URL intent.
  - On mobile devices supporting Web Share API file dispatch (`navigator.canShare({ files: [...] })`), the app automatically bundles the generated card image as a PNG file and opens the native OS share sheet directly into Instagram Stories/Feed/Direct.
  - On desktop and non-file-sharing browsers, 1-click action automatically saves the high-resolution card image to the user's device, copies the customized festive caption & hashtags to the clipboard, and presents a step-by-step guidance banner with a direct link to Instagram.
  - Added live card attachment preview thumbnail in `ShareModal` displaying the composed card artwork.
  - Added quick Instagram action button in `SocialShareBar.tsx` styled with Instagram's signature gradient.

### Improved
- **Desktop & iOS Installation Polish (`components/PWAInstallButton.tsx`)**:
  - Replaced browser `window.alert` fallback with an interactive, responsive desktop modal guide detailing the address bar install icon and browser menu shortcuts.

---

## [1.5.0] - 2026-10-12

### Added
- **Progressive Web App (PWA) & Native Mobile Experience (`manifest.json` & Service Worker)**:
  - Integrated `vite-plugin-pwa` with automatic service worker registration and precaching of static assets and Google Fonts.
  - Added standards-compliant `public/manifest.json` featuring standalone display mode, `id: '/'`, theme color (`#dc2626`), and dedicated icon set (192x192, 512x512, maskable 512x512, and SVG).
  - Designed custom festive brand vector icon (`public/icon.svg`) and high-resolution PNG fallbacks for iOS and Android launchers.
  - Implemented in-app install prompt button (`PWAInstallButton.tsx`) supporting native Android/Chromium `beforeinstallprompt` flow and step-by-step iOS Safari "Add to Home Screen" modal guide.
  - Added real-time connectivity status hook (`useOnlineStatus.ts`) and `OfflineIndicator.tsx` banner informing users when running offline with local cache.
  - Added Apple mobile web app capability tags and high-resolution `apple-touch-icon.png` in `index.html`.

---

## [1.4.1] - 2026-10-12

### Fixed
- **Firestore Permission & Schema Key Alignment**:
  - Resolved `FirebaseError: Missing or insufficient permissions` during card persistence by including `rawImage` (max 800KB) and `resolution` (`'1K' | '2K' | '4K'`) in the Firestore security rules strict key allowlist (`firestore.rules`).
  - Updated intermediate representation (`firebase-blueprint.json`) to reflect `rawImage` and `resolution` schema properties.
  - Hardened client persistence pipeline (`services/firebaseGallery.ts`) with pre-save payload sanitization ensuring outgoing mutations strictly conform to deployed security rules.

---

## [1.4.0] - 2026-10-12

### Added
- **Firebase Firestore Cloud Persistence (`services/firebaseGallery.ts`, `services/firebase.ts`)**:
  - Provisioned Firebase Firestore database (`ai-studio-aifestivelens-...`) and deployed production security rules (`firestore.rules`).
  - Generated festival cards are now saved directly to the cloud in real-time, preventing cards from disappearing upon page reload or browser clearing.
  - Live real-time subscription (`subscribeCardsFromFirestore`) synchronizes gallery additions, edits, and deletions seamlessly across browser tabs and devices.
  - Offline fallback with local storage caching ensures a smooth experience even in poor network conditions.
- **Cloud Card Deep Linking**:
  - Integrated `?cardId=<id>` into the deep link distribution engine, enabling recipients of shared links to immediately view and load the creator's exact cloud festival card.
- **Enterprise Error Handling & Connection Testing**:
  - Added `validateFirestoreConnection()` and structured `handleFirestoreError()` for robust diagnostics adhering to Zero-Trust security rules.

---

## [1.3.3] - 2026-10-12

### Added
- **Deep Link & Social Share Suite (`ShareModal.tsx` & `SocialShareBar.tsx`)**:
  - Implemented 1-click clipboard copy of active deep links with query parameters (`?festival=...&style=...&lang=...&ar=...`).
  - Added full support for automatic pre-selection of festival, style, aspect ratio, and language when opening shared deep links.
  - Added formatted social media distribution captions with festive greetings, hashtags, and dynamic URL injection.
  - 1-click social media distribution triggers for WhatsApp, 𝕏 (Twitter), Telegram, Facebook, and native system share.
  - Dedicated Social Share Bar and sticky header action button with animated copy status feedback.

---

## [1.3.2] - 2026-10-12

### Added
- **Masterpiece Gallery Section (`GallerySection.tsx`)**:
  - Automatically captures and saves generated festival cards into browser `localStorage`.
  - Maintains the last 5 generated creations (FIFO rotation) with visual card tiles, timestamp formatting, aspect ratio tags, and festival metadata.
- **Revisit & Edit Workflow**:
  - Users can click "Revisit" on any past card in the gallery to immediately reload it into the main canvas workspace to modify typography, greetings, and styles.
- **Instant Re-download & Lightbox**:
  - Direct download button on every card tile and within the full-screen enlarged preview lightbox.
  - Native Web Share API integration to easily share past cards on mobile and desktop.
- **Storage Optimization & Quota Safeguards (`services/gallery.ts`)**:
  - Automatically downsizes and compresses rendered card canvases to compact, high-fidelity JPEG data URLs (~100-180KB each).
  - Built-in multi-stage quota error recovery ensures zero storage errors or app interruptions.
- **Header Navigation Badge**:
  - Added sticky header shortcut button with real-time card count badge (`🖼️ Gallery (X)`) for 1-click smooth navigation.

---

## [1.3.1] - 2026-10-12

### Added
- **Added Halloween (`halloween`) Festival**:
  - Full spooky holiday profile with localized greetings across all 6 languages.
  - Carved glowing Jack-o'-lanterns, gothic scenery, and atmospheric prompt engineering.
- **Festival Category Quick-Filter Tabs**:
  - Added filter tabs for 🌟 All Festivals (21), 🧧 Lunar & Asian, 🎄 Western & Global, and 💖 Romantic & Fun.
  - Quick count badges and smooth scroll reset on tab change.
- **Interactive Navigation & Custom Scrollbar**:
  - Added Left (`‹`) and Right (`›`) smooth scroll arrow controls for desktop & laptop navigation.
  - Added visible, sleek rounded scrollbar with red thumb for effortless horizontal tracking across 21+ festival themes.
- **Selfie Camera Architecture Hardening**:
  - Refactored `CameraModal` to use persistent `streamRef` avoiding React effect teardown loops.
  - Added native system camera fallback (`capture="user"`) for devices with blocked WebRTC permissions.

---

## [1.3.0] - 2026-10-12

### Changed
- **Gemini Engine Upgrade to Nano Banana 2.1 (`gemini-nano-banana-2.1`)**:
  - Upgraded core greeting card generation to Google's latest multimodal reasoning and high-fidelity image synthesis model.
  - Substantially improved face and facial expression retention from input selfies and group photos.
  - Deepened artistic medium textures and stylistic translation (ink wash, oil paint, anime, watercolor, cyberpunk).
  - Integrated with verified paid API key tier via AI Studio.

### Added
- **Multi-Resolution Control (1K, 2K, 4K)**:
  - Added resolution & quality toggle in the UI with instant feedback.
  - **1K Fast** (1024px) for rapid rendering iterations.
  - **2K HD** (2048px - Recommended default) for crisp, vibrant digital greeting cards.
  - **4K Ultra Master** (4096px) for maximum printing and archival quality.
- **Multilingual Engine & Resolution Localization**:
  - Localized resolution selectors and model badge across all 6 supported languages.

---

## [1.2.0] - 2026-10-01

### Added
- **Embedded Interactive User Guide (`UserGuideModal`)**:
  - Added a dedicated "How to Use" guide accessible via the header navigation.
  - Illustrated 4-step workflow: Photo capture, Festival selection, Art style selection, and Custom greeting synthesis.
  - Pro tips for optimal photo lighting, group/pet portraits, and card sharing.
  - Fully localized in 6 languages: English, 繁體中文, 简体中文, 日本語, 한국어, and Deutsch.
- **Project Changelog (`CHANGELOG.md`)**:
  - Created standardized historical tracking for all project features and architectural changes.

---

## [1.1.0] - 2026-10-01

### Added
- **Live Camera Viewfinder (`CameraModal`)**:
  - In-browser live camera stream using HTML5 `navigator.mediaDevices.getUserMedia`.
  - Configurable self-timer countdown (Instant 0s, 3s, 5s) with on-screen visual countdown.
  - Real-time selfie mirror mode with toggle.
  - Camera switcher for multi-camera devices (flip between front/user and rear/environment lenses).
  - Visual shutter flash effect upon capture.
  - Automatic stream track cleanup on close/capture to release hardware resources.
  - Error diagnostics for blocked permissions or unavailable camera devices with one-click fallback to file upload.
- **Dual Photo Options in Step 1**:
  - Direct choice between "Take Live Selfie" and "Upload Photo".
  - Hover/tap overlay actions to retake with camera, change file, or remove photo.
- **Multilingual Camera Localization**:
  - Added translation strings for all camera interactions across all 6 supported languages.

---

## [1.0.1] - 2026-06-11

### Changed
- **Gemini Model Upgrade**:
  - Upgraded image generation and editing engine to `gemini-3.1-flash-image` (Nano Banana 2).
  - Enabled high-fidelity image-to-image synthesis, likeness preservation, and resolution configuration.
  - Configured paid API key workflow via AI Studio.
  - Synchronized environment variable loading for `GEMINI_API_KEY` in `vite.config.ts` and `.env.example`.

---

## [1.0.0] - Initial Release

### Added
- **Festival Greeting Card Engine**:
  - AI-powered selfie-to-card transformation using `@google/genai`.
  - Multi-festival support: Reunion Dinner, Lunar New Year (Day 1-3), Everyone's Birthday (Renri), Lantern Festival, White Valentine, Diwali, and New Year Day.
  - Diverse artistic mediums: Traditional Ink Wash, Classic Oil Painting, Vibrant Anime, Cyberpunk Neon, Vintage Watercolor, etc.
- **Card Customization & Typography**:
  - Dynamic festival greeting overlay with multi-line support.
  - 4 typography visual styles: Light, Dark, Gold, and Neon Cyan with drop shadows.
- **HTML5 Canvas Composition**:
  - Client-side canvas synthesis burning stylized greetings and shadows directly into the output image file.
  - One-click high-resolution PNG download with timestamped naming.
  - Native Web Share API integration (`navigator.share`) for mobile/desktop devices.
- **Multilingual Support**:
  - Complete internationalization across English, Traditional Chinese (繁體中文), Simplified Chinese (简体中文), Japanese (日本語), Korean (한국어), and German (Deutsch).
