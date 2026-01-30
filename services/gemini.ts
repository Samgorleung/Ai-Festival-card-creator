
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export async function generateFestivalCard(
  base64Image: string,
  festivalPrompt: string,
  stylePrompt: string,
  greeting: string,
  aspectRatio: AspectRatio
): Promise<string> {
  // Always create a new GoogleGenAI instance right before making an API call 
  // to ensure it always uses the most up-to-date API key from the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `
              DESIGN A PREMIUM FESTIVAL GREETING CARD.
              
              THEME (CULTURAL CONTEXT): ${festivalPrompt}
              RENDERING STYLE (ARTISTIC MEDIUM): ${stylePrompt}
              
              MANDATORY TEXT CONTENT TO RENDER:
              "${greeting}"
              
              STRICT INSTRUCTIONS:
              1. GREETING CARD LAYOUT:
                 - This IS a greeting card. The composition must be intentional, balanced, and artistic.
                 - INTEGRATE FESTIVAL ELEMENTS: The image must clearly reflect the theme (e.g., pumpkins for Halloween, cherry blossoms for Hanami).
              
              2. SUBJECT INTEGRITY & ATTIRE: 
                 - Preserve the recognizable facial features of people/pets from the original photo. 
                 - **CRITICAL**: Change their clothing to match the THEME (e.g., costumes for Halloween, festive sweaters for Christmas).
              
              3. BACKGROUND & PROPS:
                 - Replace the original background with a vibrant, high-quality festive scene.
              
              4. VISUAL STYLE:
                 - Apply the "${stylePrompt}" medium consistently across the whole image.
              
              5. TYPOGRAPHY (ENGLISH ONLY):
                 - Render the text "${greeting}" exactly. 
                 - DO NOT add any other languages or Chinese characters to the image as they may glitch.
                 - The text should be a beautiful, integrated part of the design (e.g., elegant calligraphy, neon light, or carved into a prop).
                 - Ensure high contrast and perfect spelling.
              
              6. OUTPUT: Cinematic lighting, 8k resolution feel, professional card design.
            `,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
        // Fix: Removed incorrect safetySettings that were causing TypeScript errors due to invalid HarmCategory and HarmBlockThreshold values for the image model.
        // The model's default safety filters are sufficient for this use case.
      }
    });

    if (!response.candidates?.[0]?.content?.parts) throw new Error('No content');
    
    // Fix: Find the image part specifically by checking for inlineData, 
    // as the model response may contain both image and text parts in any order.
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
