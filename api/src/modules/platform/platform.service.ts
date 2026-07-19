import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { PlatformSettings } from './entities/platform-settings.entity';

const SETTINGS_ID = 1;

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(PlatformSettings)
    private readonly settingsRepo: Repository<PlatformSettings>,
  ) {}

  private async getRow(): Promise<PlatformSettings> {
    let row = await this.settingsRepo.findOne({ where: { id: SETTINGS_ID } });
    if (!row) {
      row = await this.settingsRepo.save(
        this.settingsRepo.create({
          id: SETTINGS_ID,
          theme: {},
          themePresetId: 'spotify',
        }),
      );
    }
    if (!row.themePresetId) {
      row.themePresetId = 'spotify';
    }
    return row;
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
