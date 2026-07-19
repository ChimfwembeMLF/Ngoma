import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class InitiateTipDto {
  @IsUUID()
  artistId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @ValidateIf((o) => !o.operatorId)
  @IsString()
  @IsNotEmpty()
  provider?: string;

  @ValidateIf((o) => !o.provider)
  @IsString()
  @IsNotEmpty()
  operatorId?: string;

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @IsOptional()
  @IsUUID()
  trackId?: string;
}
