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

export enum PayoutStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'payouts' })
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'artist_id', type: 'uuid' })
  artistId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 3, default: 'ZMW' })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: PayoutStatus.PENDING })
  status: PayoutStatus;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ name: 'pawapay_payout_id', type: 'varchar', length: 255, nullable: true })
  pawapayPayoutId?: string;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn({ name: 'requested_at', type: 'timestamptz' })
  requestedAt: Date;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt?: Date;

  @Column({ name: 'processed_by', type: 'uuid', nullable: true })
  processedBy?: string;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'processed_by' })
  processor?: User;
}
