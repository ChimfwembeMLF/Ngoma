import type { LayoutTemplateId } from './branding.defaults';

export type LayoutTemplateMeta = {
  id: LayoutTemplateId;
  name: string;
  description: string;
};

export type AnimatedPresetMeta = {
  id: string;
  name: string;
  description: string;
};

export const LAYOUT_TEMPLATES: LayoutTemplateMeta[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard top navigation bar',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Compact header with smaller navigation',
  },
  {
    id: 'hero',
    name: 'Hero',
    description: 'Taller branded header band for events',
  },
];

export const ANIMATED_BACKGROUND_PRESETS: AnimatedPresetMeta[] = [
  {
    id: 'gradient-drift',
    name: 'Gradient drift',
    description: 'Slow shifting colour gradient',
  },
  {
    id: 'aurora',
    name: 'Aurora drift',
    description: 'Soft aurora colour waves',
  },
  {
    id: 'mesh-pulse',
    name: 'Mesh pulse',
    description: 'Breathing radial mesh',
  },
  {
    id: 'starfield',
    name: 'Starfield',
    description: 'Subtle drifting particles',
  },
];

export const ANIMATED_PRESET_IDS = ANIMATED_BACKGROUND_PRESETS.map((p) => p.id);

export function getLayoutCatalog() {
  return LAYOUT_TEMPLATES;
}

export function getAnimatedPresetCatalog() {
  return ANIMATED_BACKGROUND_PRESETS;
}
