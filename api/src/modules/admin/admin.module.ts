import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Track } from '../tracks/entities/track.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Earnings } from '../payments/entities/earnings.entity';
import { PlaylistsModule } from '../playlists/playlists.module';
import { PlatformModule } from '../platform/platform.module';
import { PaymentsModule } from '../payments/payments.module';
import { PayoutsModule } from '../payouts/payouts.module';
import { AdsModule } from '../ads/ads.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Track, Payment, Earnings]),
    PlaylistsModule,
    PlatformModule,
    PaymentsModule,
    PayoutsModule,
    AdsModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
