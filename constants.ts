import { Festival, FestivalStyle, Language } from './types';

export const FESTIVALS: Festival[] = [
  // --- Global & Asian Classics ---
  {
    id: 'lunar-new-year',
    nameEn: 'Lunar New Year',
    nameZh: '農曆新年',
    dateEn: 'Jan - Feb',
    dateZh: '農曆正月初一',
    greetingEn: 'Happy Lunar New Year',
    greetingZh: '恭喜發財',
    greetingVariations: [
      { en: 'Wishing You Prosperity', zh: '招財進寶' },
      { en: 'Good Fortune & Happiness', zh: '福氣滿滿' },
      { en: 'Luck & Success', zh: '大吉大利' },
      { en: 'Health & Longevity', zh: '龍馬精神' }
    ],
    icon: '🧧',
    basePrompt: 'Traditional East Asian Lunar New Year. Subjects wearing elegant silk Cheongsam or Tang suits. Background: red lanterns, golden blossoms, and traditional architecture.'
  },
  {
    id: 'valentine',
    nameEn: "Valentine's Day",
    nameZh: '情人節',
    dateEn: 'February 14th',
    dateZh: '2月14日',
    greetingEn: "Happy Valentine's Day",
    greetingZh: '情人節快樂',
    greetingVariations: [
      { en: 'Be My Valentine', zh: '做我的情人' },
      { en: 'With All My Love', zh: '全心愛你' },
      { en: 'Love is in the Air', zh: '愛意滿溢' },
      { en: 'Forever Yours', zh: '永遠屬於你' }
    ],
    icon: '💝',
    basePrompt: 'Romantic Valentine\'s Day setting. Subjects in elegant romantic attire (red/pink accents). Background: soft bokeh heart-shaped lights, rose petals, elegant candles, and a warm intimate atmosphere.'
  },
  {
    id: 'womens-day',
    nameEn: "Women's Day",
    nameZh: '三八婦女節',
    dateEn: 'March 8th',
    dateZh: '3月8日',
    greetingEn: "Happy Women's Day",
    greetingZh: '婦女節快樂',
    greetingVariations: [
      { en: 'Empowered & Inspiring', zh: '充滿力量與啟發' },
      { en: 'Strength and Grace', zh: '力量與優雅' },
      { en: 'Celebrate Her', zh: '為她慶祝' },
      { en: 'Shine Bright', zh: '閃耀光芒' }
    ],
    icon: '👩',
    basePrompt: 'International Women\'s Day celebration. Subjects in elegant, empowered attire. Background: beautiful mimosa flowers, purple and yellow accents, artistic floral patterns, and a bright, inspiring atmosphere.'
  },
  {
    id: 'st-patricks',
    nameEn: "St. Patrick's Day",
    nameZh: '聖派翠克節',
    dateEn: 'March 17th',
    dateZh: '3月17日',
    greetingEn: "Happy St. Patrick's Day",
    greetingZh: '聖派翠克節快樂',
    greetingVariations: [
      { en: 'Luck of the Irish', zh: '幸運隨行' },
      { en: 'Top o\' the morning!', zh: '晨安吉祥' },
      { en: 'Green & Joyful', zh: '一片翠綠喜氣' }
    ],
    icon: '☘️',
    basePrompt: 'St. Patrick\'s Day celebration. Subjects wearing green hats, clover pins, and festive green attire. Background: vibrant green decorations, shamrocks, pots of gold, and a lively pub or street parade atmosphere.'
  },
  {
    id: 'st-georges-day',
    nameEn: "St. George's Day",
    nameZh: '聖喬治節',
    dateEn: 'April 23rd',
    dateZh: '4月23日',
    greetingEn: "Happy St. George's Day",
    greetingZh: '聖喬治節快樂',
    greetingVariations: [
      { en: 'For England & St George', zh: '為了英格蘭與聖喬治' },
      { en: 'Red, White & Brave', zh: '勇敢與榮耀' },
      { en: 'Celebrate English Heritage', zh: '慶祝英倫傳統' }
    ],
    icon: '🐉',
    basePrompt: 'English St. George\'s Day celebration. Subjects in modern festive clothing with red and white accents. Background: English castles, red roses, St George\'s Cross flags, and subtle mythical dragon silhouettes in a legendary atmosphere.'
  },
  {
    id: 'april-fools',
    nameEn: "April Fools' Day",
    nameZh: '愚人節',
    dateEn: 'April 1st',
    dateZh: '4月1日',
    greetingEn: "Happy April Fools'",
    greetingZh: '愚人節快樂',
    greetingVariations: [
      { en: 'Gotcha!', zh: '被騙了吧！' },
      { en: 'No Pranks, Just Love', zh: '不開玩笑，真心愛你' },
      { en: 'Stay Playful!', zh: '保持童心！' }
    ],
    icon: '🃏',
    basePrompt: 'Playful and mischievous April Fools\' atmosphere. Subjects wearing funny accessories like colorful glasses or tiny party hats. Background: colorful confetti, vibrant streamers, and a joyful, prank-filled festive setting.'
  },
  {
    id: 'childrens-day',
    nameEn: "Children's Day",
    nameZh: '兒童節',
    dateEn: 'April 4th / June 1st',
    dateZh: '4月4日 / 6月1日',
    greetingEn: "Happy Children's Day",
    greetingZh: '兒童節快樂',
    greetingVariations: [
      { en: 'Stay Young at Heart', zh: '永保童心' },
      { en: 'Infinite Imagination', zh: '想像力無限' },
      { en: 'Joyful Childhood', zh: '快樂童年' },
      { en: 'Dream Big, Little One', zh: '勇敢做夢' }
    ],
    icon: '🧸',
    basePrompt: 'Whimsical and bright Children\'s Day celebration. Subjects in playful outfits (maybe a superhero cape or a crown). Background: giant colorful balloons, toys, amusement park elements, and bright primary colors.'
  },
  {
    id: 'labor-day',
    nameEn: 'Labor Day',
    nameZh: '五一勞動節',
    dateEn: 'May 1st',
    dateZh: '5月1日',
    greetingEn: 'Happy Labor Day',
    greetingZh: '勞動節快樂',
    greetingVariations: [
      { en: 'Hard Work Pays Off', zh: '辛勤必有收穫' },
      { en: 'Enjoy Your Day Off', zh: '盡情享受假期' },
      { en: 'Respect to Workers', zh: '致敬勞動者' },
      { en: 'Rest and Recharge', zh: '休息再出發' }
    ],
    icon: '🛠️',
    basePrompt: 'Labor Day appreciation style. Subjects in casual holiday wear or neat professional attire. Background: relaxing sunlit city park, a cozy home workshop, or a vibrant professional workspace decorated with festive banners.'
  },
  {
    id: 'canada-day',
    nameEn: 'Canada Day',
    nameZh: '加拿大日',
    dateEn: 'July 1st',
    dateZh: '7月1日',
    greetingEn: 'Happy Canada Day!',
    greetingZh: '加拿大日快樂',
    greetingVariations: [
      { en: 'Proudly Canadian', zh: '以加拿大為榮' },
      { en: 'From Coast to Coast', zh: '跨越東西岸' },
      { en: 'Great White North', zh: '北方國度' }
    ],
    icon: '🇨🇦',
    basePrompt: 'Canada Day celebration. Subjects in red and white clothing with maple leaf designs. Background: majestic Canadian landscapes (mountains/lakes) or a city parade with Canadian flags.'
  },
  {
    id: 'usa-independence',
    nameEn: 'Independence Day',
    nameZh: '美國獨立日',
    dateEn: 'July 4th',
    dateZh: '7月4日',
    greetingEn: 'Happy 4th of July!',
    greetingZh: '獨立日快樂',
    greetingVariations: [
      { en: 'Stars and Stripes', zh: '星條旗慶典' },
      { en: 'Celebrating Freedom', zh: '頌揚自由' },
      { en: 'Land of the Free', zh: '自由之地' }
    ],
    icon: '🇺🇸',
    basePrompt: 'American Independence Day celebration. Subjects in casual summer clothes with American flag patterns. Background: backyard BBQ setting, fireworks, and red, white, and blue decorations.'
  },
  {
    id: 'hk-dragon-boat',
    nameEn: 'Dragon Boat Festival',
    nameZh: '端午節',
    dateEn: 'May - June',
    dateZh: '農曆五月初五',
    greetingEn: 'Happy Dragon Boat Festival',
    greetingZh: '端午安康',
    greetingVariations: [
      { en: 'Peace & Health', zh: '粽香情濃' },
      { en: 'Rowing to Success', zh: '龍舟競渡' },
      { en: 'Auspicious Blessings', zh: '五福臨門' },
      { en: 'Strength and Unity', zh: '力爭上游' }
    ],
    icon: '🚣',
    basePrompt: 'Hong Kong Dragon Boat Festival. Subjects in athletic festive wear or holding Zongzi (sticky rice dumplings). Background: colorful dragon boats racing on the harbor, splashing water, and festive crowds.'
  },
  {
    id: 'hk-bun-festival',
    nameEn: 'Cheung Chau Bun Festival',
    nameZh: '長洲太平清醮',
    dateEn: 'May',
    dateZh: '農曆四月初八',
    greetingEn: 'Peace & Safety',
    greetingZh: '平安吉慶',
    greetingVariations: [
      { en: 'Lucky Bun Blessings', zh: '平安包祝禱' },
      { en: 'Tradition & Protection', zh: '風調雨順' },
      { en: 'Joyful Parade', zh: '普天同慶' },
      { en: 'Abundance & Harmony', zh: '國泰民安' }
    ],
    icon: '🍞',
    basePrompt: 'Hong Kong Cheung Chau Bun Festival. Subjects holding traditional white "Peace Buns" with red stamps. Background: massive bun towers, Piu Sik parade, and vibrant island festival atmosphere.'
  },
  {
    id: 'thanksgiving-ca',
    nameEn: 'Thanksgiving (Canada)',
    nameZh: '感恩節 (加拿大)',
    dateEn: 'Oct (2nd Mon)',
    dateZh: '10月第二個星期一',
    greetingEn: 'Happy Thanksgiving',
    greetingZh: '感恩節快樂',
    greetingVariations: [
      { en: 'Harvest Blessings', zh: '豐收祝福' },
      { en: 'Grateful Hearts', zh: '心懷感恩' },
      { en: 'Giving Thanks', zh: '謝恩時刻' }
    ],
    icon: '🍁',
    basePrompt: 'Canadian Thanksgiving celebration. Subjects in warm autumn layers. Background: beautiful fall foliage (maple leaves), pumpkins, a roasted turkey dinner, and a cozy family gathering.'
  },
  {
    id: 'mid-autumn',
    nameEn: 'Mid-Autumn Festival',
    nameZh: '中秋節',
    dateEn: 'Sep - Oct',
    dateZh: '農曆八月十五',
    greetingEn: 'Happy Mid-Autumn',
    greetingZh: '中秋節快樂',
    greetingVariations: [
      { en: 'Moonlight & Reunion', zh: '月圓人團圓' },
      { en: 'Autumn Blessings', zh: '秋日祝福' },
      { en: 'Peace & Harmony', zh: '花好月圓' },
      { en: 'Sweet Reunion', zh: '千里共嬋娟' }
    ],
    icon: '🥮',
    basePrompt: 'Traditional Mid-Autumn festival. Subjects in ancient flowing robes or modern elegant attire. Background: a giant full moon, glowing paper lanterns, and osmanthus trees.'
  },
  {
    id: 'thanksgiving-us',
    nameEn: 'Thanksgiving (USA)',
    nameZh: '感恩節 (美國)',
    dateEn: 'Nov (4th Thu)',
    dateZh: '11月第四個星期四',
    greetingEn: 'Happy Thanksgiving',
    greetingZh: '感恩節快樂',
    greetingVariations: [
      { en: 'Feast & Gratitude', zh: '盛宴與感恩' },
      { en: 'Blessings of the Season', zh: '季節恩典' },
      { en: 'Family & Turkey', zh: '家人與火雞' }
    ],
    icon: '🦃',
    basePrompt: 'American Thanksgiving celebration. Subjects in smart-casual fall attire. Background: a large dining table with turkey, cornucopias, Macy\'s Thanksgiving Day Parade elements in the background, and warm autumn colors.'
  },
  {
    id: 'black-friday',
    nameEn: 'Black Friday',
    nameZh: '黑色星期五',
    dateEn: 'Nov (Fri after Thanksgiving)',
    dateZh: '11月感恩節後週五',
    greetingEn: 'Happy Black Friday!',
    greetingZh: '購物節快樂！',
    greetingVariations: [
      { en: 'Best Deals Ever', zh: '史上最優折扣' },
      { en: 'Shop Till You Drop', zh: '盡情採購' },
      { en: 'Frenzy of Savings', zh: '省錢狂歡' }
    ],
    icon: '🛍️',
    basePrompt: 'Modern urban shopping festival. Subjects in stylish streetwear holding colorful shopping bags. Background: vibrant neon city lights, futuristic shopping mall, and a high-energy consumer celebration atmosphere.'
  },
  {
    id: 'pm-day',
    nameEn: 'International PM Day',
    nameZh: '項目管理日',
    dateEn: 'Nov (1st Thu)',
    dateZh: '11月第一個星期四',
    greetingEn: 'Happy PM Day!',
    greetingZh: '項目管理日快樂',
    greetingVariations: [
      { en: 'On Time & In Scope', zh: '準時且如期' },
      { en: 'Master of Efficiency', zh: '效率大師' },
      { en: 'Turning Vision into Reality', zh: '將願景變為現實' },
      { en: 'Success Delivered', zh: '成功交付' }
    ],
    icon: '📊',
    basePrompt: 'Modern Professional Project Management style. Subjects in smart business casual attire. Background: sleek modern glass office, digital dashboard patterns in the air, abstract gantt charts, and a celebration of collaborative success.'
  },
  {
    id: 'mardi-gras',
    nameEn: 'Mardi Gras',
    nameZh: '嘉年華 (馬爾迪·格拉)',
    dateEn: 'Feb / Mar',
    dateZh: '大齋首日前夕',
    greetingEn: 'Happy Mardi Gras!',
    greetingZh: '嘉年華快樂',
    greetingVariations: [
      { en: 'Let the good times roll!', zh: '盡情狂歡吧！' },
      { en: 'Purple, Green & Gold', zh: '紫色、綠色與金色' },
      { en: 'Masks & Beads', zh: '面具與珠串' }
    ],
    icon: '🎭',
    basePrompt: 'New Orleans Mardi Gras celebration. Subjects wearing ornate masks and layers of colorful beads in purple, green, and gold. Background: vibrant street parade, ornate balconies, and festive jazz atmosphere.'
  },
  {
    id: 'christmas',
    nameEn: 'Christmas',
    nameZh: '聖誕節',
    dateEn: 'December 25th',
    dateZh: '12月25日',
    greetingEn: 'Merry Christmas',
    greetingZh: '聖誕快樂',
    greetingVariations: [
      { en: 'Season of Giving', zh: '恩典季節' },
      { en: 'Joy to the World', zh: '普世歡騰' },
      { en: 'Warm Winter Wishes', zh: '冬日暖心祝福' }
    ],
    icon: '🎄',
    basePrompt: 'Western Christmas celebration. Subjects wearing festive red and green sweaters or holiday scarves. Background: a glowing Christmas tree, soft bokeh lights, and delicate falling snow.'
  },
  {
    id: 'halloween',
    nameEn: 'Halloween',
    nameZh: '萬聖節',
    dateEn: 'October 31st',
    dateZh: '10月31日',
    greetingEn: 'Happy Halloween',
    greetingZh: '萬聖節快樂',
    greetingVariations: [
      { en: 'Trick or Treat!', zh: '不給糖就搗蛋！' },
      { en: 'Spooktacular Vibes', zh: '驚喜萬分' },
      { en: 'Have a Ghoulish Night', zh: '奇幻驚魂夜' },
      { en: 'Boo to You!', zh: '萬聖驚喜！' }
    ],
    icon: '🎃',
    basePrompt: 'Western Halloween celebration. Subjects wearing creative costumes (wizards, superheroes, or classic monsters). Background: carved pumpkins (jack-o\'-lanterns) with glowing candles, misty autumn woods, spooky but fun decorations, and purple/orange lighting.'
  },
  {
    id: 'hanami',
    nameEn: 'Cherry Blossom',
    nameZh: '櫻花季',
    dateEn: 'Mar - Apr',
    dateZh: '3月下旬至4月',
    greetingEn: 'お花見 (Hanami)',
    greetingZh: '櫻花祭',
    greetingVariations: [
      { en: 'Sakura Dreams', zh: '櫻之夢想' },
      { en: 'Beauty of Spring', zh: '春之韻律' },
      { en: 'Bloom in Joy', zh: '在喜悅中盛放' }
    ],
    icon: '🌸',
    basePrompt: 'Japanese Cherry Blossom Festival. Subjects in casual spring Kimonos or Yukatas. Background: beautiful blooming pink sakura trees, falling petals, and scenic park setting.'
  }
];

export const STYLES: FestivalStyle[] = [
  {
    id: 'classic',
    nameEn: 'Classic',
    nameZh: '經典寫實',
    thumbnailIcon: '📸',
    category: 'Realism',
    prompt: 'Professional studio photography style. Realistic textures, cinematic lighting, high-definition camera look.'
  },
  {
    id: 'ink',
    nameEn: 'Ink Wash',
    nameZh: '中式水墨',
    thumbnailIcon: '🖌️',
    category: 'Artistic',
    prompt: 'Traditional Chinese Ink Wash Painting (Shuimo). Expressive black ink brushstrokes on textured rice paper, wet ink washes, elegant composition, negative space, and watercolor accents.'
  },
  {
    id: 'oil',
    nameEn: 'Oil Painting',
    nameZh: '西式油畫',
    thumbnailIcon: '🖼️',
    category: 'Artistic',
    prompt: 'Classic Western Oil Painting. Visible thick impasto brushstrokes, rich deep colors, canvas texture, realistic but painterly light.'
  },
  {
    id: 'ukiyo-e',
    nameEn: 'Ukiyo-e',
    nameZh: '浮世繪',
    thumbnailIcon: '🌊',
    category: 'Artistic',
    prompt: 'Traditional Japanese Ukiyo-e woodblock print style. Flat perspective, bold outlines, textured paper look, distinct gradation (bokashi).'
  },
  {
    id: 'manga',
    nameEn: 'Manga',
    nameZh: '日本動漫',
    thumbnailIcon: '🍱',
    category: 'Pop',
    prompt: 'Modern Japanese manga or anime style. Expressive eyes, clean line art, vibrant cel-shading.'
  },
  {
    id: 'comic',
    nameEn: 'American Comic',
    nameZh: '美式漫畫',
    thumbnailIcon: '🦸',
    category: 'Pop',
    prompt: 'Classic American comic book style. Bold black ink outlines, Ben-Day dots shading, vibrant primary colors.'
  },
  {
    id: 'hollywood',
    nameEn: 'Hollywood',
    nameZh: '好萊塢風',
    thumbnailIcon: '🎬',
    category: 'Poster',
    prompt: 'Modern Hollywood blockbuster movie poster style. Cinematic lighting, teal and orange color grading, dramatic atmosphere.'
  },
  {
    id: 'yarn',
    nameEn: 'Yarn Art',
    nameZh: '毛線編織',
    thumbnailIcon: '🧶',
    category: 'Craft',
    prompt: 'Whimsical 3D knitted yarn and wool texture. Handcrafted from soft fibers and fabric.'
  }
];

export const TRANSLATIONS = {
  [Language.EN]: {
    title: 'AI Festival Card Maker',
    subtitle: 'Create personalized festival greeting cards with AI',
    uploadPrompt: 'Start with a photo',
    changePhoto: 'Change Photo',
    selectFestival: 'Select Festival',
    selectStyle: 'Select Style',
    selectOrientation: 'Orientation',
    generateBtn: 'Next',
    generating: 'Generating Artwork...',
    download: 'Save Masterpiece',
    restart: 'Create New',
    error: 'Generation failed. Please try a clearer photo.',
    switchLang: '中文',
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    square: 'Square',
    petNotice: 'Friends, family, and pets are all welcome!'
  },
  [Language.ZH]: {
    title: 'AI 節日賀卡製作',
    subtitle: '用 AI 製作專屬的節日賀卡',
    uploadPrompt: '上傳照片開始',
    changePhoto: '更換照片',
    selectFestival: '選擇節日',
    selectStyle: '選擇風格',
    selectOrientation: '畫幅',
    generateBtn: '下一步',
    generating: '正在精心繪製...',
    download: '保存作品',
    restart: '重新製作',
    error: '生成失敗，請嘗試更清晰的照片。',
    switchLang: 'English',
    vertical: '直式',
    horizontal: '橫式',
    square: '正方形',
    petNotice: '歡迎家人、朋友與寵物一同入鏡！'
  }
};