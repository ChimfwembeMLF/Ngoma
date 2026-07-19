import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Tracks')
@Controller('api/v1/tracks')
export class TracksController {
  constructor(private readonly tracks: TracksService) {}

  @Get()
  @ApiOperation({ summary: 'List published tracks' })
  list(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('genre') genre?: string,
    @Query('search') search?: string,
  ) {
    return this.tracks.findPublished({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      genre,
      search,
    });
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List own tracks including drafts' })
  mine(@Req() req: Request) {
    return this.tracks.findMine(req.user?.['artistId'] as string);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get track detail (optional auth for canDownload)' })
  getOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.['sub'] as string | undefined;
    return this.tracks.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create draft track' })
  create(@Req() req: Request, @Body() dto: CreateTrackDto) {
    return this.tracks.create(req.user?.['artistId'] as string, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update track metadata or publish' })
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateTrackDto) {
    return this.tracks.update(req.user?.['artistId'] as string, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete track' })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.tracks.softDelete(req.user?.['artistId'] as string, id);
  }

  @Post(':id/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload audio and optional cover art' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'coverArt', maxCount: 1 },
    ]),
  )
  upload(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles()
    files: { audio?: Express.Multer.File[]; coverArt?: Express.Multer.File[] },
  ) {
    return this.tracks.uploadFiles(
      req.user?.['artistId'] as string,
      id,
      files.audio?.[0],
      files.coverArt?.[0],
    );
  }

  @Get(':id/stream')
  @ApiOperation({ summary: 'Stream track audio' })
  stream(@Param('id') id: string, @Req() req: Request) {
    return this.tracks.stream(id, req.user?.['sub'] as string | undefined);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download track (requires access or free)' })
  download(@Param('id') id: string, @Req() req: Request) {
    return this.tracks.download(id, req.user?.['sub'] as string);
  }
}
