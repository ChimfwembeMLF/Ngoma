import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MarketingIntegrationModule } from '../src/modules/marketing-integration/marketing-integration.module';

describe('Marketing Integration & Tekrem OIDC (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MarketingIntegrationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Smart Links & Referral Attribution (/api/v1/marketing/smart-links)', () => {
    it('GET /:slug should capture referral attribution and return target redirect URI', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/marketing/smart-links/test-campaign-slug?ref=instagram_story')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('redirectUri');
    });
  });
});
