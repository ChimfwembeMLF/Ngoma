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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { UpdateBrandingDto } from '../platform/dto/update-branding.dto';
import { ProcessPayoutDto } from '../payouts/dto/request-payout.dto';
import {
  ApplyBrandingTemplateDto,
  SaveBrandingTemplateDto,
} from '../platform/dto/apply-branding-template.dto';
import type { BrandingConfig } from '../../common/branding.defaults';

@ApiTags('Admin')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Platform overview dashboard' })
  getDashboard() {
    return this.admin.getAdminDashboard();
  }

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

  @Get('settings/branding')
  @ApiOperation({ summary: 'Get platform branding settings' })
  getBranding() {
    return this.admin.getAdminBranding();
  }

  @Put('settings/branding')
  @ApiOperation({ summary: 'Update platform branding' })
  updateBranding(@Body() dto: UpdateBrandingDto) {
    return this.admin.updateBranding(dto as Partial<BrandingConfig>);
  }

  @Post('settings/branding/logo')
  @ApiOperation({ summary: 'Upload platform logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadLogo(@UploadedFile() file: Express.Multer.File) {
    return this.admin.uploadLogo(file);
  }

  @Delete('settings/branding/logo')
  @ApiOperation({ summary: 'Remove platform logo' })
  removeLogo() {
    return this.admin.removeLogo();
  }

  @Post('settings/branding/background-image')
  @ApiOperation({ summary: 'Upload background image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadBackgroundImage(@UploadedFile() file: Express.Multer.File) {
    return this.admin.uploadBackgroundImage(file);
  }

  @Post('settings/branding/templates/apply')
  @ApiOperation({ summary: 'Apply a branding template' })
  applyBrandingTemplate(@Body() dto: ApplyBrandingTemplateDto) {
    return this.admin.applyBrandingTemplate(dto.templateId, dto.source);
  }

  @Post('settings/branding/templates/save')
  @ApiOperation({ summary: 'Save current branding as template' })
  saveBrandingTemplate(@Body() dto: SaveBrandingTemplateDto) {
    return this.admin.saveBrandingTemplate(dto.name);
  }

  @Delete('settings/branding/templates/:id')
  @ApiOperation({ summary: 'Delete saved branding template' })
  deleteBrandingTemplate(@Param('id') id: string) {
    return this.admin.deleteSavedBrandingTemplate(id);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'List payout requests' })
  listPayouts(@Query('status') status?: string) {
    return this.admin.listPayouts(status);
  }

  @Put('payouts/:id')
  @ApiOperation({ summary: 'Approve or reject a payout' })
  processPayout(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: ProcessPayoutDto,
  ) {
    return this.admin.processPayout(id, req.user?.['sub'] as string, dto);
  }
}
