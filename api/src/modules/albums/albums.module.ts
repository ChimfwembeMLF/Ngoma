import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  providers: [AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsService, TypeOrmModule],
})
export class AlbumsModule {}
