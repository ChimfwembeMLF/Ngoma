import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlatformService } from './platform.service';

@ApiTags('Platform')
@Controller('api/v1/platform')
export class PlatformController {
  constructor(private readonly platform: PlatformService) {}

  @Get('theme')
  @ApiOperation({ summary: 'Public platform theme (no secrets)' })
  getTheme() {
    return this.platform.getTheme();
  }

  @Get('branding')
  @ApiOperation({ summary: 'Public platform branding (logo, background, layout)' })
  getBranding() {
    return this.platform.getBranding();
  }
}
