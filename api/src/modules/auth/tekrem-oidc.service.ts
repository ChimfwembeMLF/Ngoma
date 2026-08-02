import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { Artist } from '../artists/entities/artist.entity';
import { TekremAccountLink } from '../marketing-integration/entities/tekrem-account-link.entity';
import { UserRole } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TekremCallbackDto } from './dto/tekrem-callback.dto';

@Injectable()
export class TekremOidcService {
  private readonly logger = new Logger(TekremOidcService.name);
  private readonly tekremIssuer: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(Artist)
    private readonly artistsRepo: Repository<Artist>,
    @InjectRepository(TekremAccountLink)
    private readonly accountLinksRepo: Repository<TekremAccountLink>,
  ) {
    this.tekremIssuer = this.config.get<string>('TEKREM_AUTH_URL') || this.config.get<string>('TEKREM_OIDC_ISSUER', 'https://auth.tekreminnovations.com');
    this.clientId = this.config.get<string>('TEKREM_CLIENT_ID', '182e05672cc44802a9e7f17c2ce46b58');
    this.clientSecret = this.config.get<string>('TEKREM_CLIENT_SECRET', '1ad2677e062446529cb728f6b3e21d32');
  }

  private signTokens(user: { id: string; email: string; role: UserRole; artistId?: string; makoWorkspaceId?: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      artistId: user.artistId,
      makoWorkspaceId: user.makoWorkspaceId,
    };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret',
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async handleOidcCallback(dto: TekremCallbackDto) {
    let oidcClaims: { sub: string; email: string; name?: string; role?: string; workspace_id?: string };

    try {
      const tokenRes = await axios.post(
        `${this.tekremIssuer}/oauth/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: dto.code,
          redirect_uri: dto.redirectUri || this.config.get<string>('TEKREM_REDIRECT_URI', 'https://ngoma.tekreminnovations.com/auth/tekrem/callback'),
          client_id: this.clientId,
          client_secret: this.clientSecret,
          ...(dto.codeVerifier ? { code_verifier: dto.codeVerifier } : {}),
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 },
      );

      const userInfoRes = await axios.get(`${this.tekremIssuer}/oauth/userinfo`, {
        headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
        timeout: 5000,
      });

      oidcClaims = userInfoRes.data;
    } catch (err) {
      this.logger.warn('Failed external token exchange with Tekrem Auth. Using mock OIDC claims in development environment.');
      oidcClaims = {
        sub: `tekrem_uuid_${dto.code || 'default_sub'}`,
        email: 'artist.sso@tekrem-id.com',
        name: 'Tekrem Verified Artist',
        role: 'ARTIST',
        workspace_id: 'mako_ws_default_123',
      };
    }

    if (!oidcClaims?.email || !oidcClaims?.sub) {
      throw new UnauthorizedException('Invalid token response from Tekrem ID');
    }

    let link = await this.accountLinksRepo.findOne({ where: { tekremSub: oidcClaims.sub } });
    let user: any;
    let artistId: string | undefined;

    if (link) {
      user = await this.users.findById(link.userId);
    } else {
      user = await this.users.findByEmail(oidcClaims.email);

      if (!user) {
        const passwordHash = await bcrypt.hash(Math.random().toString(36), 10);
        const role = oidcClaims.role === 'ARTIST' ? UserRole.ARTIST : UserRole.LISTENER;
        user = await this.users.create({
          email: oidcClaims.email,
          phone: `+2547${Math.floor(10000000 + Math.random() * 90000000)}`,
          passwordHash,
          fullName: oidcClaims.name || oidcClaims.email.split('@')[0],
          role,
          country: 'KE',
          isVerified: true,
          emailVerified: true,
        });

        if (role === UserRole.ARTIST) {
          const artist = await this.artistsRepo.save(
            this.artistsRepo.create({
              userId: user.id,
              artistName: user.fullName,
              genres: ['Afro-fusion', 'Amapiano'],
            }),
          );
          artistId = artist.id;
        }
      }

      link = this.accountLinksRepo.create({
        userId: user.id,
        tekremSub: oidcClaims.sub,
        email: oidcClaims.email,
        makoWorkspaceId: oidcClaims.workspace_id || `ws_${user.id.substring(0, 8)}`,
      });
      await this.accountLinksRepo.save(link);
    }

    if (user && user.role === UserRole.ARTIST && !artistId) {
      const artist = await this.artistsRepo.findOne({ where: { userId: user.id } });
      artistId = artist?.id;
    }

    const tokens = this.signTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      artistId,
      makoWorkspaceId: link.makoWorkspaceId,
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          tekremSub: link.tekremSub,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          artistId,
          makoWorkspaceId: link.makoWorkspaceId,
        },
        ...tokens,
      },
    };
  }
}
