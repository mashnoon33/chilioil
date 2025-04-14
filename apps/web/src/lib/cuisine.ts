export const CUISINES = [
  'american',
  'chinese',
  'french',
  'greek',
  'indian',
  'italian',
  'japanese',
  'korean',
  'mediterranean',
  'mexican',
  'middleeastern',
  'spanish',
  'thai',
  'turkish',
  'vietnamese',
  'british',
  'australian',
  'canadian',
  'newzealand',
  'southafrican',
  'southamerican',
  'bengali',
  'brazilian',
  'burmese'
] as const;

export type Cuisine = typeof CUISINES[number];

export const CUISINE_METADATA: Record<Cuisine, { color: string; emoji: string }> = {
  american: { color: '#8B3242', emoji: '🇺🇸' },
  chinese: { color: '#A84937', emoji: '🇨🇳' },
  french: { color: '#1F3B6B', emoji: '🇫🇷' },
  greek: { color: '#2B4D7A', emoji: '🇬🇷' },
  indian: { color: '#B87A42', emoji: '🇮🇳' },
  italian: { color: '#2B6B44', emoji: '🇮🇹' },
  japanese: { color: '#8B2D3D', emoji: '🇯🇵' },
  korean: { color: '#964450', emoji: '🇰🇷' },
  mediterranean: { color: '#1F5585', emoji: '🌊' },
  mexican: { color: '#1F5544', emoji: '🇲🇽' },
  middleeastern: { color: '#963342', emoji: '🕌' },
  spanish: { color: '#8B2D3D', emoji: '🇪🇸' },
  thai: { color: '#1F3B6B', emoji: '🇹🇭' },
  turkish: { color: '#A83037', emoji: '🇹🇷' },
  vietnamese: { color: '#A83D3D', emoji: '🇻🇳' },
  british: { color: '#1F3B6B', emoji: '🇬🇧' },
  australian: { color: '#1F3B6B', emoji: '🇦🇺' },
  canadian: { color: '#A83D3D', emoji: '🇨🇦' },
  newzealand: { color: '#1F3B6B', emoji: '🇳🇿' },
  southafrican: { color: '#1F5544', emoji: '🇿🇦' },
  southamerican: { color: '#B89B42', emoji: '🌎' },
  bengali: { color: '#1F5544', emoji: '🇧🇩' },
  brazilian: { color: '#2B6B44', emoji: '🇧🇷' },
  burmese: { color: '#B89B42', emoji: '🇲🇲' }
} as const;

  export function getCuisineColor(cuisine: string) {
    return CUISINE_METADATA[cuisine.trim().toLowerCase() as keyof typeof CUISINE_METADATA]?.color || '#000';
  }

export function getCuisineEmoji(cuisine: Cuisine) {
  return CUISINE_METADATA[cuisine].emoji;
}