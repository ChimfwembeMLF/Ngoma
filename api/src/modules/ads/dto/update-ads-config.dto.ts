import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateAdsConfigDto {
  @IsOptional()
  @IsBoolean()
  adsEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(60)
  gateSeconds?: number;

  @IsOptional()
  @IsBoolean()
  googleAdsEnabled?: boolean;
}
