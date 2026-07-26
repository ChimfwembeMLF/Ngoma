import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdsConfig,
  DEFAULT_ADS_CONFIG,
  mergeAdsConfig,
} from '../../common/ads-config.util';
import { PlatformSettings } from '../platform/entities/platform-settings.entity';
import { Track, PricingType } from '../tracks/entities/track.entity';
import { AdCreative } from './entities/ad-creative.entity';
import { AdSession, AdSessionStatus } from './entities/ad-session.entity';
import { AdImpression } from './entities/ad-impression.entity';
import { CreateAdCreativeDto } from './dto/create-ad-creative.dto';
import { UpdateAdCreativeDto } from './dto/update-ad-creative.dto';
import { UpdateAdsConfigDto } from './dto/update-ads-config.dto';

const SETTINGS_ID = 1;
const SESSION_TTL_MS = 2 * 60 * 1000;

const PLACEHOLDER_CREATIVE = {
  id: 'placeholder',
  title: 'Discover more on Ngoma',
  imageUrl: '/ngoma-ad-placeholder.svg',
  clickUrl: undefined as string | undefined,
};

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(AdCreative)
    private readonly creativesRepo: Repository<AdCreative>,
    @InjectRepository(AdSession)
    private readonly sessionsRepo: Repository<AdSession>,
    @InjectRepository(AdImpression)
    private readonly impressionsRepo: Repository<AdImpression>,
    @InjectRepository(PlatformSettings)
    private readonly settingsRepo: Repository<PlatformSettings>,
    @InjectRepository(Track)
    private readonly tracksRepo: Repository<Track>,
  ) {}

  async getPublicConfig() {
    const config = await this.getConfig();
    return { success: true, data: config };
  }

  async getConfig(): Promise<AdsConfig> {
    const row = await this.getSettingsRow();
    return mergeAdsConfig(row.adsConfig as Partial<AdsConfig>);
  }

  async updateConfig(dto: UpdateAdsConfigDto) {
    const row = await this.getSettingsRow();
    const current = mergeAdsConfig(row.adsConfig as Partial<AdsConfig>);
    row.adsConfig = {
      adsEnabled: dto.adsEnabled ?? current.adsEnabled,
      gateSeconds: dto.gateSeconds ?? current.gateSeconds,
    };
    await this.settingsRepo.save(row);
    return { success: true, data: mergeAdsConfig(row.adsConfig as Partial<AdsConfig>) };
  }

  async listCreatives() {
    const items = await this.creativesRepo.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { success: true, data: items };
  }

  async createCreative(dto: CreateAdCreativeDto) {
    const creative = this.creativesRepo.create({
      title: dto.title,
      imageUrl: dto.imageUrl,
      clickUrl: dto.clickUrl,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
    const saved = await this.creativesRepo.save(creative);
    return { success: true, data: saved };
  }

  async updateCreative(id: string, dto: UpdateAdCreativeDto) {
    const creative = await this.creativesRepo.findOne({ where: { id } });
    if (!creative) throw new NotFoundException('Creative not found');
    Object.assign(creative, dto);
    const saved = await this.creativesRepo.save(creative);
    return { success: true, data: saved };
  }

  async deleteCreative(id: string) {
    const creative = await this.creativesRepo.findOne({ where: { id } });
    if (!creative) throw new NotFoundException('Creative not found');
    await this.creativesRepo.remove(creative);
    return { success: true, data: { deleted: true } };
  }

  async pickCreative() {
    const active = await this.creativesRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
    if (active.length === 0) return PLACEHOLDER_CREATIVE;
    const picked = active[Math.floor(Math.random() * active.length)];
    return {
      id: picked.id,
      title: picked.title,
      imageUrl: picked.imageUrl,
      clickUrl: picked.clickUrl,
    };
  }

  async createSession(trackId: string, userId: string) {
    const track = await this.tracksRepo.findOne({
      where: { id: trackId, isActive: true, isPublished: true },
    });
    if (!track) throw new NotFoundException('Track not found');
    if (track.pricingType !== PricingType.FREE) {
      throw new BadRequestException('Ad sessions are only for free tracks');
    }

    const config = await this.getConfig();
    if (!config.adsEnabled) {
      throw new BadRequestException('Ads are disabled');
    }

    const creative = await this.pickCreative();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    const session = this.sessionsRepo.create({
      trackId,
      userId,
      creativeId: creative.id === 'placeholder' ? undefined : creative.id,
      status: AdSessionStatus.PENDING,
      expiresAt,
    });
    const saved = await this.sessionsRepo.save(session);

    return {
      success: true,
      data: {
        sessionId: saved.id,
        gateSeconds: config.gateSeconds,
        creative,
      },
    };
  }

  async completeSession(sessionId: string, userId: string) {
    const session = await this.sessionsRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) {
      throw new ForbiddenException('Session does not belong to user');
    }
    if (session.status === AdSessionStatus.EXPIRED || session.expiresAt < new Date()) {
      if (session.status !== AdSessionStatus.EXPIRED) {
        session.status = AdSessionStatus.EXPIRED;
        await this.sessionsRepo.save(session);
      }
      throw new GoneException('Session expired');
    }
    if (session.status !== AdSessionStatus.PENDING) {
      throw new BadRequestException('Session already completed');
    }

    const config = await this.getConfig();
    const eligibleAt = new Date(session.createdAt.getTime() + config.gateSeconds * 1000);
    if (new Date() < eligibleAt) {
      throw new BadRequestException('Countdown not complete');
    }

    session.status = AdSessionStatus.COMPLETED;
    session.completedAt = new Date();
    await this.sessionsRepo.save(session);

    await this.impressionsRepo.save(
      this.impressionsRepo.create({
        sessionId: session.id,
        trackId: session.trackId,
        userId: session.userId,
        creativeId: session.creativeId,
      }),
    );

    return { success: true, data: { sessionId: session.id, status: session.status } };
  }

  async validateSessionForDownload(sessionId: string, userId: string, trackId: string) {
    const session = await this.sessionsRepo.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new ForbiddenException('Ad completion required');
    }
    if (session.userId !== userId || session.trackId !== trackId) {
      throw new ForbiddenException('Ad completion required');
    }
    if (session.status === AdSessionStatus.CONSUMED) {
      throw new ForbiddenException('Ad session already used');
    }
    if (session.status !== AdSessionStatus.COMPLETED) {
      throw new ForbiddenException('Ad completion required');
    }
    if (session.expiresAt < new Date()) {
      session.status = AdSessionStatus.EXPIRED;
      await this.sessionsRepo.save(session);
      throw new ForbiddenException('Ad session expired');
    }

    session.status = AdSessionStatus.CONSUMED;
    session.consumedAt = new Date();
    await this.sessionsRepo.save(session);
  }

  async countImpressionsLast30Days(): Promise<number> {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 30);
    since.setUTCHours(0, 0, 0, 0);
    return this.impressionsRepo
      .createQueryBuilder('i')
      .where('i.completed_at >= :since', { since })
      .getCount();
  }

  private async getSettingsRow(): Promise<PlatformSettings> {
    let row = await this.settingsRepo.findOne({ where: { id: SETTINGS_ID } });
    if (!row) {
      row = await this.settingsRepo.save(
        this.settingsRepo.create({
          id: SETTINGS_ID,
          theme: {},
          themePresetId: 'spotify',
          branding: {},
          savedBrandingTemplates: [],
          adsConfig: DEFAULT_ADS_CONFIG,
        }),
      );
    }
    if (!row.adsConfig) {
      row.adsConfig = DEFAULT_ADS_CONFIG;
    }
    return row;
  }
}
