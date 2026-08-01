import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SmartLinksService } from './smart-links.service';
import { CreateSmartLinkDto } from './dto/create-smart-link.dto';

@ApiTags('Marketing')
@Controller('api/v1/marketing/smart-links')
export class SmartLinksController {
  constructor(private readonly smartLinksService: SmartLinksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Generate a new traceable smart promotional link for an artist release' })
  @ApiResponse({ status: 201, description: 'Smart link created successfully' })
  async createLink(@Body() dto: CreateSmartLinkDto) {
    return this.smartLinksService.createSmartLink(dto);
  }

  @Get(':slug')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Record visitor referral attribution and output release redirect URI' })
  @ApiResponse({ status: 200, description: 'Referral attributed and redirect target provided' })
  async visitLink(@Param('slug') slug: string, @Query('ref') ref?: string) {
    return this.smartLinksService.trackVisit(slug, ref);
  }
}
