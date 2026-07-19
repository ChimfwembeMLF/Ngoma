import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Videos')
@Controller('api/v1/videos')
export class VideosController {
  constructor(private readonly videos: VideosService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List own videos including drafts' })
  mine(@Req() req: Request) {
    return this.videos.findMine(req.user?.['artistId'] as string);
  }

  @Get(':id/stream')
  @ApiOperation({ summary: 'Stream published video' })
  stream(@Param('id') id: string) {
    return this.videos.stream(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get published video detail' })
  getOne(@Param('id') id: string) {
    return this.videos.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create draft video' })
  create(@Req() req: Request, @Body() dto: CreateVideoDto) {
    return this.videos.create(req.user?.['artistId'] as string, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update video metadata or publish' })
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateVideoDto) {
    return this.videos.update(req.user?.['artistId'] as string, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete video' })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.videos.softDelete(req.user?.['artistId'] as string, id);
  }

  @Post(':id/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video file and optional thumbnail' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  upload(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    const durationHeader = req.headers['x-video-duration'];
    const duration =
      typeof durationHeader === 'string' ? Number(durationHeader) : undefined;
    return this.videos.uploadFiles(
      req.user?.['artistId'] as string,
      id,
      files.video?.[0],
      files.thumbnail?.[0],
      Number.isFinite(duration) ? duration : undefined,
    );
  }
}
