import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export enum FileType {
  AUDIO = 'audio',
  VIDEO = 'video',
  COVER = 'cover',
}

export class PresignedUrlDto {
  @ApiProperty({ enum: FileType })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty({ description: 'File extension (e.g. mp3, mp4, png)' })
  @IsString()
  @IsNotEmpty()
  extension: string;

  @ApiProperty({ description: 'MIME type (e.g. audio/mpeg)' })
  @IsString()
  @IsNotEmpty()
  contentType: string;
}
