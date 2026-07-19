import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Earnings } from './entities/earnings.entity';
import { Tip } from './entities/tip.entity';
import { DownloadAccess } from '../tracks/entities/download-access.entity';
import { Track } from '../tracks/entities/track.entity';
import { Artist } from '../artists/entities/artist.entity';
import { User } from '../user/entities/user.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TipsController } from './tips.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Earnings, Tip, DownloadAccess, Track, Artist, User]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController, TipsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
