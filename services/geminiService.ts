
import { GoogleGenAI, Type } from "@google/genai";
import { TranslationResponse, EraMode, TranslationDirection } from "../types";

export const translateToEra = async (text: string, era: EraMode, direction: TranslationDirection = 'to-slang'): Promise<TranslationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const modernToSlangInstruction = `
    Era: MODERN (2024+ Brain Rot / Hyper-Authentic Gen Z)
    Style: Lowercase only. No formal punctuation. Extreme compression. 
    Phrasing: Instead of "I had a great week", say "week was gas". Instead of "Do you want to...", say "u down for". 
    Key Slang: "fr", "ong", "lowkey", "cooked", "rizz", "gyatt", "skibidi", "sigma", "aura", "mogging", "ratio", "deadass", "glazing", "delulu", "ate".
    Emoji Rules: Use "💀" for things that are funny, good, or shocking. Use "😭" for emphasis. Use "🔥" for things that cool.
    Example: 
    Input: "Hey! I had a great week, do you want to grab dinner at 7?"
    Output: "week was gas fr 💀 u down for food at 7? place looks fire af"
  `;

  const modernToNormalInstruction = `
    Convert modern Gen Z slang back to proper, formal English.
    Remove all slang terms, emojis, and informal abbreviations.
    Use proper grammar, punctuation, and capitalization.
    Example:
    Input: "week was gas fr 💀 u down for food at 7? place looks fire af"
    Output: "I had a great week! Would you like to have dinner at 7? The restaurant looks excellent."
  `;

  const legacyToSlangInstruction = `
    Era: 2016 (The "Lit" Era)
    Style: High energy, lots of exclamation marks, "Swag" focused.
    Vocabulary: "on fleek", "lit", "fam", "squad goals", "savage", "gucci", "dab", "yeet", "extra", "turnt", "clout", "shook", "receipts", "tea", "woke", "slay", "cancelled", "finna".
    Emoji Rules: 😂, 🔥, 💯, 👌.
    Example:
    Input: "Hey! I had a great week, do you want to grab dinner at 7?"
    Output: "This week was LIT fam! 😂 Squad goals at the restaurant at 7? It's gonna be SAVAGE! 💯"
  `;

  const legacyToNormalInstruction = `
    Convert 2016-era slang back to proper, formal English.
    Remove all slang terms, emojis, and informal expressions.
    Use proper grammar, punctuation, and capitalization.
    Example:
    Input: "This week was LIT fam! 😂 Squad goals at the restaurant at 7? It's gonna be SAVAGE! 💯"
    Output: "I had a great week! Would you like to have dinner at 7? It's going to be amazing!"
  `;

  const getInstruction = () => {
    if (direction === 'to-normal') {
      return era === 'modern' ? modernToNormalInstruction : legacyToNormalInstruction;
    }
    return era === 'modern' ? modernToSlangInstruction : legacyToSlangInstruction;
  };

  const systemInstruction = `
    You are the Ultimate Slang Expert. ${direction === 'to-normal' ? 'Convert slang back to formal English' : 'Translate text to slang'} based on the requested Era.
    Current Request Era: ${era.toUpperCase()}
    Direction: ${direction === 'to-normal' ? 'SLANG TO NORMAL' : 'NORMAL TO SLANG'}
    
    Instructions:
    ${getInstruction()}

    ${direction === 'to-slang' ? 'Transformation Rule: Break down long formal sentences into short, punchy slang blocks that look like they were typed on a phone in 2 seconds.' : 'Transformation Rule: Convert all slang to proper, professional English with correct grammar and punctuation.'}
    
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
