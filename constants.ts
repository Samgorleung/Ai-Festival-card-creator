import { Festival, FestivalStyle, Language } from './types';

export const FESTIVALS: Festival[] = [
  {
    id: 'lny-reunion',
    nameEn: 'Reunion Dinner',
    nameZh: '年三十晚團年飯',
    dateEn: 'LNY Eve',
    dateZh: '農曆年三十',
    greetingEn: 'Happy Reunion Dinner',
    greetingZh: '團團圓圓，歲歲平安',
    icon: '🍲',
    basePrompt: 'Chinese Lunar New Year Eve Reunion. A large round table overflowing with traditional feast dishes: steamed fish, dumplings, abalone. Warm golden indoor lighting, family atmosphere, red lanterns in background.'
  },
  {
    id: 'lny-day1',
    nameEn: 'Lunar New Year',
    nameZh: '大年初一',
    dateEn: 'Day 1-3',
    dateZh: '農曆正月初一',
    greetingEn: 'Happy Lunar New Year',
    greetingZh: '恭喜發財，大吉大利',
    icon: '🧧',
    basePrompt: 'Traditional Lunar New Year celebration. Vibrant red and gold decorations, plum blossoms (Meihua), firecracker ornaments, red envelopes everywhere, joyous and bright atmosphere.'
  },
  {
    id: 'lny-renri',
    nameEn: "Everyone's Birthday",
    nameZh: '正月初七人日',
    dateEn: 'Day 7 (Renri)',
    dateZh: '農曆正月初七',
    greetingEn: "Happy Human's Day",
    greetingZh: '人日快樂，龍馬精神',
    icon: '🥗',
    basePrompt: 'Chinese Renri festival celebration. People performing "Lo Hei" (prosperity toss) with a colorful Yusheng salad. Joyful atmosphere, spring garden setting, symbols of longevity and health.'
  },
  {
    id: 'lny-lantern',
    nameEn: 'Lantern Festival',
    nameZh: '元宵節',
    dateEn: 'Day 15',
    dateZh: '農曆正月十五',
    greetingEn: 'Happy Lantern Festival',
    greetingZh: '元宵節快樂，月圓人團圓',
    icon: '🏮',
    basePrompt: 'Chinese Lantern Festival at night. Hundreds of glowing red paper lanterns floating in the sky and hanging from trees. A large bright full moon, romantic and peaceful night atmosphere, reflections in water.'
  },
  {
    id: 'white-valentine',
    nameEn: 'White Valentine',
    nameZh: '白色情人節',
    dateEn: 'Mar 14th',
    dateZh: '3月14日',
    greetingEn: 'Pure Love & Sweetness',
    greetingZh: '白色驚喜，愛在心裡',
    icon: '🤍',
    basePrompt: 'White Valentine\'s Day theme. Elegant white decor, white chocolate treats, soft minimalist aesthetics, high-end white floral arrangements, gentle morning light.'
  },
  {
    id: 'diwali',
    nameEn: 'Diwali',
    nameZh: '排燈節',
    dateEn: 'Oct - Nov',
    dateZh: '10月 - 11月',
    greetingEn: 'Happy Diwali!',
    greetingZh: '排燈節快樂，光明驅散黑暗',
    icon: '🪔',
    basePrompt: 'Vibrant Diwali celebration (Festival of Lights). Thousands of glowing Diya lamps, colorful Rangoli floor art, sparkling fireworks in the night sky, warm orange and gold hues.'
  },
  {
    id: 'new-year',
    nameEn: 'New Year Day',
    nameZh: '元旦新年',
    dateEn: 'Jan 1st',
    dateZh: '1月1日',
    greetingEn: 'Happy New Year!',
    greetingZh: '新年快樂，萬象更新',
    icon: '🎊',
    basePrompt: 'Global New Year celebration. Fireworks exploding over a modern city skyline, confetti falling, champagne toasts, bright blue and silver festive lighting.'
  },
  {
    id: 'thanksgiving',
    nameEn: 'Thanksgiving',
    nameZh: '感恩節',
    dateEn: 'Nov 4th Thu',
    dateZh: '11月第四個週四',
    greetingEn: 'Happy Thanksgiving!',
    greetingZh: '感恩有你，歲月靜好',
    icon: '🦃',
    basePrompt: 'Thanksgiving harvest feast. A golden roasted turkey center-piece, pumpkins, autumn leaves, warm rustic wooden dining room, cozy candlelight, cornucopia of vegetables.'
  },
  {
    id: 'black-friday',
    nameEn: 'Black Friday',
    nameZh: '黑色星期五',
    dateEn: 'Nov Fri',
    dateZh: '11月週五',
    greetingEn: 'Best Deals Ever!',
    greetingZh: '狂歡購物，折上折',
    icon: '🛍️',
    basePrompt: 'High-energy Black Friday shopping atmosphere. Neon "SALE" signs, futuristic retail environment, stylish shopping bags, sleek dark aesthetic with vibrant magenta and cyan accents.'
  },
  {
    id: 'beer-fest',
    nameEn: 'Beer Festival',
    nameZh: '啤酒節',
    dateEn: 'Oct',
    dateZh: '10月',
    greetingEn: 'Prost! Cheers!',
    greetingZh: '盡情乾杯，歡度節慶',
    icon: '🍺',
    basePrompt: 'Bavarian Oktoberfest celebration. Huge frothy beer steins, traditional wooden beer hall, blue and white checkered banners, lively communal atmosphere, pretzels and bratwurst.'
  },
  {
    id: 'hanami',
    nameEn: 'Hanami (Sakura)',
    nameZh: '櫻花祭',
    dateEn: 'Spring',
    dateZh: '春季',
    greetingEn: 'Spring is here!',
    greetingZh: '櫻花盛開，春意盎然',
    icon: '🌸',
    basePrompt: 'Japanese Sakura Hanami festival. Thousands of blooming cherry blossom trees, falling pink petals, traditional Japanese park with a red bridge, Mount Fuji in the distant background, soft ethereal lighting.'
  },
  {
    id: 'songkran',
    nameEn: 'Songkran',
    nameZh: '潑水節',
    dateEn: 'Apr 13-15',
    dateZh: '4月13-15日',
    greetingEn: 'Happy Songkran!',
    greetingZh: '潑水迎新，清涼平安',
    icon: '💦',
    basePrompt: 'Thai Songkran Water Festival. Sunny tropical street, people splashing water with buckets and water guns, joyous expressions, traditional Thai temple architecture in the background, colorful summer vibes.'
  },
  {
    id: 'dragon-boat',
    nameEn: 'Dragon Boat',
    nameZh: '端午節',
    dateEn: 'Lunar May 5',
    dateZh: '農曆五月初五',
    greetingEn: 'Ride the Dragon!',
    greetingZh: '端午安康，百舟競渡',
    icon: '🐲',
    basePrompt: 'Dragon Boat Festival racing on a wide river. Traditional colorful dragon boats with rowers, rhythmic drumming, splashes of water, Zongzi (sticky rice dumplings) in foreground, green bamboo leaves decoration.'
  },
  {
    id: 'st-george',
    nameEn: 'St. George\'s Day',
    nameZh: '聖喬治日',
    dateEn: 'Apr 23',
    dateZh: '4月23日',
    greetingEn: 'Courage & Honor!',
    greetingZh: '英勇榮耀，傳統慶典',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    basePrompt: 'St. George\'s Day celebration. English Red Cross flags fluttering, medieval castle backdrop, stylized silver dragon motifs, red roses, chivalrous and historic English countryside atmosphere.'
  },
  {
    id: 'easter',
    nameEn: 'Easter',
    nameZh: '復活節',
    dateEn: 'Spring',
    dateZh: '春季',
    greetingEn: 'Happy Easter!',
    greetingZh: '復活節快樂，萬象更新',
    icon: '🐰',
    basePrompt: 'Easter morning in a lush green meadow. Colorful hand-painted eggs hidden in long grass, cute bunnies, blooming daffodils and tulips, soft morning sunlight, bright and cheerful spring colors.'
  },
  {
    id: 'british-garden',
    nameEn: 'British Garden Party',
    nameZh: '英式庭園派對',
    dateEn: 'Summer',
    dateZh: '夏季',
    greetingEn: 'A Splendid Day!',
    greetingZh: '英式典雅，愜意時光',
    icon: '🫖',
    basePrompt: 'Elegant British Summer Garden Party. Lush green manicured lawns, colorful bunting, floral arrangements. Subjects wearing fascinators or linen suits. High tea setup with scones and tiered cake stands.'
  },
  {
    id: 'pm-day',
    nameEn: 'Project Management Day',
    nameZh: '國際專案管理日',
    dateEn: 'Nov 1st',
    dateZh: '11月1日',
    greetingEn: 'On Time & On Budget!',
    greetingZh: '專案成功，效率至上',
    icon: '📊',
    basePrompt: 'International Project Management Day celebration. Modern corporate office success vibe. Glass boards with colorful Kanban stickies, Gantt charts on screens, professional and celebratory atmosphere, "Success" metrics visualization.'
  },
  {
    id: 'valentine',
    nameEn: "Valentine's Day",
    nameZh: '情人節',
    dateEn: 'Feb 14th',
    dateZh: '2月14日',
    greetingEn: "Happy Valentine's Day",
    greetingZh: '情人節快樂',
    icon: '💝',
    basePrompt: 'Romantic Valentine\'s Day setting. Soft bokeh heart-shaped lights, rose petals, elegant candles, warm pink and red color palette.'
  },
  {
    id: 'mid-autumn',
    nameEn: 'Mid-Autumn',
    nameZh: '中秋節',
    dateEn: 'Sep - Oct',
    dateZh: '農曆八月十五',
    greetingEn: 'Happy Mid-Autumn',
    greetingZh: '中秋節快樂，千里共嬋娟',
    icon: '🥮',
    basePrompt: 'Traditional Mid-Autumn festival. A massive glowing full moon, traditional Chinese architecture, osmanthus flowers, glowing rabbit lanterns.'
  },
  {
    id: 'christmas',
    nameEn: 'Christmas',
    nameZh: '聖誕節',
    dateEn: 'Dec 25th',
    dateZh: '12月25日',
    greetingEn: 'Merry Christmas',
    greetingZh: '聖誕快樂',
    icon: '🎄',
    basePrompt: 'Western Christmas celebration. A grand glowing Christmas tree, soft bokeh lights, cozy fireplace, falling snow outside the window.'
  }
];

export const STYLES: FestivalStyle[] = [
  { 
    id: 'cinematic', 
    nameEn: 'Cinematic', 
    nameZh: '電影寫實', 
    thumbnailIcon: '🎬', 
    category: 'Realism', 
    prompt: 'Ultra-high-end cinematic realism. The subject must be seamlessly integrated into the festive environment with matching ambient lighting, realistic shadow casting, and unified color grading. Ensure the subject looks like they are physically part of the scene, not superimposed. High dynamic range, natural skin textures, and professional film-still quality.' 
  },
  { 
    id: 'hk-comic', 
    nameEn: 'HK Comic', 
    nameZh: '港式漫畫', 
    thumbnailIcon: '👊', 
    category: 'Pop', 
    prompt: 'Traditional Hong Kong Manhua (HK Comic) style. Intense and detailed line art, muscular character anatomy, vibrant saturated colors, dramatic martial arts energy effects (Qi/Aura), expressive and fierce facial features, high-contrast digital painting style inspired by classic 90s martial arts manhua.' 
  },
  { 
    id: 'comic', 
    nameEn: 'American Comic', 
    nameZh: '美式漫畫', 
    thumbnailIcon: '💥', 
    category: 'Pop', 
    prompt: 'Dynamic American superhero comic book art style. Bold black outlines, halftone dot textures (Ben-Day dots), high contrast shadows, action-oriented composition, vintage comic aesthetic.' 
  },
  { 
    id: 'ink', 
    nameEn: 'Ink Wash', 
    nameZh: '中式水墨', 
    thumbnailIcon: '🖌️', 
    category: 'Artistic', 
    prompt: 'Traditional Chinese Ink Wash Painting. Expressive black ink brushstrokes on rice paper with subtle color accents.' 
  },
  { 
    id: 'manga', 
    nameEn: 'Manga', 
    nameZh: '日本動漫', 
    thumbnailIcon: '🍱', 
    category: 'Pop', 
    prompt: 'Modern Japanese manga style. Vibrant colors, clean line art, expressive eyes.' 
  },
  { 
    id: 'oil', 
    nameEn: 'Oil Painting', 
    nameZh: '西式油畫', 
    thumbnailIcon: '🖼️', 
    category: 'Artistic', 
    prompt: 'Classic Western Oil Painting. Thick impasto brushstrokes, rich textures, dramatic lighting.' 
  }
];

export const TRANSLATIONS = {
  [Language.EN]: {
    title: 'AI Festival Studio',
    subtitle: 'Crafting Digital Memories',
    uploadPrompt: 'Upload Selfie',
    changePhoto: 'Change Photo',
    selectFestival: 'Choose Occasion',
    selectStyle: 'Art Style',
    selectOrientation: 'Aspect Ratio',
    generateBtn: 'Create Masterpiece',
    generating: 'Painting Your Vision...',
    download: 'Save Card',
    restart: 'Create New',
    error: 'Generation failed. Try again.',
    switchLang: '中文',
    vertical: 'Portrait',
    horizontal: 'Landscape',
    square: 'Square',
    petNotice: 'Include friends or pets!',
    customBackgroundHeader: 'Custom Scene (Optional)',
    backgroundTextLabel: 'Describe the world...',
    backgroundImageLabel: 'Reference image...',
    clearBackground: 'Clear',
    customGreetingHeader: 'Message Overlay',
    customGreetingPlaceholder: 'Type your message...',
    textStyleLabel: 'Typography',
    editMessage: 'Edit Text',
    saveNotice: 'Blending high-res art and text...'
  },
  [Language.ZH]: {
    title: 'AI 節日賀卡工坊',
    subtitle: '打造獨一無二的數位回憶',
    uploadPrompt: '上傳自拍',
    changePhoto: '更換照片',
    selectFestival: '選擇節日/場合',
    selectStyle: '藝術風格',
    selectOrientation: '畫幅比例',
    generateBtn: '開始創作',
    generating: 'AI 正在精雕細琢...',
    download: '下載賀卡',
    restart: '重新製作',
    error: '生成失敗，請再試一次。',
    switchLang: 'English',
    vertical: '直式',
    horizontal: '橫式',
    square: '正方形',
    petNotice: '歡迎家人與寵物入鏡！',
    customBackgroundHeader: '自定義場景 (選填)',
    backgroundTextLabel: '描述背景細節...',
    backgroundImageLabel: '參考圖...',
    clearBackground: '清除',
    customGreetingHeader: '自訂祝福語',
    customGreetingPlaceholder: '輸入您的祝福...',
    textStyleLabel: '文字樣式',
    editMessage: '編輯文字',
    saveNotice: '正在合成高清圖像與完美文字...'
  }
};