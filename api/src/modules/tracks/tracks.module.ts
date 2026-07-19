import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { DownloadAccess } from './entities/download-access.entity';
import { Artist } from '../artists/entities/artist.entity';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, DownloadAccess, Artist]),
    MediaModule,
  ],
  providers: [TracksService],
  controllers: [TracksController],
  exports: [TracksService, TypeOrmModule],
})
export class TracksModule {}
