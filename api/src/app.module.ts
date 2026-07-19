import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpAdapterHost } from '@nestjs/core';
import { typeOrmConfigFactory } from './database/ormconfig';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { AppThrottlerGuard } from './common/guards/app-throttler.guard';
import { throttleOptionsFromConfig } from './common/throttle.config';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { MediaModule } from './modules/media/media.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { AdminModule } from './modules/admin/admin.module';
import { PlatformModule } from './modules/platform/platform.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => throttleOptionsFromConfig(config),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    HealthModule,
    AuthModule,
    UserModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    MediaModule,
    PaymentsModule,
    DiscoveryModule,
    AdminModule,
    PlatformModule,
    AnalyticsModule,
    PlaylistsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
    {
      provide: APP_FILTER,
      useFactory: (httpAdapterHost: HttpAdapterHost) =>
        new AllExceptionsFilter(httpAdapterHost),
      inject: [HttpAdapterHost],
    },
  ],
})
export class AppModule {}
