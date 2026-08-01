import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

export enum SupporterTier {
  CASUAL = 'CASUAL',
  FAN = 'FAN',
  VIP = 'VIP',
}

@Entity({ name: 'fan_segments' })
export class FanSegment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'artist_id', type: 'uuid' })
  artistId: string;

  @Column({ name: 'fan_user_id', type: 'uuid', nullable: true })
  fanUserId?: string;

  @Column({ name: 'contact_email', nullable: true })
  contactEmail?: string;

  @Column({ name: 'phone_contact', nullable: true })
  phoneContact?: string;

  @Column({ name: 'preferred_genre' })
  preferredGenre: string;

  @Column({ name: 'total_spent', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ name: 'interactions_count', type: 'int', default: 0 })
  interactionsCount: number;

  @Column({
    type: 'enum',
    enum: SupporterTier,
    default: SupporterTier.CASUAL,
  })
  supporterTier: SupporterTier;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
