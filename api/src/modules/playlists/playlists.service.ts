import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { PlaylistTrack } from './entities/playlist-track.entity';
import { Track } from '../tracks/entities/track.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { CreateCuratedPlaylistDto } from './dto/create-curated-playlist.dto';
import { UpdateCuratedPlaylistDto } from './dto/update-curated-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistsRepo: Repository<Playlist>,
    @InjectRepository(PlaylistTrack)
    private readonly playlistTracksRepo: Repository<PlaylistTrack>,
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
    private readonly config: ConfigService,
  ) {}

  async create(userId: string, dto: CreatePlaylistDto) {
    this.assertUserPlaylistFields(dto);

    const playlist = this.playlistsRepo.create({
      userId,
      name: dto.name.trim(),
      description: dto.description?.trim() || undefined,
      isPublic: dto.isPublic ?? true,
      isCurated: false,
    });
    const saved = await this.playlistsRepo.save(playlist);
    return { success: true, data: saved };
  }

  async findMine(userId: string) {
    const playlists = await this.playlistsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const data = await Promise.all(
      playlists.map(async (playlist) => {
        const trackCount = await this.playlistTracksRepo.count({
          where: { playlistId: playlist.id },
        });
        return {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description ?? null,
          isPublic: playlist.isPublic,
          trackCount,
          createdAt: playlist.createdAt,
        };
      }),
    );

    return { success: true, data };
  }

  async findCurated() {
    const playlists = await this.playlistsRepo.find({
      where: { isCurated: true, isPublic: true },
      order: { createdAt: 'DESC' },
    });

    const data = await Promise.all(
      playlists.map(async (playlist) => this.toCuratedSummary(playlist)),
    );

    return { success: true, data };
  }

  async listCuratedAdmin() {
    const playlists = await this.playlistsRepo.find({
      where: { isCurated: true },
      order: { createdAt: 'DESC' },
    });

    const data = await Promise.all(
      playlists.map(async (playlist) => ({
        ...(await this.toCuratedSummary(playlist)),
        isPublic: playlist.isPublic,
      })),
    );

    return { success: true, data };
  }

  async findBySlug(slug: string, userId?: string) {
    const playlist = await this.playlistsRepo.findOne({ where: { shareSlug: slug } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return this.findOne(playlist.id, userId);
  }

  async findOne(id: string, userId?: string) {
    const playlist = await this.playlistsRepo.findOne({ where: { id } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const isOwner = !!userId && playlist.userId === userId;
    if (!playlist.isPublic && !isOwner) {
      throw new ForbiddenException('This playlist is private');
    }

    const rows = await this.playlistTracksRepo
      .createQueryBuilder('pt')
      .innerJoinAndSelect('pt.track', 'track')
      .innerJoinAndSelect('track.artist', 'artist')
      .where('pt.playlist_id = :id', { id })
      .orderBy('pt.position', 'ASC', 'NULLS LAST')
      .addOrderBy('pt.added_at', 'ASC')
      .getMany();

    return {
      success: true,
      data: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description ?? null,
        isPublic: playlist.isPublic,
        isCurated: playlist.isCurated,
        shareSlug: playlist.shareSlug ?? null,
        isOwner,
        tracks: rows.map((row) => ({
          trackId: row.trackId,
          title: row.track.title,
          artistName: row.track.artist?.artistName ?? '',
          duration: row.track.duration,
          coverArtUrl: row.track.coverArtUrl ?? null,
          position: row.position ?? 0,
        })),
      },
    };
  }

  async ensureShareLink(userId: string, playlistId: string) {
    const playlist = await this.getOwnedPlaylist(userId, playlistId);
    if (!playlist.isPublic) {
      throw new ForbiddenException('Only public playlists can be shared');
    }

    const shareSlug = await this.ensureShareSlug(playlist);
    return {
      success: true,
      data: {
        shareSlug,
        shareUrl: this.buildShareUrl(shareSlug),
      },
    };
  }

  async update(userId: string, id: string, dto: UpdatePlaylistDto) {
    this.assertUserPlaylistFields(dto);

    const playlist = await this.getOwnedPlaylist(userId, id);
    if (playlist.isCurated) {
      throw new ForbiddenException('Curated playlists are managed by admin');
    }

    if (dto.name !== undefined) playlist.name = dto.name.trim();
    if (dto.description !== undefined) {
      playlist.description = dto.description.trim() || undefined;
    }
    if (dto.isPublic !== undefined) playlist.isPublic = dto.isPublic;

    const saved = await this.playlistsRepo.save(playlist);
    return { success: true, data: saved };
  }

  async delete(userId: string, id: string) {
    const playlist = await this.getOwnedPlaylist(userId, id);
    if (playlist.isCurated) {
      throw new ForbiddenException('Curated playlists are managed by admin');
    }
    await this.playlistsRepo.remove(playlist);
    return { success: true, data: { deleted: true } };
  }

  async createCurated(adminUserId: string, dto: CreateCuratedPlaylistDto) {
    const shareSlug = await this.generateShareSlug(dto.name);
    const playlist = this.playlistsRepo.create({
      userId: adminUserId,
      name: dto.name.trim(),
      description: dto.description?.trim() || undefined,
      isPublic: true,
      isCurated: true,
      shareSlug,
    });
    const saved = await this.playlistsRepo.save(playlist);
    return { success: true, data: saved };
  }

  async updateCurated(id: string, dto: UpdateCuratedPlaylistDto) {
    const playlist = await this.getCuratedPlaylist(id);

    if (dto.name !== undefined) playlist.name = dto.name.trim();
    if (dto.description !== undefined) {
      playlist.description = dto.description.trim() || undefined;
    }

    const saved = await this.playlistsRepo.save(playlist);
    return { success: true, data: saved };
  }

  async deleteCurated(id: string) {
    const playlist = await this.getCuratedPlaylist(id);
    await this.playlistsRepo.remove(playlist);
    return { success: true, data: { deleted: true } };
  }

  async addTrack(userId: string, playlistId: string, trackId: string) {
    await this.getOwnedPlaylist(userId, playlistId);
    return this.addTrackInternal(playlistId, trackId);
  }

  async addCuratedTrack(playlistId: string, trackId: string) {
    await this.getCuratedPlaylist(playlistId);
    return this.addTrackInternal(playlistId, trackId);
  }

  async removeTrack(userId: string, playlistId: string, trackId: string) {
    await this.getOwnedPlaylist(userId, playlistId);
    return this.removeTrackInternal(playlistId, trackId);
  }

  async removeCuratedTrack(playlistId: string, trackId: string) {
    await this.getCuratedPlaylist(playlistId);
    return this.removeTrackInternal(playlistId, trackId);
  }

  private async addTrackInternal(playlistId: string, trackId: string) {
    const track = await this.tracksRepo.findOne({ where: { id: trackId } });
    if (!track || !track.isPublished || !track.isActive) {
      throw new NotFoundException('Track not found or unavailable');
    }

    const existing = await this.playlistTracksRepo.findOne({
      where: { playlistId, trackId },
    });
    if (existing) {
      throw new BadRequestException('Track already in playlist');
    }

    const maxResult = await this.playlistTracksRepo
      .createQueryBuilder('pt')
      .select('MAX(pt.position)', 'max')
      .where('pt.playlist_id = :playlistId', { playlistId })
      .getRawOne<{ max: string | null }>();

    const nextPosition = (maxResult?.max != null ? Number(maxResult.max) : -1) + 1;

    try {
      const row = this.playlistTracksRepo.create({
        playlistId,
        trackId,
        position: nextPosition,
      });
      await this.playlistTracksRepo.save(row);
      return { success: true, data: { trackId, position: nextPosition } };
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === '23505') {
        throw new BadRequestException('Track already in playlist');
      }
      throw err;
    }
  }

  private async removeTrackInternal(playlistId: string, trackId: string) {
    const row = await this.playlistTracksRepo.findOne({
      where: { playlistId, trackId },
    });
    if (!row) {
      throw new NotFoundException('Track not in playlist');
    }

    await this.playlistTracksRepo.remove(row);
    return { success: true, data: { removed: true } };
  }

  private async toCuratedSummary(playlist: Playlist) {
    const trackCount = await this.playlistTracksRepo.count({
      where: { playlistId: playlist.id },
    });
    return {
      id: playlist.id,
      name: playlist.name,
      shareSlug: playlist.shareSlug ?? null,
      trackCount,
      coverArtUrl: playlist.coverArtUrl ?? null,
      isCurated: true as const,
    };
  }

  private buildShareUrl(shareSlug: string) {
    const origin =
      this.config.get<string>('FRONTEND_URL')?.replace(/\/$/, '') ||
      'http://localhost:5173';
    return `${origin}/playlists/share/${shareSlug}`;
  }

  private slugifyName(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    return slug.length >= 3 ? slug : 'playlist';
  }

  private randomSuffix(): string {
    return Math.random().toString(36).slice(2, 8);
  }

  private async generateShareSlug(name: string): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = `${this.slugifyName(name)}-${this.randomSuffix()}`.slice(0, 80);
      const existing = await this.playlistsRepo.findOne({ where: { shareSlug: slug } });
      if (!existing) {
        return slug;
      }
    }
    throw new BadRequestException('Could not generate unique share slug');
  }

  private async ensureShareSlug(playlist: Playlist): Promise<string> {
    if (playlist.shareSlug) {
      return playlist.shareSlug;
    }
    playlist.shareSlug = await this.generateShareSlug(playlist.name);
    await this.playlistsRepo.save(playlist);
    return playlist.shareSlug;
  }

  private assertUserPlaylistFields(dto: object) {
    const body = dto as Record<string, unknown>;
    if ('isCurated' in body && body.isCurated !== undefined) {
      throw new ForbiddenException('Cannot set isCurated on user playlists');
    }
    if ('shareSlug' in body && body.shareSlug !== undefined) {
      throw new ForbiddenException('Cannot set shareSlug on user playlists');
    }
  }

  private async getOwnedPlaylist(userId: string, playlistId: string): Promise<Playlist> {
    const playlist = await this.playlistsRepo.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }
    return playlist;
  }

  private async getCuratedPlaylist(playlistId: string): Promise<Playlist> {
    const playlist = await this.playlistsRepo.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (!playlist.isCurated) {
      throw new ForbiddenException('Not a curated playlist');
    }
    return playlist;
  }
}
