import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ArtistsService } from './artists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { UpdateArtistProfileDto } from './dto/update-artist-profile.dto';
import { TracksService } from '../tracks/tracks.service';

@ApiTags('Artists')
@Controller('api/v1/artists')
export class ArtistsController {
  constructor(
    private readonly artists: ArtistsService,
    private readonly tracks: TracksService,
  ) {}

  @Put('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own artist profile' })
  async updateProfile(@Req() req: Request, @Body() dto: UpdateArtistProfileDto) {
    const artist = await this.artists.updateProfile(req.user?.['sub'] as string, dto);
    return { success: true, data: artist };
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Public published tracks for artist' })
  artistTracks(@Param('id') id: string) {
    return this.tracks.findByArtistPublic(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public artist profile' })
  async getOne(@Param('id') id: string) {
    const artist = await this.artists.findById(id);
    return { success: true, data: artist };
  }
}
