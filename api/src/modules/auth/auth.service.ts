import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../user/entities/user.entity';
import { Artist } from '../artists/entities/artist.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(Artist)
    private readonly artistsRepo: Repository<Artist>,
  ) {}

  private signTokens(user: { id: string; email: string; role: UserRole; artistId?: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      artistId: user.artistId,
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

  async register(dto: RegisterDto) {
    if (await this.users.findByEmail(dto.email)) {
      throw new ConflictException('Email already registered');
    }
    if (await this.users.findByPhone(dto.phone)) {
      throw new ConflictException('Phone already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      fullName: dto.fullName,
      country: dto.country,
      role: dto.role,
    });

    let artistId: string | undefined;
    if (dto.role === UserRole.ARTIST) {
      const artistName = dto.artistName || dto.fullName;
      const artist = await this.artistsRepo.save(
        this.artistsRepo.create({
          userId: user.id,
          artistName,
          genres: [],
        }),
      );
      artistId = artist.id;
    }

    const tokens = this.signTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      artistId,
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          artistId,
        },
        ...tokens,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.users.updateLastLogin(user.id);

    let artistId: string | undefined;
    if (user.role === UserRole.ARTIST) {
      const artist = await this.artistsRepo.findOne({ where: { userId: user.id } });
      artistId = artist?.id;
    }

    const tokens = this.signTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      artistId,
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          artistId,
        },
        ...tokens,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret',
      }) as { sub: string; type?: string };
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.users.findById(decoded.sub);
      if (!user) throw new UnauthorizedException('User not found');

      let artistId: string | undefined;
      if (user.role === UserRole.ARTIST) {
        const artist = await this.artistsRepo.findOne({ where: { userId: user.id } });
        artistId = artist?.id;
      }

      const tokens = this.signTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        artistId,
      });

      return { success: true, data: tokens };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    let artistId: string | undefined;
    let artistName: string | undefined;
    if (user.role === UserRole.ARTIST) {
      const artist = await this.artistsRepo.findOne({ where: { userId: user.id } });
      artistId = artist?.id;
      artistName = artist?.artistName;
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        artistId,
        artistName,
      },
    };
  }
}
