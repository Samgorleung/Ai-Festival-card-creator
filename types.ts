
export enum Language {
  EN = 'EN',
  ZH = 'ZH',
  SC = 'SC',
  JA = 'JA',
  KO = 'KO',
  DE = 'DE'
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type TextStyle = 'light' | 'dark' | 'gold' | 'neon';

export interface Festival {
  id: string;
  nameEn: string;
  nameZh: string;
  nameSc: string;
  nameJa: string;
  nameKo: string;
  nameDe: string;
  dateEn: string;
  dateZh: string;
  dateSc: string;
  dateJa: string;
  dateKo: string;
  dateDe: string;
  greetingEn: string;
  greetingZh: string;
  greetingSc: string;
  greetingJa: string;
  greetingKo: string;
  greetingDe: string;
  greetingVariations?: { en: string; zh: string; sc: string; ja: string; ko: string; de: string }[];
  basePrompt: string;
  icon: string;
}

export interface FestivalStyle {
  id: string;
  nameEn: string;
  nameZh: string;
  nameSc: string;
  nameJa: string;
  nameKo: string;
  nameDe: string;
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
