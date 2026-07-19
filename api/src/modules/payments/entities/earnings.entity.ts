import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';
import { User } from '../../user/entities/user.entity';
import { Track } from '../../tracks/entities/track.entity';
import { Payment } from './payment.entity';

export enum EarningsSource {
  DOWNLOAD = 'DOWNLOAD',
  TIP = 'TIP',
}

@Entity({ name: 'earnings' })
export class Earnings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'artist_id', type: 'uuid' })
  artistId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'track_id', type: 'uuid', nullable: true })
  trackId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({ name: 'platform_fee', type: 'decimal', precision: 10, scale: 2 })
  platformFee: string;

  @Column({ type: 'varchar', length: 20, default: EarningsSource.DOWNLOAD })
  source: EarningsSource;

  @Column({ name: 'payment_id', type: 'uuid' })
  paymentId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Track)
  @JoinColumn({ name: 'track_id' })
  track: Track;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;
}
