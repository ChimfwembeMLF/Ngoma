export type BackgroundType = 'none' | 'image' | 'animated';
export type LayoutTemplateId = 'default' | 'minimal' | 'hero';

export type BrandingBackground = {
  type: BackgroundType;
  imageUrl: string | null;
  animatedId: string | null;
  overlayOpacity: number;
};

export type BrandingConfig = {
  logoUrl: string | null;
  logoWidth: number;
  background: BrandingBackground;
  layoutTemplateId: LayoutTemplateId;
};

export type StarterBrandingTemplate = {
  id: string;
  name: string;
  description: string;
  preview: { primary: string; accent: string };
  themePresetId: string;
  branding: BrandingConfig;
};

export type SavedBrandingTemplate = {
  id: string;
  name: string;
  themePresetId: string;
  branding: BrandingConfig;
  createdAt: string;
};

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

export const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: null,
  logoWidth: 120,
  background: {
    type: 'none',
    imageUrl: null,
    animatedId: null,
    overlayOpacity: 0.4,
  },
  layoutTemplateId: 'default',
};

export function hasActiveBackground(branding: BrandingConfig): boolean {
  return (
    branding.background.type === 'image' ||
    branding.background.type === 'animated'
  );
}
