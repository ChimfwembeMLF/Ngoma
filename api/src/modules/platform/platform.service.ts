import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  applyBrandingPatch,
  DEFAULT_BRANDING,
  MAX_SAVED_BRANDING_TEMPLATES,
  mergeBrandingConfig,
  sanitizeBrandingInput,
  type BrandingConfig,
  type SavedBrandingTemplate,
} from '../../common/branding.defaults';
import {
  findStarterTemplate,
  getStarterBrandingTemplates,
} from '../../common/branding-templates';
import {
  ANIMATED_PRESET_IDS,
  getAnimatedPresetCatalog,
  getLayoutCatalog,
} from '../../common/layout-templates';
import {
  DEFAULT_THEME,
  sanitizeThemeInput,
  type ThemeTokenKey,
} from '../../common/theme.defaults';
import {
  CUSTOM_PRESET_ID,
  getPresetCatalogMetadata,
  isSelectablePresetId,
  overridesDifferFromPreset,
  resolvePresetTokens,
  resolveThemeFromSettings,
} from '../../common/theme-presets';
import { MediaService } from '../media/media.service';
import { PlatformSettings } from './entities/platform-settings.entity';

const SETTINGS_ID = 1;

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(PlatformSettings)
    private readonly settingsRepo: Repository<PlatformSettings>,
    private readonly media: MediaService,
  ) {}

  private async getRow(): Promise<PlatformSettings> {
    let row = await this.settingsRepo.findOne({ where: { id: SETTINGS_ID } });
    if (!row) {
      row = await this.settingsRepo.save(
        this.settingsRepo.create({
          id: SETTINGS_ID,
          theme: {},
          themePresetId: 'spotify',
          branding: {},
          savedBrandingTemplates: [],
        }),
      );
    }
    if (!row.themePresetId) {
      row.themePresetId = 'spotify';
    }
    return row;
  }

  private getBrandingConfig(row: PlatformSettings): BrandingConfig {
    return mergeBrandingConfig(row.branding as Partial<BrandingConfig>);
  }

  private getSavedTemplates(row: PlatformSettings): SavedBrandingTemplate[] {
    return (row.savedBrandingTemplates ?? []) as SavedBrandingTemplate[];
  }

  private buildPublicBrandingPayload(row: PlatformSettings) {
    const branding = this.getBrandingConfig(row);
    return {
      success: true,
      data: {
        ...branding,
        updatedAt: row.updatedAt,
      },
    };
  }

  private buildAdminBrandingPayload(row: PlatformSettings) {
    return {
      success: true,
      data: {
        branding: this.getBrandingConfig(row),
        starters: getStarterBrandingTemplates(),
        saved: this.getSavedTemplates(row),
        layouts: getLayoutCatalog(),
        animatedPresets: getAnimatedPresetCatalog(),
        updatedAt: row.updatedAt,
      },
    };
  }

  async getBranding() {
    const row = await this.getRow();
    return this.buildPublicBrandingPayload(row);
  }

  async getAdminBranding() {
    const row = await this.getRow();
    return this.buildAdminBrandingPayload(row);
  }

  async updateBranding(input: Partial<BrandingConfig>) {
    const row = await this.getRow();
    const patch = sanitizeBrandingInput(input, ANIMATED_PRESET_IDS);
    const current = this.getBrandingConfig(row);
    row.branding = applyBrandingPatch(current, patch);
    await this.settingsRepo.save(row);
    return this.buildAdminBrandingPayload(row);
  }

  async uploadLogo(file: Express.Multer.File) {
    const url = await this.media.saveImage(file);
    const row = await this.getRow();
    const current = this.getBrandingConfig(row);
    row.branding = { ...current, logoUrl: url };
    await this.settingsRepo.save(row);
    return {
      success: true,
      data: {
        logoUrl: url,
        branding: this.getBrandingConfig(row),
      },
    };
  }

  async removeLogo() {
    const row = await this.getRow();
    const current = this.getBrandingConfig(row);
    row.branding = { ...current, logoUrl: null };
    await this.settingsRepo.save(row);
    return this.buildAdminBrandingPayload(row);
  }

  async uploadBackgroundImage(file: Express.Multer.File) {
    const url = await this.media.saveImage(file);
    const row = await this.getRow();
    const current = this.getBrandingConfig(row);
    row.branding = {
      ...current,
      background: {
        type: 'image',
        imageUrl: url,
        animatedId: null,
        overlayOpacity: current.background.overlayOpacity,
      },
    };
    await this.settingsRepo.save(row);
    return this.buildAdminBrandingPayload(row);
  }

  async applyBrandingTemplate(templateId: string, source: 'starter' | 'saved') {
    let themePresetId: string;
    let branding: BrandingConfig;

    if (source === 'starter') {
      const starter = findStarterTemplate(templateId);
      if (!starter) {
        throw new BadRequestException(`Unknown starter template: ${templateId}`);
      }
      themePresetId = starter.themePresetId;
      branding = mergeBrandingConfig(starter.branding);
    } else {
      const row = await this.getRow();
      const saved = this.getSavedTemplates(row).find((t) => t.id === templateId);
      if (!saved) {
        throw new BadRequestException(`Unknown saved template: ${templateId}`);
      }
      themePresetId = saved.themePresetId;
      branding = mergeBrandingConfig(saved.branding);
    }

    if (!isSelectablePresetId(themePresetId)) {
      throw new BadRequestException(`Invalid theme preset: ${themePresetId}`);
    }

    const row = await this.getRow();
    row.themePresetId = themePresetId;
    row.theme = {};
    row.branding = branding;
    await this.settingsRepo.save(row);

    return {
      success: true,
      data: {
        branding: this.getBrandingConfig(row),
        themePresetId,
      },
    };
  }

  async saveBrandingTemplate(name: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 80) {
      throw new BadRequestException('Template name must be 1–80 characters');
    }

    const row = await this.getRow();
    const saved = this.getSavedTemplates(row);

    if (saved.length >= MAX_SAVED_BRANDING_TEMPLATES) {
      throw new BadRequestException(
        `Maximum ${MAX_SAVED_BRANDING_TEMPLATES} saved templates reached`,
      );
    }

    if (saved.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new BadRequestException('A template with this name already exists');
    }

    const entry: SavedBrandingTemplate = {
      id: randomUUID(),
      name: trimmed,
      themePresetId: row.themePresetId || 'spotify',
      branding: this.getBrandingConfig(row),
      createdAt: new Date().toISOString(),
    };

    row.savedBrandingTemplates = [...saved, entry];
    await this.settingsRepo.save(row);
    return this.buildAdminBrandingPayload(row);
  }

  async deleteSavedTemplate(id: string) {
    const row = await this.getRow();
    const saved = this.getSavedTemplates(row);
    const next = saved.filter((t) => t.id !== id);
    if (next.length === saved.length) {
      throw new BadRequestException('Template not found');
    }
    row.savedBrandingTemplates = next;
    await this.settingsRepo.save(row);
    return this.buildAdminBrandingPayload(row);
  }

  private buildThemePayload(row: PlatformSettings) {
    const overrides = sanitizeThemeInput(row.theme ?? {});
    const activePresetId = row.themePresetId || 'spotify';
    const theme = resolveThemeFromSettings(activePresetId, overrides);

    return {
      success: true,
      data: {
        theme,
        activePresetId,
        presets: getPresetCatalogMetadata(),
        overrides,
        defaults: DEFAULT_THEME,
        updatedAt: row.updatedAt,
      },
    };
  }

  async getTheme() {
    const row = await this.getRow();
    return this.buildThemePayload(row);
  }

  async applyPreset(presetId: string) {
    if (!isSelectablePresetId(presetId)) {
      throw new BadRequestException(`Unknown preset: ${presetId}`);
    }
    const row = await this.getRow();
    row.themePresetId = presetId;
    row.theme = {};
    await this.settingsRepo.save(row);
    return this.buildThemePayload(row);
  }

  async updateTheme(input: {
    theme?: Record<string, string>;
    presetId?: string;
  }) {
    const row = await this.getRow();

    if (input.presetId) {
      if (!isSelectablePresetId(input.presetId)) {
        throw new BadRequestException(`Unknown preset: ${input.presetId}`);
      }
      row.themePresetId = input.presetId;
      if (!input.theme) {
        row.theme = {};
      }
    }

    if (input.theme) {
      const sanitized = sanitizeThemeInput(input.theme);
      const currentPresetId = row.themePresetId || 'spotify';

      if (input.presetId) {
        row.theme = sanitized;
      } else {
        const nextOverrides: Partial<Record<ThemeTokenKey, string>> = {
          ...(row.theme ?? {}),
          ...sanitized,
        };
        const base = resolvePresetTokens(currentPresetId);
        for (const key of Object.keys(nextOverrides) as ThemeTokenKey[]) {
          const expected = base[key] ?? DEFAULT_THEME[key];
          if (nextOverrides[key] === expected) {
            delete nextOverrides[key];
          }
        }
        row.theme = nextOverrides;
      }

      if (
        overridesDifferFromPreset(row.themePresetId, row.theme) ||
        row.themePresetId === CUSTOM_PRESET_ID
      ) {
        if (Object.keys(row.theme).length > 0) {
          row.themePresetId = CUSTOM_PRESET_ID;
        }
      }
    }

    await this.settingsRepo.save(row);
    return this.buildThemePayload(row);
  }

  async resetTheme() {
    const row = await this.getRow();
    row.themePresetId = 'spotify';
    row.theme = {};
    await this.settingsRepo.save(row);
    return this.buildThemePayload(row);
  }
}
