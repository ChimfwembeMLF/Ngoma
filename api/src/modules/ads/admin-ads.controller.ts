import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateAdCreativeDto } from './dto/create-ad-creative.dto';
import { UpdateAdCreativeDto } from './dto/update-ad-creative.dto';
import { UpdateAdsConfigDto } from './dto/update-ads-config.dto';

@ApiTags('Admin')
@Controller('api/v1/admin/ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminAdsController {
  constructor(private readonly ads: AdsService) {}

  @Get('creatives')
  @ApiOperation({ summary: 'List ad creatives' })
  listCreatives() {
    return this.ads.listCreatives();
  }

  @Post('creatives')
  @ApiOperation({ summary: 'Create ad creative' })
  createCreative(@Body() dto: CreateAdCreativeDto) {
    return this.ads.createCreative(dto);
  }

  @Put('creatives/:id')
  @ApiOperation({ summary: 'Update ad creative' })
  updateCreative(@Param('id') id: string, @Body() dto: UpdateAdCreativeDto) {
    return this.ads.updateCreative(id, dto);
  }

  @Delete('creatives/:id')
  @ApiOperation({ summary: 'Delete ad creative' })
  deleteCreative(@Param('id') id: string) {
    return this.ads.deleteCreative(id);
  }

  @Put('config')
  @ApiOperation({ summary: 'Update platform ad settings' })
  updateConfig(@Body() dto: UpdateAdsConfigDto) {
    return this.ads.updateConfig(dto);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get platform ad settings' })
  getConfig() {
    return this.ads.getPublicConfig();
  }
}
