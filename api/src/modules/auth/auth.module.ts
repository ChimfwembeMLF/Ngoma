import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { Artist } from '../artists/entities/artist.entity';
import { TekremOidcService } from './tekrem-oidc.service';
import { TekremOidcController } from './tekrem-oidc.controller';
import { TekremAccountLink } from '../marketing-integration/entities/tekrem-account-link.entity';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'dev_jwt_secret',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forFeature([Artist, TekremAccountLink]),
  ],
  controllers: [AuthController, TekremOidcController],
  providers: [AuthService, JwtStrategy, TekremOidcService],
  exports: [AuthService, JwtModule, TekremOidcService],
})
export class AuthModule {}
