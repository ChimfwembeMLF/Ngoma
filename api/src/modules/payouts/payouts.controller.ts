import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PayoutsService } from './payouts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { RequestPayoutDto } from './dto/request-payout.dto';

@ApiTags('Payouts')
@Controller('api/v1/payouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ARTIST)
@ApiBearerAuth()
export class PayoutsController {
  constructor(private readonly payouts: PayoutsService) {}

  @Get()
  @ApiOperation({ summary: 'List artist payouts' })
  list(@Req() req: Request, @Query('status') status?: string) {
    return this.payouts.listForArtistByUser(req.user?.['sub'] as string, status);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Available payout balance' })
  balance(@Req() req: Request) {
    return this.payouts.getBalanceForUser(req.user?.['sub'] as string);
  }

  @Post('request')
  @ApiOperation({ summary: 'Request a payout' })
  request(@Req() req: Request, @Body() dto: RequestPayoutDto) {
    return this.payouts.requestPayout(req.user?.['sub'] as string, dto);
  }
}
