import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), TracksModule],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService, TypeOrmModule],
})
export class ArtistsModule {}
