import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformSettings } from './entities/platform-settings.entity';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformSettings])],
  providers: [PlatformService],
  controllers: [PlatformController],
  exports: [PlatformService],
})
export class PlatformModule {}
