import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { PlaylistTrack } from './entities/playlist-track.entity';
import { Track } from '../tracks/entities/track.entity';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, PlaylistTrack, Track])],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService, TypeOrmModule],
})
export class PlaylistsModule {}
