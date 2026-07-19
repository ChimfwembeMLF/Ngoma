import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestPayoutDto {
  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: '260977123456' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'zm-mtn' })
  @IsString()
  operatorId: string;

  @ApiPropertyOptional({ example: 'MTN_MOMO_ZMB', deprecated: true })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 'ZM' })
  @IsOptional()
  @IsString()
  countryId?: string;
}

export class ProcessPayoutDto {
  @ApiProperty({ enum: ['approve', 'reject'] })
  @IsString()
  action: 'approve' | 'reject';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
