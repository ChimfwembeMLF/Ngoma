import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { PricingType } from '../entities/track.entity';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  albumId?: string;

  @IsEnum(PricingType)
  pricingType: PricingType;

  @ValidateIf((o) => o.pricingType === PricingType.SET_PRICE)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price?: number;

  @ValidateIf((o) => o.pricingType === PricingType.PAY_WHAT_YOU_WANT)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  minPrice?: number;
}
