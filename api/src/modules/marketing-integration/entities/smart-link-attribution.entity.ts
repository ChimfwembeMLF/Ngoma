import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'smart_link_attributions' })
export class SmartLinkAttribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  slug: string;

  @Column({ name: 'campaign_id', type: 'uuid' })
  campaignId: string;

  @Column({ name: 'release_id', type: 'uuid' })
  releaseId: string;

  @Column({ name: 'referral_channel', nullable: true })
  referralChannel?: string;

  @Column({ name: 'visitor_token' })
  visitorToken: string;

  @Column({ default: false })
  converted: boolean;

  @Column({ name: 'conversion_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  conversionAmount?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
