import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ad_impressions' })
export class AdImpression {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'uuid', unique: true })
  sessionId: string;

  @Column({ name: 'track_id', type: 'uuid' })
  trackId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'creative_id', type: 'uuid', nullable: true })
  creativeId?: string;

  @CreateDateColumn({ name: 'completed_at', type: 'timestamptz' })
  completedAt: Date;
}
