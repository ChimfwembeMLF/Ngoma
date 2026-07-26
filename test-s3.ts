import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/src/app.module';
import { S3StorageService } from './api/src/modules/media/s3-storage.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const s3 = app.get(S3StorageService);
  const result = await s3.uploadBuffer({
    folder: 'images',
    buffer: Buffer.from('test image content'),
    contentType: 'image/jpeg',
    ext: '.jpg'
  });
  console.log('UPLOADED URL:', result.publicUrl);
  await app.close();
}
bootstrap();
