
export type EraMode = 'modern' | '2016';
export type TranslationDirection = 'to-slang' | 'to-normal';

export interface Translation {
  id: string;
  original: string;
  translated: string;
  timestamp: number;
  vibeStats: VibeStats;
  era: EraMode;
  direction: TranslationDirection;
}

export interface VibeStats {
  rizz: number; // or "Swag" in 2016
  aura: number; // or "Clout" in 2016
  brainRot: number; // or "Savage" in 2016
  drip: number; // or "Fleek" in 2016
}

export interface TranslationResponse {
  translatedText: string;
  stats: VibeStats;
}
