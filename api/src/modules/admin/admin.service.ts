import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { PlaylistsService } from '../playlists/playlists.service';
import { CreateCuratedPlaylistDto } from '../playlists/dto/create-curated-playlist.dto';
import { UpdateCuratedPlaylistDto } from '../playlists/dto/update-curated-playlist.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly playlists: PlaylistsService,
  ) {}

  listUsers(limit = 50, offset = 0, role?: UserRole) {
    return this.usersRepo.findAndCount({
      where: role ? { role } : {},
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
      skip: offset,
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'isActive',
        'createdAt',
        'lastLogin',
      ],
    });
  }

  async deactivateUser(id: string, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = false;
    await this.usersRepo.save(user);
    return { success: true, data: { id, isActive: false } };
  }

  listCuratedPlaylists() {
    return this.playlists.listCuratedAdmin();
  }

  createCuratedPlaylist(adminUserId: string, dto: CreateCuratedPlaylistDto) {
    return this.playlists.createCurated(adminUserId, dto);
  }

  updateCuratedPlaylist(id: string, dto: UpdateCuratedPlaylistDto) {
    return this.playlists.updateCurated(id, dto);
  }

  deleteCuratedPlaylist(id: string) {
    return this.playlists.deleteCurated(id);
  }

  addCuratedTrack(playlistId: string, trackId: string) {
    return this.playlists.addCuratedTrack(playlistId, trackId);
  }

  removeCuratedTrack(playlistId: string, trackId: string) {
    return this.playlists.removeCuratedTrack(playlistId, trackId);
  }
}
