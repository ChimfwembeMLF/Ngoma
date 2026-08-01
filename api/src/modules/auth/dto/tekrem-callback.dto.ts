import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TekremCallbackDto {
  @ApiProperty({ description: 'OIDC authorization code issued by Tekrem Auth' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Redirect URI used during initial authorization request' })
  @IsNotEmpty()
  @IsString()
  redirectUri: string;

  @ApiProperty({ description: 'PKCE code verifier matching the challenge string', required: false })
  @IsOptional()
  @IsString()
  codeVerifier?: string;
}
