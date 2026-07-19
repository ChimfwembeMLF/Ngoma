import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { PaymentPurpose } from '../entities/payment.entity';

export class InitiatePaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @ValidateIf((o) => !o.operatorId)
  @IsString()
  @IsNotEmpty()
  provider?: string;

  @ValidateIf((o) => !o.provider)
  @IsString()
  @IsNotEmpty()
  operatorId?: string;

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsEnum(PaymentPurpose)
  purpose: PaymentPurpose;

  @IsUUID()
  itemId: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
