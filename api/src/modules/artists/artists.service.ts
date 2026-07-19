import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistsRepo: Repository<Artist>,
  ) {}

  findById(id: string) {
    return this.artistsRepo.findOne({ where: { id } });
  }

  findByUserId(userId: string) {
    return this.artistsRepo.findOne({ where: { userId } });
  }

  async updateProfile(userId: string, data: Partial<Artist>) {
    const artist = await this.findByUserId(userId);
    if (!artist) throw new NotFoundException('Artist profile not found');
    Object.assign(artist, data);
    return this.artistsRepo.save(artist);
  }
}
