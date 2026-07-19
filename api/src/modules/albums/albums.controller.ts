import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateAlbumDto } from '../artists/dto/update-artist-profile.dto';

@ApiTags('Albums')
@Controller('api/v1/albums')
export class AlbumsController {
  constructor(private readonly albums: AlbumsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List own albums' })
  list(@Req() req: Request) {
    const artistId = req.user?.['artistId'] as string;
    return this.albums.findByArtist(artistId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create album' })
  async create(@Req() req: Request, @Body() dto: CreateAlbumDto) {
    const artistId = req.user?.['artistId'] as string;
    const album = await this.albums.create(artistId, dto);
    return { success: true, data: album };
  }
}
