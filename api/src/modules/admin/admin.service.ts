import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Track } from '../tracks/entities/track.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Earnings } from '../payments/entities/earnings.entity';
import { PlaylistsService } from '../playlists/playlists.service';
import { PlatformService } from '../platform/platform.service';
import { PaymentsService } from '../payments/payments.service';
import { PayoutsService } from '../payouts/payouts.service';
import type { BrandingConfig } from '../../common/branding.defaults';
import { CreateCuratedPlaylistDto } from '../playlists/dto/create-curated-playlist.dto';
import { UpdateCuratedPlaylistDto } from '../playlists/dto/update-curated-playlist.dto';
import { ProcessPayoutDto } from '../payouts/dto/request-payout.dto';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  return Number(value);
}

type MetricTrend = {
  current: number;
  previous: number;
  changePercent: number | null;
};

function computeMetricTrend(current: number, previous: number): MetricTrend {
  let changePercent: number | null = null;
  if (previous !== 0) {
    changePercent = roundMoney(((current - previous) / previous) * 100);
  } else if (current > 0) {
    changePercent = 100;
  }
  return { current, previous, changePercent };
}

function getTrendWindows() {
  const now = new Date();
  const currentEnd = new Date(now);
  currentEnd.setUTCHours(23, 59, 59, 999);

  const currentStart = new Date(now);
  currentStart.setUTCDate(currentStart.getUTCDate() - 30);
  currentStart.setUTCHours(0, 0, 0, 0);

  const previousEnd = new Date(currentStart);
  previousEnd.setUTCMilliseconds(previousEnd.getUTCMilliseconds() - 1);

  const previousStart = new Date(currentStart);
  previousStart.setUTCDate(previousStart.getUTCDate() - 30);
  previousStart.setUTCHours(0, 0, 0, 0);

  return { currentStart, currentEnd, previousStart, previousEnd };
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(Earnings)
    private readonly earningsRepo: Repository<Earnings>,
    private readonly playlists: PlaylistsService,
    private readonly platform: PlatformService,
    private readonly payments: PaymentsService,
    private readonly payouts: PayoutsService,
  ) {}

  async getAdminDashboard() {
    const { currentStart, currentEnd, previousStart, previousEnd } = getTrendWindows();

    const [
      totalUsers,
      totalTracks,
      activeArtists,
      platformFeesRow,
      completedTransactions,
      usersCurrent,
      usersPrevious,
      tracksCurrent,
      tracksPrevious,
      feesCurrent,
      feesPrevious,
      revenueRows,
      recentUsers,
      recentTracks,
      recentPayments,
      pendingPayouts,
    ] = await Promise.all([
      this.usersRepo.count(),
      this.tracksRepo.count({ where: { isActive: true } }),
      this.tracksRepo
        .createQueryBuilder('t')
        .select('COUNT(DISTINCT t.artist_id)', 'count')
        .where('t.is_active = true')
        .andWhere('t.is_published = true')
        .getRawOne<{ count: string }>()
        .then((row) => toNumber(row?.count)),
      this.earningsRepo
        .createQueryBuilder('e')
        .select('COALESCE(SUM(e.platform_fee), 0)', 'total')
        .getRawOne<{ total: string }>(),
      this.paymentsRepo.count({ where: { status: PaymentStatus.COMPLETED } }),
      this.countUsersInWindow(currentStart, currentEnd),
      this.countUsersInWindow(previousStart, previousEnd),
      this.countTracksInWindow(currentStart, currentEnd),
      this.countTracksInWindow(previousStart, previousEnd),
      this.sumPlatformFeesInWindow(currentStart, currentEnd),
      this.sumPlatformFeesInWindow(previousStart, previousEnd),
      this.buildRevenueTimeline(30),
      this.usersRepo.find({
        order: { createdAt: 'DESC' },
        take: 5,
        select: ['id', 'email', 'fullName', 'createdAt'],
      }),
      this.tracksRepo.find({
        where: { isPublished: true, isActive: true },
        order: { updatedAt: 'DESC' },
        take: 5,
        select: ['id', 'title', 'updatedAt'],
      }),
      this.paymentsRepo.find({
        where: { status: PaymentStatus.COMPLETED },
        order: { completedAt: 'DESC' },
        take: 5,
        select: ['id', 'amount', 'currency', 'completedAt', 'createdAt'],
      }),
      this.payouts.countPending(),
    ]);

    const recentActivity = [
      ...recentUsers.map((user) => ({
        id: `user-${user.id}`,
        type: 'USER_REGISTERED' as const,
        label: `${user.fullName || user.email} registered`,
        occurredAt: user.createdAt.toISOString(),
      })),
      ...recentTracks.map((track) => ({
        id: `track-${track.id}`,
        type: 'TRACK_PUBLISHED' as const,
        label: `Track "${track.title}" published`,
        occurredAt: track.updatedAt.toISOString(),
      })),
      ...recentPayments.map((payment) => ({
        id: `payment-${payment.id}`,
        type: 'PAYMENT_COMPLETED' as const,
        label: `Payment ${payment.currency} ${toNumber(payment.amount).toFixed(2)} completed`,
        occurredAt: (payment.completedAt ?? payment.createdAt).toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, 10);

    const paymentHealth = {
      ...this.payments.getPaymentHealth(),
      pendingPayouts,
    };

    return {
      success: true,
      data: {
        kpis: {
          totalUsers,
          totalTracks,
          activeArtists,
          platformFees: roundMoney(toNumber(platformFeesRow?.total)),
          completedTransactions,
          currency: 'ZMW' as const,
        },
        trends: {
          users: computeMetricTrend(usersCurrent, usersPrevious),
          tracks: computeMetricTrend(tracksCurrent, tracksPrevious),
          platformFees: computeMetricTrend(feesCurrent, feesPrevious),
        },
        revenueTimeline: {
          days: 30,
          buckets: revenueRows,
        },
        recentActivity,
        paymentHealth,
      },
    };
  }

  private async countUsersInWindow(start: Date, end: Date): Promise<number> {
    return this.usersRepo
      .createQueryBuilder('u')
      .where('u.created_at >= :start', { start })
      .andWhere('u.created_at <= :end', { end })
      .getCount();
  }

  private async countTracksInWindow(start: Date, end: Date): Promise<number> {
    return this.tracksRepo
      .createQueryBuilder('t')
      .where('t.created_at >= :start', { start })
      .andWhere('t.created_at <= :end', { end })
      .getCount();
  }

  private async sumPlatformFeesInWindow(start: Date, end: Date): Promise<number> {
    const row = await this.earningsRepo
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.platform_fee), 0)', 'total')
      .where('e.created_at >= :start', { start })
      .andWhere('e.created_at <= :end', { end })
      .getRawOne<{ total: string }>();

    return roundMoney(toNumber(row?.total));
  }

  private async buildRevenueTimeline(days: number) {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    since.setUTCHours(0, 0, 0, 0);

    const rows = await this.earningsRepo
      .createQueryBuilder('e')
      .select("TO_CHAR(DATE_TRUNC('day', e.created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD')", 'date')
      .addSelect('SUM(e.platform_fee)', 'platformFees')
      .where('e.created_at >= :since', { since })
      .groupBy("DATE_TRUNC('day', e.created_at AT TIME ZONE 'UTC')")
      .orderBy("DATE_TRUNC('day', e.created_at AT TIME ZONE 'UTC')", 'ASC')
      .getRawMany<{ date: string; platformFees: string }>();

    return rows.map((row) => ({
      date: row.date,
      platformFees: roundMoney(toNumber(row.platformFees)),
    }));
  }

  listUsers(limit = 50, offset = 0, role?: UserRole) {
    return this.usersRepo.findAndCount({
      where: role ? { role } : {},
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
      skip: offset,
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'isActive',
        'createdAt',
        'lastLogin',
      ],
    });
  }

  async deactivateUser(id: string, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = false;
    await this.usersRepo.save(user);
    return { success: true, data: { id, isActive: false } };
  }

  listCuratedPlaylists() {
    return this.playlists.listCuratedAdmin();
  }

  createCuratedPlaylist(adminUserId: string, dto: CreateCuratedPlaylistDto) {
    return this.playlists.createCurated(adminUserId, dto);
  }

  updateCuratedPlaylist(id: string, dto: UpdateCuratedPlaylistDto) {
    return this.playlists.updateCurated(id, dto);
  }

  deleteCuratedPlaylist(id: string) {
    return this.playlists.deleteCurated(id);
  }

  addCuratedTrack(playlistId: string, trackId: string) {
    return this.playlists.addCuratedTrack(playlistId, trackId);
  }

  removeCuratedTrack(playlistId: string, trackId: string) {
    return this.playlists.removeCuratedTrack(playlistId, trackId);
  }

  getTheme() {
    return this.platform.getTheme();
  }

  applyThemePreset(presetId: string) {
    return this.platform.applyPreset(presetId);
  }

  updateTheme(input: { theme?: Record<string, string>; presetId?: string }) {
    return this.platform.updateTheme(input);
  }

  resetTheme() {
    return this.platform.resetTheme();
  }

  getAdminBranding() {
    return this.platform.getAdminBranding();
  }

  updateBranding(input: Partial<BrandingConfig>) {
    return this.platform.updateBranding(input);
  }

  uploadLogo(file: Express.Multer.File) {
    return this.platform.uploadLogo(file);
  }

  removeLogo() {
    return this.platform.removeLogo();
  }

  uploadBackgroundImage(file: Express.Multer.File) {
    return this.platform.uploadBackgroundImage(file);
  }

  applyBrandingTemplate(templateId: string, source: 'starter' | 'saved') {
    return this.platform.applyBrandingTemplate(templateId, source);
  }

  saveBrandingTemplate(name: string) {
    return this.platform.saveBrandingTemplate(name);
  }

  deleteSavedBrandingTemplate(id: string) {
    return this.platform.deleteSavedTemplate(id);
  }

  listPayouts(status?: string) {
    return this.payouts.listForAdmin(status);
  }

  processPayout(id: string, adminUserId: string, dto: ProcessPayoutDto) {
    return this.payouts.processPayout(id, adminUserId, dto);
  }
}
