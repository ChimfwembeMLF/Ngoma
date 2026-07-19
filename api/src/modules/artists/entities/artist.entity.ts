import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'artist_name' })
  artistName: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column('text', { array: true, default: '{}' })
  genres: string[];

  @Column({ name: 'social_links', type: 'jsonb', nullable: true })
  socialLinks?: Record<string, string>;

  @Column({ name: 'cover_image_url', nullable: true })
  coverImageUrl?: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'subscription_tier', default: 'STARTER' })
  subscriptionTier: string;

  @Column({ name: 'total_plays', type: 'bigint', default: 0 })
  totalPlays: string;

  @Column({ name: 'total_downloads', type: 'bigint', default: 0 })
  totalDownloads: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
