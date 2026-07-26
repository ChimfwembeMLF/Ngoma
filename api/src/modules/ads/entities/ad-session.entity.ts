import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AdSessionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  CONSUMED = 'CONSUMED',
}

@Entity({ name: 'ad_sessions' })
export class AdSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'track_id', type: 'uuid' })
  trackId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'creative_id', type: 'uuid', nullable: true })
  creativeId?: string;

  @Column({ length: 20, default: AdSessionStatus.PENDING })
  status: AdSessionStatus;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ name: 'consumed_at', type: 'timestamptz', nullable: true })
  consumedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
