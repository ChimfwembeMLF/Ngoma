import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';

export enum PricingType {
  SET_PRICE = 'SET_PRICE',
  PAY_WHAT_YOU_WANT = 'PAY_WHAT_YOU_WANT',
  FREE = 'FREE',
}

@Entity({ name: 'tracks' })
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'artist_id', type: 'uuid' })
  artistId: string;

  @Column({ name: 'album_id', type: 'uuid', nullable: true })
  albumId?: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  genre: string;

  @Column({ name: 'pricing_type', type: 'varchar', length: 20, default: PricingType.SET_PRICE })
  pricingType: PricingType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: string;

  @Column({ name: 'min_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minPrice?: string;

  @Column({ name: 'audio_file_url', nullable: true })
  audioFileUrl?: string;

  @Column({ name: 'cover_art_url', nullable: true })
  coverArtUrl?: string;

  @Column({ default: 0 })
  duration: number;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'is_draft', default: true })
  isDraft: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'bigint', default: 0 })
  plays: string;

  @Column({ type: 'bigint', default: 0 })
  downloads: string;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Album, { nullable: true })
  @JoinColumn({ name: 'album_id' })
  album?: Album;
}
