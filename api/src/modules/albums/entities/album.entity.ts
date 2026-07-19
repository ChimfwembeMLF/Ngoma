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

export enum AlbumType {
  SINGLE = 'SINGLE',
  EP = 'EP',
  ALBUM = 'ALBUM',
}

@Entity({ name: 'albums' })
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'artist_id', type: 'uuid' })
  artistId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'cover_art_url', nullable: true })
  coverArtUrl?: string;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate?: string;

  @Column({ type: 'varchar', length: 20, default: AlbumType.SINGLE })
  type: AlbumType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}
