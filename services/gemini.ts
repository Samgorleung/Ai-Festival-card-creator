import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageResolution, Language } from "../types";

export async function generateFestivalCard(
  base64Image: string,
  festivalPrompt: string,
  stylePrompt: string,
  aspectRatio: AspectRatio,
  customBackgroundPrompt?: string | null,
  customBackgroundImage?: string | null,
  imageResolution: ImageResolution = '2K'
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || 
    process.env.API_KEY || 
    ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ?? '');
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const parts: any[] = [
    {
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg',
      },
    }
  ];

  if (customBackgroundImage) {
    const cleanBG = customBackgroundImage.split(',')[1] || customBackgroundImage;
    parts.push({
      inlineData: {
        data: cleanBG,
        mimeType: 'image/jpeg',
      },
    });
  }

  const backgroundInstruction = customBackgroundPrompt 
    ? `USE THIS SPECIFIC BACKGROUND THEME: ${customBackgroundPrompt}.` 
    : `USE THE FOLLOWING FESTIVAL BACKGROUND: ${festivalPrompt}.`;

  parts.push({
    text: `
      OBJECTIVE: REDRAW AND TRANSLATE THE SOURCE PHOTO INTO A STYLIZED FESTIVAL GREETING CARD USING NANO BANANA 2.1 HIGH-FIDELITY RENDERING.
      
      THEME: ${festivalPrompt}
      ARTISTIC STYLE / MEDIUM: ${stylePrompt}
      ${backgroundInstruction}
      
      STRICT STYLE ENFORCEMENT:
      - The entire output image MUST fully and strictly conform to the target style: "${stylePrompt}".
      - DO NOT keep realistic photograph elements or realistic skin textures. Everything—faces, hair, expressions, clothing, and background—must be fully rendered afresh in the characteristic lines, shading, color palette, and textures of the chosen "${stylePrompt}" medium.
      - The main subjects must look like they have been beautifully hand-drawn, printed, or painted by an artist specializing in "${stylePrompt}" style, while maintaining their recognizable posture, expressions, and likeness.
      
      STRICT NEGATIVE INSTRUCTIONS (CRITICAL):
      - DO NOT DRAW ANY TEXT, LETTERS, NUMBERS, WORDS, OR CHARACTERS IN THE IMAGE.
      - THE IMAGE MUST BE A PURE ARTISTIC COMPOSITION.
      - NO SIGNATURES, NO LOGOS, NO WATERMARKS.
      
      COMPOSITION RULES:
      1. DISTINGUISH MAIN SUBJECTS: Identify the main subjects (people and pets in the foreground, posing, or looking at the camera). You MUST preserve ALL main subjects from the source photo. Do not omit any main family members, friends, or pets.
      2. REMOVE BACKGROUND BYSTANDERS: Ignore and remove any random people, crowds, or bystanders in the background of the source photo. Replace them with the festive environment.
      3. PRESERVE FACES & LIKENESS: Maintain key facial expressions, gender, poses, and recognizable features of all MAIN subjects, but translate their depiction entirely into the techniques of "${stylePrompt}" (e.g., using heavy ink lines for comic styles, soft watercolor washes for ink style, flat shades for anime, rich visual brushstrokes for oil paintings).
      4. FESTIVE ATTIRE: Transform the main subjects' clothing to match the "${festivalPrompt}" theme in the specified "${stylePrompt}" style.
      5. ENVIRONMENT: Create a rich, detailed, immersive festive environment.
      6. STYLE CONSISTENCY: Ensure the entire image adheres to the "${stylePrompt}" artistic medium.
      
      OUTPUT: High-resolution, professional-grade artistic masterpiece without any text labels.
    `,
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageResolution,
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) throw new Error('No content returned from model');
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('Image data missing');
  } catch (error) {
    console.error('Gemini error:', error);
    throw error;
  }
}

export interface BirthdayGreetingAnalysis {
  category: 'couple' | 'family' | 'elder' | 'friend' | 'child' | 'pet' | 'general';
  categoryLabel: string;
  suggestedGreetings: string[];
}

export function getFallbackBirthdayGreetings(language: Language): BirthdayGreetingAnalysis {
  if (language === Language.ZH) {
    return {
      category: 'general',
      categoryLabel: '精選生日祝福',
      suggestedGreetings: [
        '🎂 生日快樂，歲歲平安，心想事成！',
        '✨ 願你眼裡有星光，身邊有溫暖，天天開心！',
        '🎉 暴富暴美，青春常駐，萬事順意！',
        '🌸 願所有美好如期而至，健康快樂！'
      ]
    };
  }
  if (language === Language.SC) {
    return {
      category: 'general',
      categoryLabel: '精选生日祝福',
      suggestedGreetings: [
        '🎂 生日快乐，岁岁平安，心想事成！',
        '✨ 愿你眼里有星光，身边有温暖，天天开心！',
        '🎉 暴富暴美，青春常驻，万事顺意！',
        '🌸 愿所有美好如期而至，健康快乐！'
      ]
    };
  }
  if (language === Language.JA) {
    return {
      category: 'general',
      categoryLabel: 'おすすめの誕生日メッセージ',
      suggestedGreetings: [
        '🎂 お誕生日おめでとうございます！',
        '✨ 笑顔あふれる素晴らしい一年になりますように！',
        '🎉 健やかで幸せな日々をお祈り申し上げます！',
        '🌸 夢がたくさん叶う最高の一年を！'
      ]
    };
  }
  if (language === Language.KO) {
    return {
      category: 'general',
      categoryLabel: '생일 맞춤 축하문구',
      suggestedGreetings: [
        '🎂 생일 축하해요! 항상 행복하세요!',
        '✨ 소중한 날, 가장 빛나는 하루가 되길!',
        '🎉 늘 건강하고 기쁨 가득한 한 해 되세요!',
        '🌸 꽃길만 걷는 멋진 날들이 펼쳐지길!'
      ]
    };
  }
  if (language === Language.DE) {
    return {
      category: 'general',
      categoryLabel: 'Geburtstagsgrüße',
      suggestedGreetings: [
        '🎂 Herzlichen Glückwunsch zum Geburtstag!',
        '✨ Mögen alle deine Wünsche in Erfüllung gehen!',
        '🎉 Viel Glück, Gesundheit und Freude im neuen Lebensjahr!',
        '🌸 Genieße deinen ganz besonderen Tag!'
      ]
    };
  }
  return {
    category: 'general',
    categoryLabel: 'Curated Birthday Greetings',
    suggestedGreetings: [
      '🎂 Happy Birthday! Wishing you joy, love & happiness!',
      '✨ May your special day be filled with endless smiles!',
      '🎉 Cheers to another year of amazing memories!',
      '🌸 Wishing you vibrant health and abundant success!'
    ]
  };
}

export async function analyzePhotoForBirthdayGreetings(
  base64Image: string,
  language: Language
): Promise<BirthdayGreetingAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY || 
    process.env.API_KEY || 
    ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ?? '');
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const prompt = `Analyze this photo of the birthday celebration subject(s) to understand who is depicted:
- Young couple / romantic partners -> category: "couple"
- Family with children or parents -> category: "family"
- Elderly person, grandparents, senior -> category: "elder"
- Child or baby -> category: "child"
- Group of friends / peers -> category: "friend"
- Pet / dog / cat -> category: "pet"
- Single adult / general -> category: "general"

Generate 4 warm, heartfelt, and culturally authentic birthday greetings in language "${language}".
Examples by category:
- Couple: "感情日增，歲歲相伴", "執子之手，生日快樂"
- Family: "家庭和順，幸福美滿", "歲歲常歡愉，平安喜樂"
- Elder: "福如東海，壽比南山", "身體健康，龍馬精神", "松柏長青"
- Friends: "青春常駐，暴富暴美", "友誼萬歲，願所有美好如期而至"

STRICT PRIVACY RULE: DO NOT INCLUDE ANY REAL PERSONAL FULL NAMES (like John Smith, 陳大文). USE ONLY UNIVERSAL RELATIONSHIPS OR TITLES.

Return ONLY a JSON object:
{
  "category": "couple" | "family" | "elder" | "friend" | "child" | "pet" | "general",
  "categoryLabel": "short category title in language ${language}",
  "suggestedGreetings": ["greeting 1", "greeting 2", "greeting 3", "greeting 4"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg'
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return {
      category: parsed.category || 'general',
      categoryLabel: parsed.categoryLabel || '推薦祝福',
      suggestedGreetings: Array.isArray(parsed.suggestedGreetings) && parsed.suggestedGreetings.length > 0
        ? parsed.suggestedGreetings.slice(0, 4)
        : getFallbackBirthdayGreetings(language).suggestedGreetings
    };
  } catch (err) {
    console.warn('AI birthday greeting analysis failed, using fallback:', err);
    return getFallbackBirthdayGreetings(language);
  }
}

/**
 * Detects if a greeting contains full personal names to prevent privacy leaks.
 */
export function checkGreetingPrivacy(greeting: string): { hasRisk: boolean; detectedName?: string; tip?: string } {
  if (!greeting || greeting.trim().length === 0) {
    return { hasRisk: false };
  }

  const commonChineseSurnames = '李王張劉陳楊黃趙周吳徐孫朱馬胡郭林何高梁鄭羅宋謝唐韓曹許鄧蕭馮曾程蔡彭潘袁於董餘蘇葉呂魏蔣田杜丁沈姜范江傅鐘盧汪戴崔任陸廖姚方金邱夏譚韋賈鄒石熊孟秦閻薛侯雷白龍段郝孔邵史毛常萬顧賴武康賀嚴尹錢施覃洪';
  const chineseNamePattern = new RegExp(`(?:祝|致|給|親愛的|送給)?([${commonChineseSurnames}][\\u4e00-\\u9fa5]{1,2})(?:生日|生辰|先生|女士|小姐|同學|朋友)?`);

  const chineseMatch = greeting.match(chineseNamePattern);
  if (chineseMatch && chineseMatch[1] && chineseMatch[1].length >= 2 && chineseMatch[1].length <= 3) {
    const falsePositives = ['健康', '黃金', '長壽', '如意', '福氣', '春節', '中秋', '端午', '高興', '平安', '大吉', '富貴', '龍馬', '白頭', '美滿', '歲歲', '常在', '天天', '快樂', '節日'];
    if (!falsePositives.includes(chineseMatch[1])) {
      return {
        hasRisk: true,
        detectedName: chineseMatch[1],
        tip: `檢測到可能包含人名「${chineseMatch[1]}」，為保護個人私隱，建議使用暱稱或通用祝福語！`
      };
    }
  }

  const englishFullNamePattern = /(?:to|dear|for)?\s*([A-Z][a-z]{2,15}\s+[A-Z][a-z]{2,15})/i;
  const englishMatch = greeting.match(englishFullNamePattern);
  if (englishMatch && englishMatch[1]) {
    const falseWords = ['Happy Birthday', 'Best Wishes', 'Good Luck', 'All The', 'May Your', 'Keep Shining'];
    if (!falseWords.some(fw => fw.toLowerCase() === englishMatch[1].toLowerCase())) {
      return {
        hasRisk: true,
        detectedName: englishMatch[1],
        tip: `Detected potential full name "${englishMatch[1]}". Consider using a nickname to protect personal privacy.`
      };
    }
  }

  return { hasRisk: false };
}

