import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSmartLinkDto {
  @ApiProperty({ description: 'UUID of the music release being promoted' })
  @IsNotEmpty()
  @IsUUID()
  releaseId: string;

  @ApiProperty({ description: 'UUID of the parent Mako promotional campaign' })
  @IsNotEmpty()
  @IsUUID()
  campaignId: string;

  @ApiProperty({ description: 'Optional custom URL handle alias', required: false })
  @IsOptional()
  @IsString()
  customSlug?: string;

  @ApiProperty({ description: 'Optional initial referral marketing channel', required: false })
  @IsOptional()
  @IsString()
  referralChannel?: string;
}
