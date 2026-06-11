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
      OBJECTIVE: REDRAW AND TRANSLATE THE SOURCE PHOTO INTO A STYLIZED FESTIVAL GREETING CARD.
      
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
      model: 'gemini-3.1-flash-image',
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
