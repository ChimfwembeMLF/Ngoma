import { BadRequestException } from '@nestjs/common';

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

export type SavedBrandingTemplate = {
  id: string;
  name: string;
  themePresetId: string;
  branding: BrandingConfig;
  createdAt: string;
};

export const LAYOUT_TEMPLATE_IDS: LayoutTemplateId[] = ['default', 'minimal', 'hero'];

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

export const MAX_SAVED_BRANDING_TEMPLATES = 10;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function isLayoutTemplateId(value: string): value is LayoutTemplateId {
  return LAYOUT_TEMPLATE_IDS.includes(value as LayoutTemplateId);
}

export function mergeBrandingConfig(
  stored: Partial<BrandingConfig> | null | undefined,
): BrandingConfig {
  const bg = (stored?.background ?? {}) as Partial<BrandingBackground>;
  return {
    logoUrl: stored?.logoUrl ?? DEFAULT_BRANDING.logoUrl,
    logoWidth: stored?.logoWidth ?? DEFAULT_BRANDING.logoWidth,
    background: {
      type: bg.type ?? DEFAULT_BRANDING.background.type,
      imageUrl: bg.imageUrl ?? DEFAULT_BRANDING.background.imageUrl,
      animatedId: bg.animatedId ?? DEFAULT_BRANDING.background.animatedId,
      overlayOpacity:
        bg.overlayOpacity ?? DEFAULT_BRANDING.background.overlayOpacity,
    },
    layoutTemplateId: isLayoutTemplateId(stored?.layoutTemplateId ?? '')
      ? (stored!.layoutTemplateId as LayoutTemplateId)
      : DEFAULT_BRANDING.layoutTemplateId,
  };
}

export function sanitizeBrandingInput(
  input: Partial<BrandingConfig>,
  animatedIds: string[],
): Partial<BrandingConfig> {
  const result: Partial<BrandingConfig> = {};

  if (input.logoWidth !== undefined) {
    const width = Number(input.logoWidth);
    if (!Number.isFinite(width) || width < 48 || width > 320) {
      throw new BadRequestException('logoWidth must be between 48 and 320');
    }
    result.logoWidth = Math.round(width);
  }

  if (input.layoutTemplateId !== undefined) {
    if (!isLayoutTemplateId(input.layoutTemplateId)) {
      throw new BadRequestException('Invalid layoutTemplateId');
    }
    result.layoutTemplateId = input.layoutTemplateId;
  }

  if (input.background !== undefined) {
    const bg = input.background;
    const type = bg.type ?? DEFAULT_BRANDING.background.type;
    if (!['none', 'image', 'animated'].includes(type)) {
      throw new BadRequestException('Invalid background type');
    }

    let animatedId = bg.animatedId ?? null;
    if (type === 'animated') {
      if (!animatedId || !animatedIds.includes(animatedId)) {
        throw new BadRequestException('Invalid animated background preset');
      }
    } else {
      animatedId = null;
    }

    let imageUrl = bg.imageUrl ?? null;
    if (type !== 'image') {
      imageUrl = type === 'none' ? null : imageUrl;
    }

    let overlayOpacity = bg.overlayOpacity ?? DEFAULT_BRANDING.background.overlayOpacity;
    overlayOpacity = clamp(Number(overlayOpacity), 0, 0.8);

    result.background = {
      type,
      imageUrl: type === 'image' ? imageUrl : null,
      animatedId: type === 'animated' ? animatedId : null,
      overlayOpacity,
    };
  }

  return result;
}

export function applyBrandingPatch(
  current: BrandingConfig,
  patch: Partial<BrandingConfig>,
): BrandingConfig {
  return mergeBrandingConfig({
    ...current,
    ...patch,
    background: patch.background
      ? { ...current.background, ...patch.background }
      : current.background,
  });
}
