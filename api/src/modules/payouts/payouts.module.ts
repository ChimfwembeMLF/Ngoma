import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payout } from './entities/payout.entity';
import { Earnings } from '../payments/entities/earnings.entity';
import { ArtistsModule } from '../artists/artists.module';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payout, Earnings]),
    ArtistsModule,
  ],
  providers: [PayoutsService],
  controllers: [PayoutsController],
  exports: [PayoutsService],
})
export class PayoutsModule {}
