import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export async function generateFestivalCard(
  base64Image: string,
  festivalPrompt: string,
  stylePrompt: string,
  aspectRatio: AspectRatio,
  customBackgroundPrompt?: string | null,
  customBackgroundImage?: string | null
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      OBJECTIVE: CREATE A CLEAN ARTISTIC BACKGROUND FOR A GREETING CARD.
      
      THEME: ${festivalPrompt}
      ARTISTIC MEDIUM: ${stylePrompt}
      ${backgroundInstruction}
      
      STRICT NEGATIVE INSTRUCTIONS (CRITICAL):
      - DO NOT DRAW ANY TEXT, LETTERS, NUMBERS, WORDS, OR CHARACTERS IN THE IMAGE.
      - THE IMAGE MUST BE A PURE ARTISTIC COMPOSITION.
      - NO SIGNATURES, NO LOGOS, NO WATERMARKS.
      
      COMPOSITION RULES:
      1. PRESERVE FACE: Keep the facial features of the subject from the source photo (Image 1) recognizable.
      2. FESTIVE ATTIRE: Transform the subject's clothing to match the "${festivalPrompt}" theme in the specified "${stylePrompt}" style.
      3. ENVIRONMENT: Create a rich, detailed, immersive festive environment.
      4. STYLE CONSISTENCY: Ensure the entire image adheres to the "${stylePrompt}" artistic medium.
      
      OUTPUT: High-resolution, professional-grade artistic masterpiece without any text labels.
    `,
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) throw new Error('No content');
    
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
