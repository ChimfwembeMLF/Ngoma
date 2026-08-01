import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartLinkAttribution } from './entities/smart-link-attribution.entity';
import { CreateSmartLinkDto } from './dto/create-smart-link.dto';

@Injectable()
export class SmartLinksService {
  private readonly logger = new Logger(SmartLinksService.name);

  constructor(
    @InjectRepository(SmartLinkAttribution)
    private readonly attributionsRepo: Repository<SmartLinkAttribution>,
  ) {}

  async createSmartLink(dto: CreateSmartLinkDto) {
    const slug = dto.customSlug || `ngoma-${Math.random().toString(36).substring(2, 9)}`;

    const existing = await this.attributionsRepo.findOne({ where: { slug } });
    if (existing && dto.customSlug) {
      throw new ConflictException('Custom slug is already in use');
    }

    const attribution = this.attributionsRepo.create({
      slug,
      campaignId: dto.campaignId,
      releaseId: dto.releaseId,
      referralChannel: dto.referralChannel || 'social_suite',
      visitorToken: 'creator_initial_seed',
      converted: false,
    });

    const saved = await this.attributionsRepo.save(attribution);
    const fullUrl = `http://localhost:3000/link/${slug}`;

    return {
      success: true,
      data: {
        id: saved.id,
        slug,
        fullUrl,
        campaignId: saved.campaignId,
        releaseId: saved.releaseId,
      },
    };
  }

  async trackVisit(slug: string, refChannel?: string, visitorToken = `token_${Math.random().toString(36).substring(2)}`) {
    const existing = await this.attributionsRepo.findOne({ where: { slug } });
    if (!existing) {
      throw new NotFoundException('Promotional smart link not found');
    }

    const visit = this.attributionsRepo.create({
      slug,
      campaignId: existing.campaignId,
      releaseId: existing.releaseId,
      referralChannel: refChannel || existing.referralChannel || 'direct',
      visitorToken,
      converted: false,
    });

    await this.attributionsRepo.save(visit);

    return {
      success: true,
      data: {
        redirectUrl: `http://localhost:3000/tracks/${existing.releaseId}?mako_cid=${existing.campaignId}&slug=${slug}`,
        visitorToken,
      },
    };
  }
}
