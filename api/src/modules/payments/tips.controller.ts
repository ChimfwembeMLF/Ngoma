import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { PaymentsService } from './payments.service';

@ApiTags('Tips')
@Controller('api/v1/tips')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ARTIST)
@ApiBearerAuth()
export class TipsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get('received')
  @ApiOperation({ summary: 'List tips received by authenticated artist' })
  received(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const artistId = req.user?.['artistId'] as string | undefined;
    if (!artistId) {
      throw new ForbiddenException('Artist profile required');
    }
    return this.payments.getTipsReceived(
      artistId,
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
    );
  }
}
