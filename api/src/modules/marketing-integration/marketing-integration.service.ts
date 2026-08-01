import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakoPromotionCampaign, CampaignStatus } from './entities/mako-promotion-campaign.entity';
import { SmartLinkAttribution } from './entities/smart-link-attribution.entity';
import { MakoHttpService } from './mako-http.service';
import { PromoteReleaseDto } from './dto/promote-release.dto';

@Injectable()
export class MarketingIntegrationService {
  private readonly logger = new Logger(MarketingIntegrationService.name);

  constructor(
    @InjectRepository(MakoPromotionCampaign)
    private readonly campaignsRepo: Repository<MakoPromotionCampaign>,
    @InjectRepository(SmartLinkAttribution)
    private readonly attributionsRepo: Repository<SmartLinkAttribution>,
    private readonly makoHttp: MakoHttpService,
  ) {}

  async prefillPromotion(artistId: string, dto: PromoteReleaseDto) {
    const mockTitle = `Track Release #${dto.releaseId.substring(0, 6)}`;
    const mockArtwork = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';
    const slug = `mako-${dto.targetGenre.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).substring(2, 8)}`;
    const landingUrl = `http://localhost:3000/link/${slug}`;

    const prefill = await this.makoHttp.prefillSocialCampaign({
      title: mockTitle,
      artworkUrl: mockArtwork,
      landingUrl,
      genre: dto.targetGenre,
    });

    const campaign = this.campaignsRepo.create({
      artistId,
      releaseId: dto.releaseId,
      makoCampaignId: prefill.makoCampaignId,
      releaseTitle: mockTitle,
      artworkUrl: mockArtwork,
      targetGenre: dto.targetGenre,
      status: CampaignStatus.ACTIVE,
      totalSpend: 0.00,
    });
    const savedCampaign = await this.campaignsRepo.save(campaign);

    const smartLink = this.attributionsRepo.create({
      slug,
      campaignId: savedCampaign.id,
      releaseId: dto.releaseId,
      referralChannel: 'universal_prefill',
      visitorToken: 'initial_creator_link',
      converted: false,
    });
    await this.attributionsRepo.save(smartLink);

    return {
      success: true,
      data: {
        campaignId: savedCampaign.id,
        makoRedirectUrl: prefill.redirectUrl,
        smartLinkSlug: slug,
        makoCampaignId: prefill.makoCampaignId,
      },
    };
  }

  async listArtistPromotions(artistId: string) {
    const campaigns = await this.campaignsRepo.find({
      where: { artistId },
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      data: campaigns,
    };
  }
}
