import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  isDevAutoCompleteEnabled,
  isPawapayEnabled,
  resolvePawaPayEnvironment,
  resolvePawaPayToken,
  resolveWebhookUrl,
  resolvePawaPayBaseUrl,
} from '../../common/payments.config';
import {
  Payment,
  PaymentPurpose,
  PaymentStatus,
} from './entities/payment.entity';
import { Earnings, EarningsSource } from './entities/earnings.entity';
import { Tip } from './entities/tip.entity';
import { Artist } from '../artists/entities/artist.entity';
import { DownloadAccess } from '../tracks/entities/download-access.entity';
import { Track, PricingType } from '../tracks/entities/track.entity';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { InitiateTipDto } from './dto/initiate-tip.dto';
import {
  getPawaPayDepositStatus,
  isPawaPayDepositCompleted,
  isPawaPayDepositFailed,
  parsePawaPayDepositStatus,
  postPawaPayDeposit,
  type ParsedPawaPayDepositStatus,
} from './pawapay.client';
import { listPaymentCountryOptions, normalizeMobileMoneyPhone, resolveOperatorByPawapayCode, resolvePaymentCorrespondent, getDecimalsInAmountForCountry, PAYMENT_COUNTRY_CATALOG } from './payment-countries';
import {
  normalizePaymentAmount,
  PaymentAmountError,
} from './payment-amount.util';

const PLATFORM_FEE_RATE = 0.3;
const TIP_PLATFORM_FEE_RATE = 0.05;
const DOWNLOAD_ACCESS_DAYS = 7;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(Earnings)
    private readonly earningsRepo: Repository<Earnings>,
    @InjectRepository(Tip)
    private readonly tipsRepo: Repository<Tip>,
    @InjectRepository(Artist)
    private readonly artistsRepo: Repository<Artist>,
    @InjectRepository(DownloadAccess)
    private readonly accessRepo: Repository<DownloadAccess>,
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
    private readonly config: ConfigService,
  ) {}

  listMobileMoneyOptions() {
    return listPaymentCountryOptions();
  }

  private resolveCorrespondent(dto: InitiatePaymentDto | InitiateTipDto) {
    try {
      return resolvePaymentCorrespondent({
        operatorId: dto.operatorId,
        provider: dto.provider,
        countryId: dto.countryId,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid payment details';
      throw new BadRequestException(message);
    }
  }

  getPaymentConfig() {
    const pawapayEnabled = isPawapayEnabled(this.config);
    const explicitWebhook = Boolean(this.config.get<string>('PAWAPAY_WEBHOOK_URL')?.trim());
    return {
      success: true,
      data: {
        pawapayEnabled,
        environment: resolvePawaPayEnvironment(this.config),
        webhookUrl: resolveWebhookUrl(this.config),
        webhookUrlConfigured: explicitWebhook,
        devAutoComplete: isDevAutoCompleteEnabled(this.config),
        baseUrl: pawapayEnabled ? resolvePawaPayBaseUrl(this.config) : null,
      },
    };
  }

  getPaymentHealth() {
    const explicitWebhook = Boolean(this.config.get<string>('PAWAPAY_WEBHOOK_URL')?.trim());
    return {
      environment: resolvePawaPayEnvironment(this.config),
      webhookConfigured: explicitWebhook,
      enabledCountries: PAYMENT_COUNTRY_CATALOG.filter((c) => c.enabled).length,
    };
  }

  private normalizeAmountForCountry(amount: number, countryId?: string) {
    const decimalsInAmount = getDecimalsInAmountForCountry(countryId);
    try {
      return normalizePaymentAmount(amount, decimalsInAmount);
    } catch (err) {
      const message =
        err instanceof PaymentAmountError ? err.message : 'Invalid payment amount';
      throw new BadRequestException(message);
    }
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
    } else if (track.pricingType === PricingType.SET_PRICE) {
      const expected = Number(track.price ?? 0);
      if (Math.abs(dto.amount - expected) > 0.001) {
        throw new BadRequestException(`Amount must be ZMW ${expected.toFixed(2)}`);
      }
    } else {
      throw new BadRequestException('Track is not available for purchase');
    }

    const existing = await this.accessRepo.findOne({
      where: { userId, trackId: track.id },
    });
    if (existing && (!existing.expiresAt || existing.expiresAt > new Date())) {
      throw new BadRequestException('You already have download access');
    }

    const depositId = randomUUID();
    const { amountString } = this.normalizeAmountForCountry(dto.amount, dto.countryId);
    const { pawapayCode, dialCode, currency: countryCurrency } = this.resolveCorrespondent(dto);
    const currency = dto.currency || countryCurrency;

    const payment = await this.paymentsRepo.save(
      this.paymentsRepo.create({
        userId,
        depositId,
        amount: amountString,
        currency,
        provider: pawapayCode,
        status: PaymentStatus.INITIATED,
        purpose: dto.purpose,
        itemId: dto.itemId,
      }),
    );

    await this.submitToGateway(payment, dto.phone, pawapayCode, dialCode, `Ngoma ${track.title}`);

    const saved = await this.paymentsRepo.findOne({ where: { id: payment.id } });
    const status = saved?.status ?? payment.status;

    return {
      success: true,
      data: {
        depositId: payment.depositId,
        paymentId: payment.id,
        status,
        message:
          status === PaymentStatus.COMPLETED
            ? 'Purchase complete'
            : isPawapayEnabled(this.config)
              ? 'Check your phone for USSD prompt'
              : 'Sandbox payment completed (dev mode)',
      },
    };
  }

  async initiateTip(userId: string, dto: InitiateTipDto) {
    const artist = await this.artistsRepo.findOne({ where: { id: dto.artistId } });
    if (!artist) throw new NotFoundException('Artist not found');
    if (artist.userId === userId) {
      throw new ForbiddenException('You cannot tip yourself');
    }

    if (dto.trackId) {
      const track = await this.tracksRepo.findOne({
        where: { id: dto.trackId, artistId: dto.artistId, isPublished: true, isActive: true },
      });
      if (!track) {
        throw new BadRequestException('Track does not belong to this artist');
      }
    }

    const depositId = randomUUID();
    const { amountString } = this.normalizeAmountForCountry(dto.amount, dto.countryId);
    const { pawapayCode, dialCode, currency: countryCurrency } = this.resolveCorrespondent(dto);
    const currency = dto.currency || countryCurrency;

    const payment = await this.paymentsRepo.save(
      this.paymentsRepo.create({
        userId,
        depositId,
        amount: amountString,
        currency,
        provider: pawapayCode,
        status: PaymentStatus.INITIATED,
        purpose: PaymentPurpose.TIP,
        itemId: dto.artistId,
      }),
    );

    await this.tipsRepo.save(
      this.tipsRepo.create({
        artistId: dto.artistId,
        userId,
        amount: amountString,
        paymentId: payment.id,
        message: dto.message,
        trackId: dto.trackId,
      }),
    );

    await this.submitToGateway(
      payment,
      dto.phone,
      pawapayCode,
      dialCode,
      `Ngoma tip ${artist.artistName}`,
    );

    return {
      success: true,
      data: {
        depositId: payment.depositId,
        paymentId: payment.id,
        status: payment.status,
        message: isPawapayEnabled(this.config)
          ? 'Check your phone for USSD prompt'
          : 'Sandbox tip completed (dev mode)',
      },
    };
  }

  async getTipsReceived(artistId: string, limit = 20, offset = 0) {
    const take = Math.min(limit, 50);
    const [items, total] = await this.tipsRepo.findAndCount({
      where: { artistId },
      relations: ['user', 'track'],
      order: { createdAt: 'DESC' },
      take,
      skip: offset,
    });

    return {
      success: true,
      data: items.map((tip) => ({
        id: tip.id,
        amount: Number(tip.amount),
        message: tip.message ?? null,
        trackId: tip.trackId ?? null,
        trackTitle: tip.track?.title ?? null,
        tipperName: tip.user?.fullName ?? 'Fan',
        createdAt: tip.createdAt,
      })),
      pagination: { total, limit: take, offset },
    };
  }

  async getStatus(userId: string, depositId: string) {
    let payment = await this.paymentsRepo.findOne({ where: { depositId, userId } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (
      payment.status !== PaymentStatus.COMPLETED &&
      payment.status !== PaymentStatus.FAILED
    ) {
      try {
        const remote = await getPawaPayDepositStatus(this.config, depositId);
        const parsed = parsePawaPayDepositStatus(remote);
        if (parsed?.lookupStatus === 'NOT_FOUND') {
          // remain pending — do not fail on missing remote record yet
        } else if (isPawaPayDepositCompleted(parsed?.depositStatus)) {
          await this.applyParsedStatus(payment, parsed);
          await this.completePayment(payment);
        } else if (isPawaPayDepositFailed(parsed?.depositStatus)) {
          await this.applyParsedStatus(payment, parsed);
          payment.status = PaymentStatus.FAILED;
          await this.paymentsRepo.save(payment);
        } else if (parsed) {
          await this.applyParsedStatus(payment, parsed);
          if (parsed.depositStatus === 'PENDING') {
            payment.status = PaymentStatus.PENDING;
            await this.paymentsRepo.save(payment);
          }
        }
      } catch (err) {
        this.logger.warn(
          `PawaPay status lookup failed for deposit ${depositId}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    payment = await this.paymentsRepo.findOne({ where: { depositId, userId } });
    if (!payment) throw new NotFoundException('Payment not found');

    return {
      success: true,
      data: {
        depositId: payment.depositId,
        paymentId: payment.id,
        status: payment.status,
        completedAt: payment.completedAt,
        errorMessage: payment.errorMessage ?? null,
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
      data: items.map((payment) => {
        const operator = payment.provider
          ? resolveOperatorByPawapayCode(payment.provider)
          : null;
        return {
          ...payment,
          providerDisplayName: operator?.displayName ?? payment.provider,
        };
      }),
      pagination: { total, limit, offset },
    };
  }

  async handleWebhook(body: unknown) {
    const parsed = parsePawaPayDepositStatus(body);
    const record = body as Record<string, unknown>;
    const eventType = String(record?.eventType || record?.type || '').toLowerCase();

    const depositId =
      parsed?.depositId ||
      (typeof record?.depositId === 'string' ? record.depositId : undefined) ||
      ((record?.data as Record<string, unknown>)?.depositId as string | undefined);

    if (!depositId) {
      this.logger.warn('Webhook missing depositId');
      return { received: true };
    }

    const payment = await this.paymentsRepo.findOne({ where: { depositId } });
    if (!payment) {
      this.logger.warn(`Payment not found for deposit ${depositId}`);
      return { received: true };
    }

    const depositStatus = parsed?.depositStatus?.toUpperCase();
    const isSuccess =
      isPawaPayDepositCompleted(depositStatus) ||
      eventType.includes('success') ||
      eventType.includes('completed');
    const isFailed =
      isPawaPayDepositFailed(depositStatus) || eventType.includes('failed');
    const isPending = depositStatus === 'PENDING' || eventType.includes('pending');

    if (parsed) {
      await this.applyParsedStatus(payment, parsed);
    }

    if (isSuccess && payment.status !== PaymentStatus.COMPLETED) {
      await this.completePayment(payment);
    } else if (isFailed) {
      payment.status = PaymentStatus.FAILED;
      if (parsed?.errorCode) payment.errorCode = parsed.errorCode;
      if (parsed?.errorMessage) payment.errorMessage = parsed.errorMessage;
      await this.paymentsRepo.save(payment);
    } else if (isPending) {
      payment.status = PaymentStatus.PENDING;
      await this.paymentsRepo.save(payment);
    }

    return { received: true };
  }

  private async submitToGateway(
    payment: Payment,
    phone: string | undefined,
    provider: string,
    dialCode: string,
    customerMessage: string,
  ) {
    const token = resolvePawaPayToken(this.config);
    if (token) {
      const normalizedPhone = normalizeMobileMoneyPhone(dialCode, phone);
      if (!normalizedPhone) {
        throw new BadRequestException('Phone number is required for mobile money payment');
      }
      let result: ParsedPawaPayDepositStatus | null = null;
      try {
        result = await postPawaPayDeposit(this.config, {
          depositId: payment.depositId,
          amount: payment.amount,
          currency: payment.currency,
          correspondent: provider,
          phone: normalizedPhone,
          customerMessage,
        });
      } catch (err) {
        this.logger.error(
          `PawaPay deposit failed for ${payment.depositId}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        throw new ServiceUnavailableException(
          'Payment service is temporarily unavailable. Please try again shortly.',
        );
      }
      payment.status = PaymentStatus.PENDING;
      if (result) {
        await this.applyParsedStatus(payment, result);
        if (isPawaPayDepositFailed(result.depositStatus)) {
          payment.status = PaymentStatus.FAILED;
        }
      }
      await this.paymentsRepo.save(payment);
      return;
    }

    if (isDevAutoCompleteEnabled(this.config)) {
      await this.completePayment(payment);
      payment.status = PaymentStatus.COMPLETED;
      await this.paymentsRepo.save(payment);
      return;
    }

    throw new ServiceUnavailableException('Payment gateway not configured');
  }

  private async applyParsedStatus(payment: Payment, parsed: ParsedPawaPayDepositStatus) {
    if (parsed.transactionId) payment.transactionId = parsed.transactionId;
    if (parsed.errorCode) payment.errorCode = parsed.errorCode;
    if (parsed.errorMessage) payment.errorMessage = parsed.errorMessage;
    await this.paymentsRepo.save(payment);
  }

  private async completePayment(payment: Payment) {
    if (payment.status === PaymentStatus.COMPLETED) return;

    payment.status = PaymentStatus.COMPLETED;
    payment.completedAt = new Date();
    await this.paymentsRepo.save(payment);

    if (payment.purpose === PaymentPurpose.TRACK_DOWNLOAD) {
      await this.completeTrackDownload(payment);
    } else if (payment.purpose === PaymentPurpose.TIP) {
      await this.completeTip(payment);
    }
  }

  private async completeTrackDownload(payment: Payment) {
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

    const existingEarnings = await this.earningsRepo.findOne({
      where: { paymentId: payment.id },
    });
    if (existingEarnings) return;

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

  private async completeTip(payment: Payment) {
    const tip = await this.tipsRepo.findOne({ where: { paymentId: payment.id } });
    if (!tip) return;

    const existingEarnings = await this.earningsRepo.findOne({
      where: { paymentId: payment.id },
    });
    if (existingEarnings) return;

    const gross = Number(payment.amount);
    const platformFee = Math.round(gross * TIP_PLATFORM_FEE_RATE * 100) / 100;
    const artistAmount = Math.round((gross - platformFee) * 100) / 100;

    await this.earningsRepo.save(
      this.earningsRepo.create({
        artistId: tip.artistId,
        userId: payment.userId,
        trackId: tip.trackId,
        amount: String(artistAmount),
        platformFee: String(platformFee),
        source: EarningsSource.TIP,
        paymentId: payment.id,
      }),
    );
  }
}
