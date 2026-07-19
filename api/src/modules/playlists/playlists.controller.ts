import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddPlaylistTrackDto } from './dto/add-playlist-track.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@ApiTags('Playlists')
@Controller('api/v1/playlists')
export class PlaylistsController {
  constructor(private readonly playlists: PlaylistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a playlist' })
  create(@Req() req: Request, @Body() dto: CreatePlaylistDto) {
    return this.playlists.create(req.user!['sub'] as string, dto);
  }

  @Get('curated')
  @ApiOperation({ summary: 'List curated public playlists' })
  findCurated() {
    return this.playlists.findCurated();
  }

  @Get('share/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get playlist detail by share slug' })
  findBySlug(@Param('slug') slug: string, @Req() req: Request) {
    const userId = req.user?.['sub'] as string | undefined;
    return this.playlists.findBySlug(slug, userId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my playlists' })
  findMine(@Req() req: Request) {
    return this.playlists.findMine(req.user!['sub'] as string);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get playlist detail (public or owner)' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.['sub'] as string | undefined;
    return this.playlists.findOne(id, userId);
  }

  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ensure share slug and return share URL (owner, public only)' })
  ensureShareLink(@Req() req: Request, @Param('id') id: string) {
    return this.playlists.ensureShareLink(req.user!['sub'] as string, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own playlist' })
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdatePlaylistDto) {
    return this.playlists.update(req.user!['sub'] as string, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own playlist' })
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.playlists.delete(req.user!['sub'] as string, id);
  }

  @Post(':id/tracks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add track to playlist' })
  addTrack(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AddPlaylistTrackDto,
  ) {
    return this.playlists.addTrack(req.user!['sub'] as string, id, dto.trackId);
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from playlist' })
  removeTrack(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ) {
    return this.playlists.removeTrack(req.user!['sub'] as string, id, trackId);
  }
}
