import { Controller, ForbiddenException, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { AnalyticsService } from './analytics.service';
import { EarningsTimelineQueryDto } from './dto/earnings-timeline.dto';

@ApiTags('Analytics')
@Controller('api/v1/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ARTIST)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Artist analytics dashboard summary and top tracks' })
  getDashboard(@Req() req: Request) {
    return this.analytics.getDashboard(this.resolveArtistId(req));
  }

  @Get('earnings/timeline')
  @ApiOperation({ summary: 'Daily net earnings timeline' })
  getEarningsTimeline(@Req() req: Request, @Query() query: EarningsTimelineQueryDto) {
    const days = query.days ?? 30;
    return this.analytics.getEarningsTimeline(this.resolveArtistId(req), days);
  }

  private resolveArtistId(req: Request): string {
    const artistId = req.user?.['artistId'] as string | undefined;
    if (!artistId) {
      throw new ForbiddenException('Artist profile required for analytics');
    }
    return artistId;
  }
}
