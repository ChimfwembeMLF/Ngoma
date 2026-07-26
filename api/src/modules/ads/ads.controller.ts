import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Ads')
@Controller('api/v1/ad-sessions')
export class AdsController {
  constructor(private readonly ads: AdsService) {}

  @Post(':sessionId/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete ad gate countdown for a session' })
  complete(@Param('sessionId') sessionId: string, @Req() req: Request) {
    return this.ads.completeSession(sessionId, req.user?.['sub'] as string);
  }
}

@ApiTags('Platform')
@Controller('api/v1/platform')
export class PlatformAdsController {
  constructor(private readonly ads: AdsService) {}

  @Get('ads/config')
  @ApiOperation({ summary: 'Public ad gate configuration' })
  getAdsConfig() {
    return this.ads.getPublicConfig();
  }
}
