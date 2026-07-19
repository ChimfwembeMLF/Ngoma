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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateCuratedPlaylistDto } from '../playlists/dto/create-curated-playlist.dto';
import { UpdateCuratedPlaylistDto } from '../playlists/dto/update-curated-playlist.dto';
import { AddPlaylistTrackDto } from '../playlists/dto/add-playlist-track.dto';
import { UpdateThemeDto } from '../platform/dto/update-theme.dto';
import { ApplyThemePresetDto } from '../platform/dto/apply-theme-preset.dto';

@ApiTags('Admin')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  async listUsers(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('role') role?: UserRole,
  ) {
    const [items, total] = await this.admin.listUsers(
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0,
      role,
    );
    return {
      success: true,
      data: items,
      pagination: {
        total,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      },
    };
  }

  @Post('users/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate user' })
  deactivate(@Param('id') id: string, @Req() req: Request) {
    return this.admin.deactivateUser(id, req.user?.['sub'] as string);
  }

  @Get('playlists/curated')
  @ApiOperation({ summary: 'List all curated playlists (admin)' })
  listCuratedPlaylists() {
    return this.admin.listCuratedPlaylists();
  }

  @Post('playlists/curated')
  @ApiOperation({ summary: 'Create curated playlist' })
  createCuratedPlaylist(@Req() req: Request, @Body() dto: CreateCuratedPlaylistDto) {
    return this.admin.createCuratedPlaylist(req.user!['sub'] as string, dto);
  }

  @Put('playlists/curated/:id')
  @ApiOperation({ summary: 'Update curated playlist' })
  updateCuratedPlaylist(@Param('id') id: string, @Body() dto: UpdateCuratedPlaylistDto) {
    return this.admin.updateCuratedPlaylist(id, dto);
  }

  @Delete('playlists/curated/:id')
  @ApiOperation({ summary: 'Delete curated playlist' })
  deleteCuratedPlaylist(@Param('id') id: string) {
    return this.admin.deleteCuratedPlaylist(id);
  }

  @Post('playlists/curated/:id/tracks')
  @ApiOperation({ summary: 'Add track to curated playlist' })
  addCuratedTrack(@Param('id') id: string, @Body() dto: AddPlaylistTrackDto) {
    return this.admin.addCuratedTrack(id, dto.trackId);
  }

  @Delete('playlists/curated/:id/tracks/:trackId')
  @ApiOperation({ summary: 'Remove track from curated playlist' })
  removeCuratedTrack(@Param('id') id: string, @Param('trackId') trackId: string) {
    return this.admin.removeCuratedTrack(id, trackId);
  }

  @Get('settings/theme')
  @ApiOperation({ summary: 'Get platform theme settings' })
  getTheme() {
    return this.admin.getTheme();
  }

  @Put('settings/theme')
  @ApiOperation({ summary: 'Update platform theme' })
  updateTheme(@Body() dto: UpdateThemeDto) {
    return this.admin.updateTheme({
      presetId: dto.presetId,
      theme: dto.theme,
    });
  }

  @Put('settings/theme/preset')
  @ApiOperation({ summary: 'Apply a theme preset swatch' })
  applyThemePreset(@Body() dto: ApplyThemePresetDto) {
    return this.admin.applyThemePreset(dto.presetId);
  }

  @Post('settings/theme/reset')
  @ApiOperation({ summary: 'Reset theme to defaults' })
  resetTheme() {
    return this.admin.resetTheme();
  }
}
