import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { S3StorageService } from './s3-storage.service';

@Module({
  providers: [MediaService, S3StorageService],
  controllers: [MediaController],
  exports: [MediaService, S3StorageService],
})
export class MediaModule {}
