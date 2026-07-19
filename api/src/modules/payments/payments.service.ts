import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  Payment,
  PaymentPurpose,
  PaymentStatus,
} from './entities/payment.entity';
import { Earnings, EarningsSource } from './entities/earnings.entity';
import { DownloadAccess } from '../tracks/entities/download-access.entity';
import { Track, PricingType } from '../tracks/entities/track.entity';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import {
  getPawaPayDepositStatus,
  isPawaPayDepositCompleted,
  parsePawaPayDepositStatus,
  postPawaPayDeposit,
  resolvePawaPayToken,
} from './pawapay.client';
import { listPaymentCountryOptions, normalizeMobileMoneyPhone } from './payment-countries';

const PLATFORM_FEE_RATE = 0.3;
const DOWNLOAD_ACCESS_DAYS = 7;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(Earnings)
    private readonly earningsRepo: Repository<Earnings>,
    @InjectRepository(DownloadAccess)
    private readonly accessRepo: Repository<DownloadAccess>,
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
    private readonly config: ConfigService,
  ) {}

  listMobileMoneyOptions() {
    return listPaymentCountryOptions();
  }

  async initiateDeposit(userId: string, dto: InitiatePaymentDto) {
    const track = await this.tracksRepo.findOne({
      where: { id: dto.itemId, isPublished: true, isActive: true },
    });
    if (!track) throw new NotFoundException('Track not found');
    if (track.pricingType === PricingType.FREE) {
      throw new BadRequestException('Track is free');
    }
    if (track.pricingType === PricingType.PAY_WHAT_YOU_WANT) {
      const min = Number(track.minPrice ?? 0);
      if (!track.minPrice || dto.amount < min) {
        throw new BadRequestException(`Amount must be at least ZMW ${min.toFixed(2)}`);
      }
    } else if (track.pricingType !== PricingType.SET_PRICE) {
      throw new BadRequestException('Track is not available for purchase');
    }

    const existing = await this.accessRepo.findOne({
      where: { userId, trackId: track.id },
    });
    if (existing && (!existing.expiresAt || existing.expiresAt > new Date())) {
      throw new BadRequestException('You already have download access');
    }

    const depositId = randomUUID();
    const amount = String(dto.amount);
    const currency = dto.currency || 'ZMW';

    const payment = await this.paymentsRepo.save(
      this.paymentsRepo.create({
        userId,
        depositId,
        amount,
        currency,
        provider: dto.provider,
        status: PaymentStatus.INITIATED,
        purpose: dto.purpose,
        itemId: dto.itemId,
      }),
    );

    const token = resolvePawaPayToken(this.config);
    if (token) {
      const phone = normalizeMobileMoneyPhone('260', dto.phone);
      const result = await postPawaPayDeposit(this.config, {
        depositId,
        amount,
        currency,
        correspondent: dto.provider,
        phone,
        customerMessage: `Ngoma ${track.title}`,
      });
      payment.status = PaymentStatus.PENDING;
      if (result?.depositStatus === 'FAILED') {
        payment.status = PaymentStatus.FAILED;
      }
      await this.paymentsRepo.save(payment);
    } else if (this.config.get<string>('NODE_ENV') === 'development') {
      await this.completePayment(payment);
      payment.status = PaymentStatus.COMPLETED;
    } else {
      throw new BadRequestException('Payment gateway not configured');
    }

    return {
      success: true,
      data: {
        depositId: payment.depositId,
        paymentId: payment.id,
        status: payment.status,
        message: token
          ? 'Check your phone for USSD prompt'
          : 'Sandbox payment completed (dev mode)',
      },
    };
  }

  async getStatus(userId: string, depositId: string) {
    const payment = await this.paymentsRepo.findOne({ where: { depositId, userId } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (
      payment.status !== PaymentStatus.COMPLETED &&
      payment.status !== PaymentStatus.FAILED
    ) {
      const remote = await getPawaPayDepositStatus(this.config, depositId);
      const parsed = parsePawaPayDepositStatus(remote);
      if (isPawaPayDepositCompleted(parsed?.depositStatus)) {
        await this.completePayment(payment);
        payment.status = PaymentStatus.COMPLETED;
      } else if (parsed?.depositStatus === 'FAILED') {
        payment.status = PaymentStatus.FAILED;
        await this.paymentsRepo.save(payment);
      }
    }

    return {
      success: true,
      data: {
        depositId: payment.depositId,
        paymentId: payment.id,
        status: payment.status,
        completedAt: payment.completedAt,
      },
    };
  }

  async history(userId: string, limit = 20, offset = 0) {
    const [items, total] = await this.paymentsRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
      skip: offset,
    });
    return {
      success: true,
      data: items,
      pagination: { total, limit, offset },
    };
  }

  async handleWebhook(body: unknown) {
    const record = body as Record<string, unknown>;
    const eventType = String(record.eventType || record.type || '').toLowerCase();
    const depositId =
      (record.depositId as string) ||
      ((record.data as Record<string, unknown>)?.depositId as string);

    if (!depositId) {
      this.logger.warn('Webhook missing depositId');
      return { received: true };
    }

    const payment = await this.paymentsRepo.findOne({ where: { depositId } });
    if (!payment) {
      this.logger.warn(`Payment not found for deposit ${depositId}`);
      return { received: true };
    }

    const isSuccess =
      eventType.includes('success') ||
      eventType.includes('completed') ||
      isPawaPayDepositCompleted(
        (record.status as string) ||
          ((record.data as Record<string, unknown>)?.status as string),
      );

    if (isSuccess && payment.status !== PaymentStatus.COMPLETED) {
      await this.completePayment(payment);
    } else if (eventType.includes('failed')) {
      payment.status = PaymentStatus.FAILED;
      await this.paymentsRepo.save(payment);
    } else if (eventType.includes('pending')) {
      payment.status = PaymentStatus.PENDING;
      await this.paymentsRepo.save(payment);
    }

    return { received: true };
  }

  private async completePayment(payment: Payment) {
    if (payment.status === PaymentStatus.COMPLETED) return;

    payment.status = PaymentStatus.COMPLETED;
    payment.completedAt = new Date();
    await this.paymentsRepo.save(payment);

    if (payment.purpose !== PaymentPurpose.TRACK_DOWNLOAD) return;

    const track = await this.tracksRepo.findOne({ where: { id: payment.itemId } });
    if (!track) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + DOWNLOAD_ACCESS_DAYS);

    const existing = await this.accessRepo.findOne({
      where: { userId: payment.userId, trackId: track.id },
    });
    if (existing) {
      existing.paymentId = payment.id;
      existing.expiresAt = expiresAt;
      await this.accessRepo.save(existing);
    } else {
      await this.accessRepo.save(
        this.accessRepo.create({
          userId: payment.userId,
          trackId: track.id,
          paymentId: payment.id,
          expiresAt,
        }),
      );
    }

    const gross = Number(payment.amount);
    const platformFee = Math.round(gross * PLATFORM_FEE_RATE * 100) / 100;
    const artistAmount = Math.round((gross - platformFee) * 100) / 100;

    await this.earningsRepo.save(
      this.earningsRepo.create({
        artistId: track.artistId,
        userId: payment.userId,
        trackId: track.id,
        amount: String(artistAmount),
        platformFee: String(platformFee),
        source: EarningsSource.DOWNLOAD,
        paymentId: payment.id,
      }),
    );
  }
}
