import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { LAYOUT_TEMPLATE_IDS } from '../../../common/branding.defaults';
import { ANIMATED_PRESET_IDS } from '../../../common/layout-templates';

class BrandingBackgroundDto {
  @ApiPropertyOptional({ enum: ['none', 'image', 'animated'] })
  @IsOptional()
  @IsIn(['none', 'image', 'animated'])
  type?: 'none' | 'image' | 'animated';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @ApiPropertyOptional({ enum: ANIMATED_PRESET_IDS })
  @IsOptional()
  @IsString()
  @IsIn(ANIMATED_PRESET_IDS)
  animatedId?: string | null;

  @ApiPropertyOptional({ minimum: 0, maximum: 0.8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(0.8)
  overlayOpacity?: number;
}

export class UpdateBrandingDto {
  @ApiPropertyOptional({ minimum: 48, maximum: 320 })
  @IsOptional()
  @IsNumber()
  @Min(48)
  @Max(320)
  logoWidth?: number;

  @ApiPropertyOptional({ enum: LAYOUT_TEMPLATE_IDS })
  @IsOptional()
  @IsIn(LAYOUT_TEMPLATE_IDS)
  layoutTemplateId?: 'default' | 'minimal' | 'hero';

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BrandingBackgroundDto)
  background?: BrandingBackgroundDto;
}
