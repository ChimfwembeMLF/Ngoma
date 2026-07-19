import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscoveryService } from './discovery.service';

@ApiTags('Discovery')
@Controller('api/v1/discovery')
export class DiscoveryController {
  constructor(private readonly discovery: DiscoveryService) {}

  @Get('trending')
  @ApiOperation({ summary: 'Trending tracks' })
  trending(@Query('limit') limit?: string) {
    return this.discovery.trending(limit ? Number(limit) : 20);
  }

  @Get('new-releases')
  @ApiOperation({ summary: 'New releases' })
  newReleases(@Query('limit') limit?: string) {
    return this.discovery.newReleases(limit ? Number(limit) : 20);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tracks and artists' })
  search(
    @Query('q') q: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.discovery.search(q ?? '', limit ? Number(limit) : 20, offset ? Number(offset) : 0);
  }
}
