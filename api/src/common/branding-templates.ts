import type { BrandingConfig } from './branding.defaults';
import { DEFAULT_BRANDING } from './branding.defaults';

export type StarterBrandingTemplate = {
  id: string;
  name: string;
  description: string;
  preview: { primary: string; accent: string };
  themePresetId: string;
  branding: BrandingConfig;
};

export const STARTER_BRANDING_TEMPLATES: StarterBrandingTemplate[] = [
  {
    id: 'spotify-default',
    name: 'Spotify Default',
    description: 'Clean dark theme with no custom background',
    preview: { primary: '#1ed760', accent: '#121212' },
    themePresetId: 'spotify',
    branding: { ...DEFAULT_BRANDING },
  },
  {
    id: 'ngoma-hero',
    name: 'Ngoma Terracotta Hero',
    description: 'Warm terracotta accent with hero layout and gradient drift',
    preview: { primary: '#C0672E', accent: '#F5A623' },
    themePresetId: 'terracotta',
    branding: {
      ...DEFAULT_BRANDING,
      layoutTemplateId: 'hero',
      background: {
        type: 'animated',
        imageUrl: null,
        animatedId: 'gradient-drift',
        overlayOpacity: 0.5,
      },
    },
  },
  {
    id: 'festival-night',
    name: 'Festival Night',
    description: 'Violet theme with aurora background and hero header',
    preview: { primary: '#A855F7', accent: '#121212' },
    themePresetId: 'violet',
    branding: {
      ...DEFAULT_BRANDING,
      layoutTemplateId: 'hero',
      background: {
        type: 'animated',
        imageUrl: null,
        animatedId: 'aurora',
        overlayOpacity: 0.55,
      },
    },
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Ocean preset with compact layout and no background',
    preview: { primary: '#3B82F6', accent: '#181818' },
    themePresetId: 'ocean',
    branding: {
      ...DEFAULT_BRANDING,
      layoutTemplateId: 'minimal',
    },
  },
  {
    id: 'warm-poster',
    name: 'Warm Poster',
    description: 'Amber accent with mesh pulse animation',
    preview: { primary: '#F59E0B', accent: '#121212' },
    themePresetId: 'amber',
    branding: {
      ...DEFAULT_BRANDING,
      background: {
        type: 'animated',
        imageUrl: null,
        animatedId: 'mesh-pulse',
        overlayOpacity: 0.45,
      },
    },
  },
];

export function getStarterBrandingTemplates() {
  return STARTER_BRANDING_TEMPLATES;
}

export function findStarterTemplate(id: string): StarterBrandingTemplate | undefined {
  return STARTER_BRANDING_TEMPLATES.find((t) => t.id === id);
}
