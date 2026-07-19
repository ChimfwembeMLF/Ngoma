import { IsEmail, IsEnum, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, { message: 'phone must be E.164 format' })
  phone: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'password must include uppercase letter and number',
  })
  password: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  country: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  @MinLength(2)
  artistName?: string;
}
