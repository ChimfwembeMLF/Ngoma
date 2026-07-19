import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from '../artists/dto/update-artist-profile.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepo: Repository<Album>,
  ) {}

  create(artistId: string, dto: CreateAlbumDto) {
    return this.albumsRepo.save(
      this.albumsRepo.create({
        artistId,
        title: dto.title,
        description: dto.description,
      }),
    );
  }

  findByArtist(artistId: string) {
    return this.albumsRepo.find({
      where: { artistId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, artistId: string) {
    const album = await this.albumsRepo.findOne({ where: { id, artistId } });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }
}
