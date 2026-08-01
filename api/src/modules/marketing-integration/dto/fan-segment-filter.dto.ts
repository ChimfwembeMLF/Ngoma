import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupporterTier } from '../entities/fan-segment.entity';

export class FanSegmentFilterDto {
  @ApiProperty({ description: 'Optional preferred genre filter', required: false })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ description: 'Optional supporter classification tier filter', enum: SupporterTier, required: false })
  @IsOptional()
  @IsString()
  tier?: string;
}
