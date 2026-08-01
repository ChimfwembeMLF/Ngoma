import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { TekremOidcService } from './tekrem-oidc.service';
import { TekremCallbackDto } from './dto/tekrem-callback.dto';

@ApiTags('Auth')
@Controller('api/v1/auth/tekrem')
export class TekremOidcController {
  constructor(private readonly tekremOidcService: TekremOidcService) {}

  @Post('callback')
  @ApiOperation({ summary: 'Process OpenID Connect callback from Tekrem ID and issue session token' })
  @ApiResponse({ status: 200, description: 'Successful authentication via Tekrem SSO' })
  async handleCallback(@Body() dto: TekremCallbackDto) {
    return this.tekremOidcService.handleOidcCallback(dto);
  }
}
