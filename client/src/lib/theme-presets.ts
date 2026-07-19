/** Display-only preset metadata — full tokens resolved via API */
export type ThemePresetMeta = {
  id: string;
  name: string;
  description: string;
  preview: string[];
};

export const CUSTOM_PRESET_ID = 'custom';

/** Fallback while API loads */
export const FALLBACK_PRESETS: ThemePresetMeta[] = [
  {
    id: 'spotify',
    name: 'Spotify Green',
    description: 'Default Ngoma dark palette',
    preview: ['#1ed760', '#121212', '#181818', '#b3b3b3'],
  },
  {
    id: 'terracotta',
    name: 'Ngoma Terracotta',
    description: 'Warm brand accent',
    preview: ['#C0672E', '#121212', '#181818', '#b3b3b3'],
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Cool blue accent',
    preview: ['#3B82F6', '#121212', '#181818', '#b3b3b3'],
  },
  {
    id: 'violet',
    name: 'Violet Pulse',
    description: 'Purple accent',
    preview: ['#A855F7', '#121212', '#181818', '#b3b3b3'],
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    description: 'Golden warm accent',
    preview: ['#F59E0B', '#121212', '#181818', '#b3b3b3'],
  },
  {
    id: 'rose',
    name: 'Rose Signal',
    description: 'Bold red-pink accent',
    preview: ['#F43F5E', '#121212', '#181818', '#b3b3b3'],
  },
];

/** Approximate preset primary/ring for live preview before save */
export function previewTokensForPreset(presetId: string): Partial<Record<string, string>> {
  const map: Record<string, { primary: string; primaryForeground: string; ring: string }> = {
    spotify: { primary: '#1ed760', primaryForeground: '#000000', ring: '#1ed760' },
    terracotta: { primary: '#C0672E', primaryForeground: '#ffffff', ring: '#C0672E' },
    ocean: { primary: '#3B82F6', primaryForeground: '#ffffff', ring: '#3B82F6' },
    violet: { primary: '#A855F7', primaryForeground: '#ffffff', ring: '#A855F7' },
    amber: { primary: '#F59E0B', primaryForeground: '#000000', ring: '#F59E0B' },
    rose: { primary: '#F43F5E', primaryForeground: '#ffffff', ring: '#F43F5E' },
  };
  return map[presetId] ?? map.spotify;
}
