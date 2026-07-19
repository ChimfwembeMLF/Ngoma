import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { SELECTABLE_PRESET_IDS } from '../../../common/theme-presets';

export class ApplyThemePresetDto {
  @ApiProperty({
    description: 'Preset catalog id',
    example: 'terracotta',
    enum: SELECTABLE_PRESET_IDS,
  })
  @IsString()
  @IsIn(SELECTABLE_PRESET_IDS)
  presetId: string;
}
