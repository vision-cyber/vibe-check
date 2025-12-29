
import { GoogleGenAI, Type } from "@google/genai";
import { TranslationResponse, EraMode } from "../types";

export const translateToEra = async (text: string, era: EraMode): Promise<TranslationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const modernInstruction = `
    Era: MODERN (2024+ Brain Rot / Hyper-Authentic Gen Z)
    Style: Lowercase only. No formal punctuation. Extreme compression. 
    Phrasing: Instead of "I had a great week", say "week was gas". Instead of "Do you want to...", say "u down for". 
    Key Slang: "fr", "ong", "lowkey", "cooked", "rizz", "gyatt", "skibidi", "sigma", "aura", "mogging", "ratio", "deadass", "glazing", "delulu", "ate".
    Emoji Rules: Use "💀" for things that are funny, good, or shocking. Use "😭" for emphasis. Use "🔥" for things that are cool.
    Example: 
    Input: "Hey! I had a great week, do you want to grab dinner at 7?"
    Output: "week was gas fr 💀 u down for food at 7? place looks fire af"
  `;

  const legacyInstruction = `
    Era: 2016 (The "Lit" Era)
    Style: High energy, lots of exclamation marks, "Swag" focused.
    Vocabulary: "on fleek", "lit", "fam", "squad goals", "savage", "gucci", "dab", "yeet", "extra", "turnt", "clout", "shook", "receipts", "tea", "woke", "slay", "cancelled", "finna".
    Emoji Rules: 😂, 🔥, 💯, 👌.
    Example:
    Input: "Hey! I had a great week, do you want to grab dinner at 7?"
    Output: "This week was LIT fam! 😂 Squad goals at the restaurant at 7? It's gonna be SAVAGE! 💯"
  `;

  const systemInstruction = `
    You are the Ultimate Slang Expert. Translate the user's text based on the requested Era.
    Current Request Era: ${era.toUpperCase()}
    
    Instructions:
    ${era === 'modern' ? modernInstruction : legacyInstruction}

    Transformation Rule: Break down long formal sentences into short, punchy slang blocks that look like they were typed on a phone in 2 seconds.
    
    Generate "vibe statistics" (0-100):
    - Stat 1: ${era === 'modern' ? 'Rizz' : 'Swag'}
    - Stat 2: ${era === 'modern' ? 'Aura' : 'Clout'}
    - Stat 3: ${era === 'modern' ? 'Brain Rot' : 'Savage'}
    - Stat 4: ${era === 'modern' ? 'Drip' : 'Fleek'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate this: "${text}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: {
              type: Type.STRING,
            },
            stats: {
              type: Type.OBJECT,
              properties: {
                rizz: { type: Type.INTEGER },
                aura: { type: Type.INTEGER },
                brainRot: { type: Type.INTEGER },
                drip: { type: Type.INTEGER },
              },
              required: ["rizz", "aura", "brainRot", "drip"],
            },
          },
          required: ["translatedText", "stats"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return result as TranslationResponse;
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw new Error("Failed to scan the vibes. Try again, king.");
  }
};
