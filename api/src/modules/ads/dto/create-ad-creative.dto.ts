import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateAdCreativeDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(500)
  imageUrl: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  clickUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
