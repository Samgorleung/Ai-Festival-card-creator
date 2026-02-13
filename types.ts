
export enum Language {
  EN = 'EN',
  ZH = 'ZH'
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type TextStyle = 'light' | 'dark' | 'gold' | 'neon';

export interface Festival {
  id: string;
  nameEn: string;
  nameZh: string;
  dateEn: string;
  dateZh: string;
  greetingEn: string;
  greetingZh: string;
  greetingVariations?: { en: string; zh: string }[];
  basePrompt: string;
  icon: string;
}

export interface FestivalStyle {
  id: string;
  nameEn: string;
  nameZh: string;
  prompt: string;
  thumbnailIcon: string;
  category: string;
}

export interface AppState {
  image: string | null;
  customGreeting: string | null;
  textStyle: TextStyle;
  customBackgroundPrompt: string | null;
  customBackgroundImage: string | null;
  selectedFestivalId: string | null;
  selectedStyleId: string | null;
  aspectRatio: AspectRatio;
  language: Language;
  isGenerating: boolean;
  resultImage: string | null;
  error: string | null;
}
