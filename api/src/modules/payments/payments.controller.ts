import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { InitiateTipDto } from './dto/initiate-tip.dto';
import { assertWebhookSignature } from './pawapay-webhook.util';

@ApiTags('Payments')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('config')
  @ApiOperation({ summary: 'Payment gateway configuration (no secrets)' })
  getConfig() {
    return this.payments.getPaymentConfig();
  }

  @Get('mobile-money/options')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List mobile money providers' })
  mobileMoneyOptions() {
    return this.payments.listMobileMoneyOptions();
  }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate track purchase payment' })
  deposit(@Req() req: Request, @Body() dto: InitiatePaymentDto) {
    return this.payments.initiateDeposit(req.user?.['sub'] as string, dto);
  }

  @Post('tip')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate artist tip payment' })
  tip(@Req() req: Request, @Body() dto: InitiateTipDto) {
    return this.payments.initiateTip(req.user?.['sub'] as string, dto);
  }

  @Get('status/:depositId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Poll payment status' })
  status(@Req() req: Request, @Param('depositId') depositId: string) {
    return this.payments.getStatus(req.user?.['sub'] as string, depositId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payment history' })
  history(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.payments.history(
      req.user?.['sub'] as string,
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
    );
  }

  @Post('webhook')
  @ApiExcludeEndpoint()
  webhook(@Req() req: Request, @Body() body: unknown) {
    assertWebhookSignature(req.headers, this.configService);
    return this.payments.handleWebhook(body);
  }
}
