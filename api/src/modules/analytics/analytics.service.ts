import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Earnings } from '../payments/entities/earnings.entity';
import { Track } from '../tracks/entities/track.entity';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  return Number(value);
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Earnings)
    private readonly earningsRepo: Repository<Earnings>,
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
  ) {}

  async getDashboard(artistId: string) {
    const [summary, topTracks] = await Promise.all([
      this.buildSummary(artistId),
      this.buildTopTracks(artistId),
    ]);

    return {
      success: true,
      data: { summary, topTracks },
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
      .orderBy('netEarnings', 'DESC')
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
}
