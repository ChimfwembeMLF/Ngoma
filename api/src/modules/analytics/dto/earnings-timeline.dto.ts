import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class EarningsTimelineQueryDto {
  @ApiPropertyOptional({ default: 30, minimum: 7, maximum: 90 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(7)
  @Max(90)
  days?: number = 30;
}

export class EarningsTimelineBucketDto {
  @ApiProperty({ example: '2026-07-18' })
  date: string;

  @ApiProperty()
  netEarnings: number;
}

export class EarningsTimelineDataDto {
  @ApiProperty()
  days: number;

  @ApiProperty()
  totalNetEarnings: number;

  @ApiProperty({ type: [EarningsTimelineBucketDto] })
  buckets: EarningsTimelineBucketDto[];
}
