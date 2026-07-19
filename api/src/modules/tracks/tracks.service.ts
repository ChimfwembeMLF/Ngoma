import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, existsSync } from 'fs';
import { Track, PricingType } from './entities/track.entity';
import { DownloadAccess } from './entities/download-access.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { MediaService } from '../media/media.service';
import { Artist } from '../artists/entities/artist.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
    @InjectRepository(DownloadAccess)
    private readonly accessRepo: Repository<DownloadAccess>,
    @InjectRepository(Artist)
    private readonly artistsRepo: Repository<Artist>,
    private readonly media: MediaService,
  ) {}

  async create(artistId: string, dto: CreateTrackDto) {
    const track = this.tracksRepo.create({
      artistId,
      title: dto.title,
      genre: dto.genre,
      description: dto.description,
      albumId: dto.albumId,
      pricingType: dto.pricingType,
      isDraft: true,
      isPublished: false,
    });
    this.applyPricingFields(track, dto.pricingType, dto.price, dto.minPrice);
    const saved = await this.tracksRepo.save(track);
    await this.syncSearchVector(saved.id);
    return { success: true, data: saved };
  }

  async findPublished(params: {
    limit?: number;
    offset?: number;
    genre?: string;
    search?: string;
  }) {
    const limit = Math.min(params.limit ?? 20, 100);
    const offset = params.offset ?? 0;

    const qb = this.tracksRepo
      .createQueryBuilder('track')
      .innerJoinAndSelect('track.artist', 'artist')
      .where('track.is_published = true')
      .andWhere('track.is_active = true');

    if (params.genre) {
      qb.andWhere('track.genre ILIKE :genre', { genre: `%${params.genre}%` });
    }
    if (params.search) {
      qb.andWhere(
        '(track.title ILIKE :search OR artist.artist_name ILIKE :search)',
        { search: `%${params.search}%` },
      );
    }

    const [items, total] = await qb
      .orderBy('track.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: items.map((t) => this.toPublicTrack(t)),
      pagination: { total, limit, offset },
    };
  }

  async findByArtistPublic(artistId: string) {
    const tracks = await this.tracksRepo.find({
      where: { artistId, isPublished: true, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: tracks.map((t) => this.toPublicTrack(t)) };
  }

  async findMine(artistId: string) {
    const tracks = await this.tracksRepo.find({
      where: { artistId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: tracks };
  }

  async findOne(id: string, allowDraft = false) {
    const track = await this.tracksRepo.findOne({
      where: { id, isActive: true },
      relations: ['artist'],
    });
    if (!track) throw new NotFoundException('Track not found');
    if (!allowDraft && !track.isPublished) {
      throw new NotFoundException('Track not found');
    }
    return { success: true, data: this.toPublicTrack(track) };
  }

  async update(artistId: string, id: string, dto: UpdateTrackDto) {
    const track = await this.getOwnedTrack(artistId, id);
    const { pricingType, price, minPrice, ...rest } = dto;
    Object.assign(track, rest);
    if (pricingType != null) {
      this.applyPricingFields(track, pricingType, price, minPrice);
    } else if (price != null && track.pricingType === PricingType.SET_PRICE) {
      track.price = String(price);
    } else if (minPrice != null && track.pricingType === PricingType.PAY_WHAT_YOU_WANT) {
      track.minPrice = String(minPrice);
    }
    if (dto.isPublished === true) {
      if (!track.audioFileUrl) {
        throw new ForbiddenException('Upload audio before publishing');
      }
      if (track.pricingType === PricingType.PAY_WHAT_YOU_WANT && !track.minPrice) {
        throw new ForbiddenException('Set minimum price before publishing PWYW track');
      }
      track.isDraft = false;
      track.isPublished = true;
      track.releaseDate = new Date().toISOString().slice(0, 10);
    } else if (dto.isPublished === false) {
      track.isPublished = false;
    }
    const saved = await this.tracksRepo.save(track);
    await this.syncSearchVector(saved.id);
    return { success: true, data: saved };
  }

  async softDelete(artistId: string, id: string) {
    const track = await this.getOwnedTrack(artistId, id);
    track.isActive = false;
    await this.tracksRepo.save(track);
    return { success: true, data: { deleted: true } };
  }

  async uploadFiles(
    artistId: string,
    id: string,
    audio?: Express.Multer.File,
    coverArt?: Express.Multer.File,
  ) {
    const track = await this.getOwnedTrack(artistId, id);
    if (audio) {
      const audioResult = await this.media.saveAudio(audio);
      track.audioFileUrl = audioResult.url;
      if (audioResult.duration != null) {
        track.duration = audioResult.duration;
      }
    }
    if (coverArt) {
      track.coverArtUrl = await this.media.saveImage(coverArt);
    }
    const saved = await this.tracksRepo.save(track);
    await this.syncSearchVector(saved.id);
    return { success: true, data: saved };
  }

  async stream(id: string, _userId?: string) {
    const track = await this.tracksRepo.findOne({ where: { id, isActive: true } });
    if (!track || !track.isPublished) throw new NotFoundException('Track not found');
    if (!track.audioFileUrl) throw new NotFoundException('Audio not available');

    await this.tracksRepo.increment({ id }, 'plays', 1);
    await this.artistsRepo.increment({ id: track.artistId }, 'totalPlays', 1);

    return this.fileStream(track.audioFileUrl, 'audio/mpeg');
  }

  async download(id: string, userId: string) {
    const track = await this.tracksRepo.findOne({ where: { id, isActive: true } });
    if (!track || !track.isPublished) throw new NotFoundException('Track not found');
    if (!track.audioFileUrl) throw new NotFoundException('Audio not available');

    if (track.pricingType !== PricingType.FREE) {
      const access = await this.accessRepo.findOne({
        where: { userId, trackId: id },
      });
      if (!access || (access.expiresAt && access.expiresAt < new Date())) {
        throw new ForbiddenException('Purchase required to download');
      }
      access.downloadCount += 1;
      await this.accessRepo.save(access);
    }

    await this.tracksRepo.increment({ id }, 'downloads', 1);
    await this.artistsRepo.increment({ id: track.artistId }, 'totalDownloads', 1);

    return this.fileStream(track.audioFileUrl, 'audio/mpeg', `${track.title}.mp3`);
  }

  async hasDownloadAccess(userId: string, trackId: string): Promise<boolean> {
    const track = await this.tracksRepo.findOne({ where: { id: trackId } });
    if (!track) return false;
    if (track.pricingType === PricingType.FREE) return true;
    const access = await this.accessRepo.findOne({ where: { userId, trackId } });
    if (!access) return false;
    if (access.expiresAt && access.expiresAt < new Date()) return false;
    return true;
  }

  async syncSearchVector(trackId: string) {
    await this.tracksRepo.query(
      `
      UPDATE tracks t
      SET search_vector = to_tsvector(
        'english',
        coalesce(t.title, '') || ' ' || coalesce(t.genre, '') || ' ' || coalesce(a.artist_name, '')
      )
      FROM artists a
      WHERE t.id = $1 AND t.artist_id = a.id
      `,
      [trackId],
    );
  }

  private async getOwnedTrack(artistId: string, id: string) {
    const track = await this.tracksRepo.findOne({ where: { id, artistId, isActive: true } });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  private fileStream(url: string, type: string, filename?: string) {
    const path = this.media.resolvePath(url);
    if (!existsSync(path)) throw new NotFoundException('File not found');
    const stream = createReadStream(path);
    const headers: Record<string, string> = { 'Content-Type': type };
    if (filename) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }
    return new StreamableFile(stream, { type, disposition: headers['Content-Disposition'] });
  }

  private applyPricingFields(
    track: Track,
    pricingType: PricingType,
    price?: number,
    minPrice?: number,
  ) {
    track.pricingType = pricingType;
    if (pricingType === PricingType.SET_PRICE) {
      track.price = price != null ? String(price) : track.price;
      track.minPrice = undefined;
    } else if (pricingType === PricingType.PAY_WHAT_YOU_WANT) {
      track.price = undefined;
      track.minPrice = minPrice != null ? String(minPrice) : track.minPrice;
    } else {
      track.price = undefined;
      track.minPrice = undefined;
    }
  }

  private toPublicTrack(track: Track & { artist?: Artist }) {
    return {
      id: track.id,
      title: track.title,
      description: track.description,
      genre: track.genre,
      pricingType: track.pricingType,
      price: track.price ? Number(track.price) : null,
      minPrice: track.minPrice ? Number(track.minPrice) : null,
      coverArtUrl: track.coverArtUrl,
      duration: track.duration,
      artistId: track.artistId,
      artistName: track.artist?.artistName,
      plays: Number(track.plays),
      downloads: Number(track.downloads),
      isPublished: track.isPublished,
      releaseDate: track.releaseDate,
    };
  }
}
