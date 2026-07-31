import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateVideoDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  externalUrl?: string;
}
