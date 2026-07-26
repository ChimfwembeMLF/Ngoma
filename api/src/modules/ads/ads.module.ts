import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformSettings } from '../platform/entities/platform-settings.entity';
import { Track } from '../tracks/entities/track.entity';
import { AdCreative } from './entities/ad-creative.entity';
import { AdSession } from './entities/ad-session.entity';
import { AdImpression } from './entities/ad-impression.entity';
import { AdsService } from './ads.service';
import { AdsController, PlatformAdsController } from './ads.controller';
import { AdminAdsController } from './admin-ads.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdCreative,
      AdSession,
      AdImpression,
      PlatformSettings,
      Track,
    ]),
  ],
  providers: [AdsService],
  controllers: [AdsController, PlatformAdsController, AdminAdsController],
  exports: [AdsService],
})
export class AdsModule {}
