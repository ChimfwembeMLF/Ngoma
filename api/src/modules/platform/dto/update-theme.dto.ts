import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { SELECTABLE_PRESET_IDS } from '../../../common/theme-presets';

export class UpdateThemeDto {
  @ApiPropertyOptional({
    description: 'Apply preset then optionally merge theme overrides',
    example: 'ocean',
    enum: SELECTABLE_PRESET_IDS,
  })
  @IsOptional()
  @IsString()
  @IsIn(SELECTABLE_PRESET_IDS)
  presetId?: string;

  @ApiPropertyOptional({
    description: 'Partial theme token overrides (hex colors)',
    example: { primary: '#1ed760', background: '#121212' },
  })
  @IsOptional()
  @IsObject()
  theme?: Record<string, string>;
}
