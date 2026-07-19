import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../tracks/entities/track.entity';

function sanitizeFtsQuery(q: string): string {
  return q
    .trim()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
  ) {}

  async trending(limit = 20) {
    const items = await this.tracksRepo
      .createQueryBuilder('track')
      .innerJoinAndSelect('track.artist', 'artist')
      .where('track.is_published = true')
      .andWhere('track.is_active = true')
      .orderBy('track.plays', 'DESC')
      .take(Math.min(limit, 50))
      .getMany();

    return { success: true, data: items.map((t) => this.toItem(t)) };
  }

  async newReleases(limit = 20) {
    const items = await this.tracksRepo
      .createQueryBuilder('track')
      .innerJoinAndSelect('track.artist', 'artist')
      .where('track.is_published = true')
      .andWhere('track.is_active = true')
      .orderBy('COALESCE(track.release_date, track.created_at)', 'DESC')
      .take(Math.min(limit, 50))
      .getMany();

    return { success: true, data: items.map((t) => this.toItem(t)) };
  }

  async search(q: string, limit = 20, offset = 0) {
    const sanitized = sanitizeFtsQuery(q);
    if (!sanitized) {
      throw new BadRequestException('Search query is required');
    }

    const items = await this.tracksRepo
      .createQueryBuilder('track')
      .innerJoinAndSelect('track.artist', 'artist')
      .where('track.is_published = true')
      .andWhere('track.is_active = true')
      .andWhere(`track.search_vector @@ plainto_tsquery('english', :q)`, { q: sanitized })
      .orderBy(`ts_rank(track.search_vector, plainto_tsquery('english', :q))`, 'DESC')
      .skip(offset)
      .take(Math.min(limit, 50))
      .getMany();

    return { success: true, data: items.map((t) => this.toItem(t)) };
  }

  private toItem(track: Track & { artist?: { artistName: string } }) {
    return {
      id: track.id,
      title: track.title,
      artistName: track.artist?.artistName,
      artistId: track.artistId,
      coverArtUrl: track.coverArtUrl,
      price: track.price ? Number(track.price) : null,
      pricingType: track.pricingType,
      genre: track.genre,
      duration: track.duration,
    };
  }
}
