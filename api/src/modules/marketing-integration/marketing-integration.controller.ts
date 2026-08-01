import { Body, Controller, Get, Post, Query, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MarketingIntegrationService } from './marketing-integration.service';
import { RoiAnalyticsService } from './roi-analytics.service';
import { FanSegmentationService } from './fan-segmentation.service';
import { PromoteReleaseDto } from './dto/promote-release.dto';
import { RoiFilterDto } from './dto/roi-filter.dto';
import { FanSegmentFilterDto } from './dto/fan-segment-filter.dto';

@ApiTags('Marketing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/marketing')
export class MarketingIntegrationController {
  constructor(
    private readonly marketingService: MarketingIntegrationService,
    private readonly roiService: RoiAnalyticsService,
    private readonly fanSegmentationService: FanSegmentationService,
  ) {}

  @Post('promotions/prefill')
  @ApiOperation({ summary: 'Initialize one-click campaign promotion payload and deep link for Mako' })
  @ApiResponse({ status: 201, description: 'Campaign prefilled successfully' })
  async prefillPromotion(@Req() req: Request, @Body() dto: PromoteReleaseDto) {
    const artistId = req.user?.['artistId'] || req.user?.['sub'];
    if (!artistId) {
      throw new UnauthorizedException('User must have an active artist account to promote music');
    }
    return this.marketingService.prefillPromotion(artistId as string, dto);
  }

  @Get('promotions')
  @ApiOperation({ summary: 'Retrieve active promotional campaigns for current artist' })
  @ApiResponse({ status: 200, description: 'List of promotional campaigns' })
  async getPromotions(@Req() req: Request) {
    const artistId = req.user?.['artistId'] || req.user?.['sub'];
    if (!artistId) {
      throw new UnauthorizedException('User must have an active artist account to view promotions');
    }
    return this.marketingService.listArtistPromotions(artistId as string);
  }

  @Get('analytics/roi')
  @ApiOperation({ summary: 'Retrieve consolidated return on investment analytics per campaign or release' })
  @ApiResponse({ status: 200, description: 'Consolidated ROI performance report' })
  async getRoiAnalytics(@Req() req: Request, @Query() filter: RoiFilterDto) {
    const artistId = req.user?.['artistId'] || req.user?.['sub'];
    if (!artistId) {
      throw new UnauthorizedException('User must have an active artist account to inspect ROI');
    }
    return this.roiService.calculateUnifiedRoi(artistId as string, filter);
  }

  @Get('fans/segments')
  @ApiOperation({ summary: 'Retrieve categorized supporter tiers and interaction metrics for Mako CRM sync' })
  @ApiResponse({ status: 200, description: 'Categorized fan relationship roster' })
  async getFanSegments(@Req() req: Request, @Query() filter: FanSegmentFilterDto) {
    const artistId = req.user?.['artistId'] || req.user?.['sub'];
    if (!artistId) {
      throw new UnauthorizedException('User must have an active artist account to inspect fan segments');
    }
    return this.fanSegmentationService.listFanSegments(artistId as string, filter);
  }
}
