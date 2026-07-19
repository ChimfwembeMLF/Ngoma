import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { extname } from 'path';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { MediaService } from '../media/media.service';
import { Artist } from '../artists/entities/artist.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videosRepo: Repository<Video>,
    @InjectRepository(Artist)
    private readonly artistsRepo: Repository<Artist>,
    private readonly media: MediaService,
  ) {}

  async create(artistId: string, dto: CreateVideoDto) {
    const video = this.videosRepo.create({
      artistId,
      title: dto.title,
      description: dto.description,
      isDraft: true,
      isPublished: false,
    });
    const saved = await this.videosRepo.save(video);
    return { success: true, data: saved };
  }

  async findMine(artistId: string) {
    const items = await this.videosRepo.find({
      where: { artistId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: items };
  }

  async findByArtistPublic(artistId: string) {
    const items = await this.videosRepo.find({
      where: { artistId, isPublished: true, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: items.map((v) => this.toPublicVideo(v)) };
  }

  async findRecentPublic(limit = 20) {
    const items = await this.videosRepo.find({
      where: { isPublished: true, isActive: true },
      relations: ['artist'],
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 50),
    });
    return { success: true, data: items.map((v) => this.toPublicVideo(v)) };
  }

  async findOne(id: string, allowDraft = false) {
    const video = await this.videosRepo.findOne({
      where: { id, isActive: true },
      relations: ['artist'],
    });
    if (!video) throw new NotFoundException('Video not found');
    if (!allowDraft && !video.isPublished) {
      throw new NotFoundException('Video not found');
    }
    return { success: true, data: this.toPublicVideo(video) };
  }

  async update(artistId: string, id: string, dto: UpdateVideoDto) {
    const video = await this.getOwnedVideo(artistId, id);
    if (dto.title != null) video.title = dto.title;
    if (dto.description != null) video.description = dto.description;
    if (dto.isPublished === true) {
      if (!video.videoFileUrl) {
        throw new ForbiddenException('Video file required before publishing');
      }
      video.isDraft = false;
      video.isPublished = true;
    } else if (dto.isPublished === false) {
      video.isPublished = false;
      video.isDraft = true;
    }
    const saved = await this.videosRepo.save(video);
    return { success: true, data: saved };
  }

  async softDelete(artistId: string, id: string) {
    const video = await this.getOwnedVideo(artistId, id);
    video.isActive = false;
    await this.videosRepo.save(video);
    return { success: true, data: { deleted: true } };
  }

  async uploadFiles(
    artistId: string,
    id: string,
    videoFile?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
    duration?: number,
  ) {
    const video = await this.getOwnedVideo(artistId, id);
    if (videoFile) {
      const result = await this.media.saveVideo(videoFile);
      video.videoFileUrl = result.url;
      if (result.duration != null) {
        video.duration = result.duration;
      } else if (duration != null) {
        video.duration = duration;
      }
    }
    if (thumbnail) {
      video.thumbnailUrl = await this.media.saveImage(thumbnail);
    }
    const saved = await this.videosRepo.save(video);
    return { success: true, data: saved };
  }

  async stream(id: string) {
    const video = await this.videosRepo.findOne({ where: { id, isActive: true } });
    if (!video || !video.isPublished) throw new NotFoundException('Video not found');
    if (!video.videoFileUrl) throw new NotFoundException('Video not available');

    await this.videosRepo.increment({ id }, 'views', 1);

    const ext = extname(video.videoFileUrl).toLowerCase();
    const contentType = ext === '.webm' ? 'video/webm' : 'video/mp4';
    return this.fileStream(video.videoFileUrl, contentType);
  }

  private async getOwnedVideo(artistId: string, id: string) {
    const video = await this.videosRepo.findOne({ where: { id, artistId, isActive: true } });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  private async fileStream(url: string, contentType: string) {
    const media = await this.media.openReadStream(url, contentType);
    return new StreamableFile(media.stream, { type: media.contentType });
  }

  private toPublicVideo(video: Video & { artist?: Artist }) {
    return {
      id: video.id,
      title: video.title,
      description: video.description ?? null,
      thumbnailUrl: video.thumbnailUrl ?? null,
      duration: video.duration,
      artistId: video.artistId,
      artistName: video.artist?.artistName,
      isPublished: video.isPublished,
      views: Number(video.views),
      createdAt: video.createdAt,
    };
  }
}
