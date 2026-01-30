import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export async function generateFestivalCard(
  base64Image: string,
  festivalPrompt: string,
  stylePrompt: string,
  greeting: string,
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

  const backgroundImageInstruction = customBackgroundImage 
    ? `USE THE PROVIDED SECOND IMAGE AS THE PRIMARY VISUAL INSPIRATION FOR THE BACKGROUND ENVIRONMENT AND COMPOSITION.` 
    : "";

  parts.push({
    text: `
      DESIGN A PREMIUM FESTIVAL GREETING CARD.
      
      THEME (CULTURAL CONTEXT): ${festivalPrompt}
      RENDERING STYLE (ARTISTIC MEDIUM): ${stylePrompt}
      
      ${backgroundInstruction}
      ${backgroundImageInstruction}
      
      MANDATORY TEXT CONTENT TO RENDER:
      "${greeting}"
      
      STRICT INSTRUCTIONS:
      1. GREETING CARD LAYOUT:
         - This IS a greeting card. The composition must be intentional, balanced, and artistic.
         - INTEGRATE FESTIVAL ELEMENTS: The image must clearly reflect the theme (e.g., pumpkins for Halloween, cherry blossoms for Hanami).
      
      2. SUBJECT INTEGRITY & ATTIRE: 
         - Preserve the recognizable facial features of people/pets from the original photo (Image 1). 
         - **CRITICAL**: Change their clothing to match the THEME (e.g., costumes for Halloween, festive sweaters for Christmas).
      
      3. BACKGROUND & PROPS:
         - Replace the original background with the specified festive scene or custom theme.
      
      4. VISUAL STYLE:
         - Apply the "${stylePrompt}" medium consistently across the whole image.
      
      5. TYPOGRAPHY (ENGLISH ONLY):
         - Render the text "${greeting}" exactly. 
         - DO NOT add any other languages or Chinese characters to the image as they may glitch.
         - The text should be a beautiful, integrated part of the design (e.g., elegant calligraphy, neon light, or carved into a prop).
         - Ensure high contrast and perfect spelling.
      
      6. OUTPUT: Cinematic lighting, 8k resolution feel, professional card design.
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