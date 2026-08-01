import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TekremAccountLink } from './entities/tekrem-account-link.entity';
import { MakoPromotionCampaign } from './entities/mako-promotion-campaign.entity';
import { SmartLinkAttribution } from './entities/smart-link-attribution.entity';
import { FanSegment } from './entities/fan-segment.entity';
import { MakoHttpService } from './mako-http.service';
import { MarketingIntegrationService } from './marketing-integration.service';
import { MarketingIntegrationController } from './marketing-integration.controller';
import { SmartLinksService } from './smart-links.service';
import { SmartLinksController } from './smart-links.controller';
import { RoiAnalyticsService } from './roi-analytics.service';
import { FanSegmentationService } from './fan-segmentation.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      TekremAccountLink,
      MakoPromotionCampaign,
      SmartLinkAttribution,
      FanSegment,
    ]),
  ],
  controllers: [MarketingIntegrationController, SmartLinksController],
  providers: [
    MakoHttpService,
    MarketingIntegrationService,
    SmartLinksService,
    RoiAnalyticsService,
    FanSegmentationService,
  ],
  exports: [
    MakoHttpService,
    MarketingIntegrationService,
    SmartLinksService,
    RoiAnalyticsService,
    FanSegmentationService,
    TypeOrmModule,
  ],
})
export class MarketingIntegrationModule {}
