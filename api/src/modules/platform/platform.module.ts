import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { PlatformSettings } from './entities/platform-settings.entity';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformSettings]), MediaModule],
  providers: [PlatformService],
  controllers: [PlatformController],
  exports: [PlatformService],
})
export class PlatformModule {}
