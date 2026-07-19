import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsSummaryDto {
  @ApiProperty()
  totalNetEarnings: number;

  @ApiProperty()
  totalPlatformFees: number;

  @ApiProperty()
  totalPlays: number;

  @ApiProperty()
  totalDownloads: number;

  @ApiProperty()
  publishedTrackCount: number;

  @ApiProperty()
  uniqueSupporters: number;

  @ApiProperty({ example: 'ZMW' })
  currency: string;
}

export class TrackAnalyticsRowDto {
  @ApiProperty()
  trackId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  plays: number;

  @ApiProperty()
  downloads: number;

  @ApiProperty()
  netEarnings: number;

  @ApiProperty()
  pricingType: string;
}

export class AnalyticsDashboardDataDto {
  @ApiProperty({ type: AnalyticsSummaryDto })
  summary: AnalyticsSummaryDto;

  @ApiProperty({ type: [TrackAnalyticsRowDto] })
  topTracks: TrackAnalyticsRowDto[];
}
