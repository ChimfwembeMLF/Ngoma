import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoiFilterDto {
  @ApiProperty({ description: 'Optional release UUID filter', required: false })
  @IsOptional()
  @IsUUID()
  releaseId?: string;

  @ApiProperty({ description: 'Optional campaign UUID filter', required: false })
  @IsOptional()
  @IsUUID()
  campaignId?: string;
}
