import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { PricingType } from '../entities/track.entity';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  albumId?: string;

  @IsOptional()
  @IsEnum(PricingType)
  pricingType?: PricingType;

  @ValidateIf((o) => o.pricingType === PricingType.SET_PRICE)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price?: number;

  @ValidateIf((o) => o.pricingType === PricingType.PAY_WHAT_YOU_WANT)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  minPrice?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
