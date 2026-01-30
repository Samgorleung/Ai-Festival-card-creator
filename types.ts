
export enum Language {
  EN = 'EN',
  ZH = 'ZH'
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface Festival {
  id: string;
  nameEn: string;
  nameZh: string;
  dateEn: string;
  dateZh: string;
  greetingEn: string;
  greetingZh: string;
  greetingVariations?: { en: string; zh: string }[];
  basePrompt: string; // Cultural context (attire, background)
  icon: string;
}

export interface FestivalStyle {
  id: string;
  nameEn: string;
  nameZh: string;
  prompt: string; // Visual medium context
  thumbnailIcon: string;
  category: string;
}

export interface AppState {
  image: string | null;
  selectedFestivalId: string | null;
  selectedStyleId: string | null;
  aspectRatio: AspectRatio;
  language: Language;
  isGenerating: boolean;
  resultImage: string | null;
  error: string | null;
}
