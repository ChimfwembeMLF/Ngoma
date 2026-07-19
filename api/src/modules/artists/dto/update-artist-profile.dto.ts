import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateArtistProfileDto {
  @IsOptional()
  @IsString()
  artistName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  genres?: string[];

  @IsOptional()
  socialLinks?: Record<string, string>;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
