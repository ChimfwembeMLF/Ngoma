import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PaymentPurpose } from '../entities/payment.entity';

export class InitiatePaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsEnum(PaymentPurpose)
  purpose: PaymentPurpose;

  @IsUUID()
  itemId: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
