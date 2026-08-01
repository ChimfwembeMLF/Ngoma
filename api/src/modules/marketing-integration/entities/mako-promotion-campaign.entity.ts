import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

@Entity({ name: 'mako_promotion_campaigns' })
export class MakoPromotionCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'artist_id', type: 'uuid' })
  artistId: string;

  @Column({ name: 'release_id', type: 'uuid' })
  releaseId: string;

  @Column({ name: 'mako_campaign_id', nullable: true, unique: true })
  makoCampaignId?: string;

  @Column({ name: 'release_title' })
  releaseTitle: string;

  @Column({ name: 'artwork_url', type: 'text' })
  artworkUrl: string;

  @Column({ name: 'target_genre' })
  targetGenre: string;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({ name: 'total_spend', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpend: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
