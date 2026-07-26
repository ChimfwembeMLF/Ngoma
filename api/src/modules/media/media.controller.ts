import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('api/v1/media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload cover art image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() _req: Request) {
    const url = await this.media.saveImage(file);
    return { success: true, data: { url } };
  }

  @Get('proxy')
  @ApiOperation({ summary: 'Proxy media images from S3 or local storage' })
  async proxyMedia(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      return res.status(400).send('Missing url parameter');
    }
    try {
      const { stream, contentType } = await this.media.openReadStream(url);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      stream.pipe(res);
    } catch (error) {
      return res.status(404).send('Image not found');
    }
  }
}
