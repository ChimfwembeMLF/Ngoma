import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Payout, PayoutStatus } from './entities/payout.entity';
import { Earnings } from '../payments/entities/earnings.entity';
import { ArtistsService } from '../artists/artists.service';
import { RequestPayoutDto, ProcessPayoutDto } from './dto/request-payout.dto';
import {
  isPawaPayPayoutCompleted,
  isPawaPayPayoutFailed,
  postPawaPayPayout,
} from '../payments/pawapay.client';
import {
  getDecimalsInAmountForCountry,
  normalizeMobileMoneyPhone,
  resolveCountry,
  resolvePaymentCorrespondent,
} from '../payments/payment-countries';
import { normalizePaymentAmount, PaymentAmountError } from '../payments/payment-amount.util';
import { isDevAutoCompleteEnabled } from '../../common/payments.config';

const MIN_PAYOUT_AMOUNT = 50;
const RESERVED_STATUSES = [
  PayoutStatus.PENDING,
  PayoutStatus.APPROVED,
  PayoutStatus.PROCESSING,
  PayoutStatus.COMPLETED,
];

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutsRepo: Repository<Payout>,
    @InjectRepository(Earnings)
    private readonly earningsRepo: Repository<Earnings>,
    private readonly artistsService: ArtistsService,
    private readonly config: ConfigService,
  ) {}

  async getAvailableBalance(artistId: string): Promise<number> {
    const earningsRow = await this.earningsRepo
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.amount), 0)', 'total')
      .where('e.artist_id = :artistId', { artistId })
      .getRawOne<{ total: string }>();

    const payoutsRow = await this.payoutsRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.artist_id = :artistId', { artistId })
      .andWhere('p.status IN (:...statuses)', { statuses: RESERVED_STATUSES })
      .getRawOne<{ total: string }>();

    const earned = Number(earningsRow?.total ?? 0);
    const reserved = Number(payoutsRow?.total ?? 0);
    return Math.round((earned - reserved) * 100) / 100;
  }

  async listForArtistByUser(userId: string, status?: string) {
    const artist = await this.artistsService.findByUserId(userId);
    if (!artist) throw new NotFoundException('Artist profile not found');
    return this.listForArtist(artist.id, status);
  }

  async listForArtist(artistId: string, status?: string) {
    const where = status
      ? { artistId, status: status as PayoutStatus }
      : { artistId };

    const items = await this.payoutsRepo.find({
      where,
      order: { requestedAt: 'DESC' },
      take: 50,
    });

    return {
      success: true,
      data: {
        items: items.map((p) => this.toPublicPayout(p)),
        total: items.length,
      },
    };
  }

  async listForAdmin(status?: string) {
    const where = status ? { status: status as PayoutStatus } : {};
    const items = await this.payoutsRepo.find({
      where,
      relations: ['artist'],
      order: { requestedAt: 'DESC' },
      take: 100,
    });

    return {
      success: true,
      data: items.map((p) => ({
        ...this.toPublicPayout(p),
        artistName: p.artist?.artistName ?? null,
      })),
    };
  }

  countPending(): Promise<number> {
    return this.payoutsRepo.count({ where: { status: PayoutStatus.PENDING } });
  }

  async requestPayout(userId: string, dto: RequestPayoutDto) {
    const artist = await this.artistsService.findByUserId(userId);
    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    const { pawapayCode, dialCode, currency } = resolvePaymentCorrespondent({
      operatorId: dto.operatorId,
      provider: dto.provider,
      countryId: dto.countryId,
    });

    let amountString: string;
    try {
      ({ amountString } = normalizePaymentAmount(
        dto.amount,
        getDecimalsInAmountForCountry(dto.countryId),
      ));
    } catch (err) {
      throw new BadRequestException(
        err instanceof PaymentAmountError ? err.message : 'Invalid payout amount',
      );
    }

    const amount = Number(amountString);
    if (amount < MIN_PAYOUT_AMOUNT) {
      throw new BadRequestException(`Minimum payout is ${currency} ${MIN_PAYOUT_AMOUNT}`);
    }

    const available = await this.getAvailableBalance(artist.id);
    if (amount > available) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${currency} ${available.toFixed(2)}`,
      );
    }

    const phone = normalizeMobileMoneyPhone(dialCode, dto.phone);
    if (!phone) {
      throw new BadRequestException('Valid phone number is required');
    }

    const payout = await this.payoutsRepo.save(
      this.payoutsRepo.create({
        artistId: artist.id,
        amount: amountString,
        currency,
        status: PayoutStatus.PENDING,
        paymentMethod: pawapayCode,
        phone,
      }),
    );

    return {
      success: true,
      data: this.toPublicPayout(payout),
    };
  }

  async processPayout(id: string, adminUserId: string, dto: ProcessPayoutDto) {
    const payout = await this.payoutsRepo.findOne({ where: { id } });
    if (!payout) throw new NotFoundException('Payout not found');

    if (payout.status !== PayoutStatus.PENDING) {
      throw new BadRequestException('Only pending payouts can be processed');
    }

    if (dto.action === 'reject') {
      payout.status = PayoutStatus.REJECTED;
      payout.processedAt = new Date();
      payout.processedBy = adminUserId;
      if (dto.note) payout.errorMessage = dto.note;
      await this.payoutsRepo.save(payout);
      return { success: true, data: this.toPublicPayout(payout) };
    }

    payout.status = PayoutStatus.APPROVED;
    payout.processedBy = adminUserId;
    await this.payoutsRepo.save(payout);

    const payoutId = randomUUID();
    payout.pawapayPayoutId = payoutId;
    payout.status = PayoutStatus.PROCESSING;
    await this.payoutsRepo.save(payout);

    if (isDevAutoCompleteEnabled(this.config)) {
      payout.status = PayoutStatus.COMPLETED;
      payout.processedAt = new Date();
      await this.payoutsRepo.save(payout);
      return { success: true, data: this.toPublicPayout(payout) };
    }

    try {
      const result = await postPawaPayPayout(this.config, {
        payoutId,
        amount: payout.amount,
        currency: payout.currency,
        correspondent: payout.paymentMethod ?? '',
        phone: payout.phone ?? '',
      });

      if (result && isPawaPayPayoutCompleted(result.payoutStatus)) {
        payout.status = PayoutStatus.COMPLETED;
        payout.processedAt = new Date();
      } else if (result && isPawaPayPayoutFailed(result.payoutStatus)) {
        payout.status = PayoutStatus.FAILED;
        payout.errorMessage = result.errorMessage ?? 'Payout failed';
        payout.processedAt = new Date();
      } else {
        payout.status = PayoutStatus.PROCESSING;
      }
      await this.payoutsRepo.save(payout);
    } catch (err) {
      payout.status = PayoutStatus.FAILED;
      payout.errorMessage =
        err instanceof Error ? err.message : 'Payout gateway error';
      payout.processedAt = new Date();
      await this.payoutsRepo.save(payout);
      throw new ServiceUnavailableException(
        'Payout could not be sent. The request was marked as failed.',
      );
    }

    return { success: true, data: this.toPublicPayout(payout) };
  }

  async getBalanceForUser(userId: string) {
    const artist = await this.artistsService.findByUserId(userId);
    if (!artist) throw new NotFoundException('Artist profile not found');
    const available = await this.getAvailableBalance(artist.id);
    const country = resolveCountry('ZM');
    return {
      success: true,
      data: {
        available,
        currency: country.currency,
        minimumPayout: MIN_PAYOUT_AMOUNT,
      },
    };
  }

  private toPublicPayout(payout: Payout) {
    return {
      id: payout.id,
      artistId: payout.artistId,
      amount: payout.amount,
      currency: payout.currency,
      status: payout.status,
      paymentMethod: payout.paymentMethod ?? null,
      phone: payout.phone ?? null,
      errorMessage: payout.errorMessage ?? null,
      requestedAt: payout.requestedAt,
      processedAt: payout.processedAt ?? null,
    };
  }
}
