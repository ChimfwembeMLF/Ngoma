import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Earnings, EarningsSource } from '../payments/entities/earnings.entity';
import { Tip } from '../payments/entities/tip.entity';
import { Track } from '../tracks/entities/track.entity';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  return Number(value);
}

export type MetricTrend = {
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
export class AnalyticsService {
  constructor(
    @InjectRepository(Earnings)
    private readonly earningsRepo: Repository<Earnings>,
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
    @InjectRepository(Tip)
    private readonly tipsRepo: Repository<Tip>,
  ) {}

  async getDashboard(artistId: string) {
    const [summary, topTracks, trends, tips] = await Promise.all([
      this.buildSummary(artistId),
      this.buildTopTracks(artistId),
      this.buildArtistTrends(artistId),
      this.buildTipsAggregate(artistId),
    ]);

    return {
      success: true,
      data: { summary, topTracks, trends, tips },
    };
  }

  async getEarningsTimeline(artistId: string, days: number) {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    since.setUTCHours(0, 0, 0, 0);

    const rows = await this.earningsRepo
      .createQueryBuilder('e')
      .select("TO_CHAR(DATE_TRUNC('day', e.created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD')", 'date')
      .addSelect('SUM(e.amount)', 'netEarnings')
      .where('e.artist_id = :artistId', { artistId })
      .andWhere('e.created_at >= :since', { since })
      .groupBy("DATE_TRUNC('day', e.created_at AT TIME ZONE 'UTC')")
      .orderBy("DATE_TRUNC('day', e.created_at AT TIME ZONE 'UTC')", 'ASC')
      .getRawMany<{ date: string; netEarnings: string }>();

    const buckets = rows.map((row) => ({
      date: row.date,
      netEarnings: roundMoney(toNumber(row.netEarnings)),
    }));

    const totalNetEarnings = roundMoney(
      buckets.reduce((sum, bucket) => sum + bucket.netEarnings, 0),
    );

    return {
      success: true,
      data: { days, buckets, totalNetEarnings },
    };
  }

  private async buildSummary(artistId: string) {
    const earningsAgg = await this.earningsRepo
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.amount), 0)', 'totalNetEarnings')
      .addSelect('COALESCE(SUM(e.platform_fee), 0)', 'totalPlatformFees')
      .addSelect('COUNT(DISTINCT e.user_id)', 'uniqueSupporters')
      .where('e.artist_id = :artistId', { artistId })
      .getRawOne<{
        totalNetEarnings: string;
        totalPlatformFees: string;
        uniqueSupporters: string;
      }>();

    const trackAgg = await this.tracksRepo
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.plays), 0)', 'totalPlays')
      .addSelect('COALESCE(SUM(t.downloads), 0)', 'totalDownloads')
      .addSelect('SUM(CASE WHEN t.is_published = true THEN 1 ELSE 0 END)', 'publishedTrackCount')
      .where('t.artist_id = :artistId', { artistId })
      .andWhere('t.is_active = true')
      .getRawOne<{
        totalPlays: string;
        totalDownloads: string;
        publishedTrackCount: string;
      }>();

    return {
      totalNetEarnings: roundMoney(toNumber(earningsAgg?.totalNetEarnings)),
      totalPlatformFees: roundMoney(toNumber(earningsAgg?.totalPlatformFees)),
      totalPlays: toNumber(trackAgg?.totalPlays),
      totalDownloads: toNumber(trackAgg?.totalDownloads),
      publishedTrackCount: toNumber(trackAgg?.publishedTrackCount),
      uniqueSupporters: toNumber(earningsAgg?.uniqueSupporters),
      currency: 'ZMW',
    };
  }

  private async buildTopTracks(artistId: string) {
    const rows = await this.tracksRepo
      .createQueryBuilder('t')
      .leftJoin(Earnings, 'e', 'e.track_id = t.id AND e.artist_id = t.artist_id')
      .select('t.id', 'trackId')
      .addSelect('t.title', 'title')
      .addSelect('t.plays', 'plays')
      .addSelect('t.downloads', 'downloads')
      .addSelect('t.pricing_type', 'pricingType')
      .addSelect('COALESCE(SUM(e.amount), 0)', 'netEarnings')
      .where('t.artist_id = :artistId', { artistId })
      .andWhere('t.is_active = true')
      .groupBy('t.id')
      .addGroupBy('t.title')
      .addGroupBy('t.plays')
      .addGroupBy('t.downloads')
      .addGroupBy('t.pricing_type')
      .orderBy('COALESCE(SUM(e.amount), 0)', 'DESC')
      .addOrderBy('t.plays', 'DESC')
      .limit(10)
      .getRawMany<{
        trackId: string;
        title: string;
        plays: string;
        downloads: string;
        pricingType: string;
        netEarnings: string;
      }>();

    return rows.map((row) => ({
      trackId: row.trackId,
      title: row.title,
      plays: toNumber(row.plays),
      downloads: toNumber(row.downloads),
      netEarnings: roundMoney(toNumber(row.netEarnings)),
      pricingType: row.pricingType,
    }));
  }

  private async buildArtistTrends(artistId: string) {
    const { currentStart, currentEnd, previousStart, previousEnd } = getTrendWindows();

    const [earningsCurrent, earningsPrevious, downloadsCurrent, downloadsPrevious, tipsCurrent, tipsPrevious] =
      await Promise.all([
        this.sumEarningsInWindow(artistId, currentStart, currentEnd),
        this.sumEarningsInWindow(artistId, previousStart, previousEnd),
        this.countDownloadsInWindow(artistId, currentStart, currentEnd),
        this.countDownloadsInWindow(artistId, previousStart, previousEnd),
        this.countTipsInWindow(artistId, currentStart, currentEnd),
        this.countTipsInWindow(artistId, previousStart, previousEnd),
      ]);

    const playsCurrent = downloadsCurrent + tipsCurrent;
    const playsPrevious = downloadsPrevious + tipsPrevious;

    return {
      netEarnings: computeMetricTrend(earningsCurrent, earningsPrevious),
      plays: computeMetricTrend(playsCurrent, playsPrevious),
      downloads: computeMetricTrend(downloadsCurrent, downloadsPrevious),
    };
  }

  private async sumEarningsInWindow(artistId: string, start: Date, end: Date): Promise<number> {
    const row = await this.earningsRepo
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.amount), 0)', 'total')
      .where('e.artist_id = :artistId', { artistId })
      .andWhere('e.created_at >= :start', { start })
      .andWhere('e.created_at <= :end', { end })
      .getRawOne<{ total: string }>();

    return roundMoney(toNumber(row?.total));
  }

  private async countDownloadsInWindow(artistId: string, start: Date, end: Date): Promise<number> {
    const row = await this.earningsRepo
      .createQueryBuilder('e')
      .select('COUNT(*)', 'count')
      .where('e.artist_id = :artistId', { artistId })
      .andWhere('e.source = :source', { source: EarningsSource.DOWNLOAD })
      .andWhere('e.created_at >= :start', { start })
      .andWhere('e.created_at <= :end', { end })
      .getRawOne<{ count: string }>();

    return toNumber(row?.count);
  }

  private async countTipsInWindow(artistId: string, start: Date, end: Date): Promise<number> {
    const row = await this.tipsRepo
      .createQueryBuilder('t')
      .select('COUNT(*)', 'count')
      .where('t.artist_id = :artistId', { artistId })
      .andWhere('t.created_at >= :start', { start })
      .andWhere('t.created_at <= :end', { end })
      .getRawOne<{ count: string }>();

    return toNumber(row?.count);
  }

  private async buildTipsAggregate(artistId: string) {
    const row = await this.tipsRepo
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'totalAmount')
      .addSelect('COUNT(*)', 'count')
      .where('t.artist_id = :artistId', { artistId })
      .getRawOne<{ totalAmount: string; count: string }>();

    return {
      totalAmount: roundMoney(toNumber(row?.totalAmount)),
      count: toNumber(row?.count),
      currency: 'ZMW' as const,
    };
  }
}
