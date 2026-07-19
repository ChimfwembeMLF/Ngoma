import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PlaylistsModule } from '../playlists/playlists.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PlaylistsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
