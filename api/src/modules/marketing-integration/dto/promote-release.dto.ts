import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromoteReleaseDto {
  @ApiProperty({ description: 'UUID of the published song, album, or video' })
  @IsNotEmpty()
  @IsUUID()
  releaseId: string;

  @ApiProperty({ description: 'Genre category for campaign targeting in Mako' })
  @IsNotEmpty()
  @IsString()
  targetGenre: string;

  @ApiProperty({ description: 'Optional custom caption for social media posts', required: false })
  @IsOptional()
  @IsString()
  customCaption?: string;
}
