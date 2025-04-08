export const CUISINES = [
  'American',
  'Chinese',
  'French',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Spanish',
  'Thai',
  'Turkish',
  'Vietnamese',
  'British',
  'Australian',
  'Canadian',
  'New Zealand',
  'South African',
  'South American',
  "Bengali",
  "Brazilian",
  "Burmese",
] as const;

export type Cuisine = typeof CUISINES[number];

export const CUISINE_METADATA: Record<Cuisine, { color: string; emoji: string }> = {
  American: { color: '#B31942', emoji: '🇺🇸' },
  Chinese: { color: '#DE2910', emoji: '🇨🇳' },
  French: { color: '#002395', emoji: '🇫🇷' },
  Greek: { color: '#0D5EAF', emoji: '🇬🇷' },
  Indian: { color: '#FF9933', emoji: '🇮🇳' },
  Italian: { color: '#009246', emoji: '🇮🇹' },
  Japanese: { color: '#BC002D', emoji: '🇯🇵' },
  Korean: { color: '#CD2E3A', emoji: '🇰🇷' },
  Mediterranean: { color: '#0072CE', emoji: '🌊' }, // Using wave emoji as it's a region
  Mexican: { color: '#006847', emoji: '🇲🇽' },
  'Middle Eastern': { color: '#CE1126', emoji: '🕌' }, // Using mosque emoji as it's a region
  Spanish: { color: '#C60B1E', emoji: '🇪🇸' },
  Thai: { color: '#00247D', emoji: '🇹🇭' },
  Turkish: { color: '#E30A17', emoji: '🇹🇷' },
  Vietnamese: { color: '#DA251D', emoji: '🇻🇳' },
  British: { color: '#00247D', emoji: '🇬🇧' },
  Australian: { color: '#00008B', emoji: '🇦🇺' },
  Canadian: { color: '#FF0000', emoji: '🇨🇦' },
  'New Zealand': { color: '#00247D', emoji: '🇳🇿' },
  'South African': { color: '#007A4D', emoji: '🇿🇦' },
  'South American': { color: '#FFCB00', emoji: '🌎' }, // Using Americas emoji as it's a region
  Bengali: { color: '#006A4E', emoji: '🇧🇩' },
  Brazilian: { color: '#009B3A', emoji: '🇧🇷' },
  Burmese: { color: '#FECB00', emoji: '🇲🇲' }
} as const;
