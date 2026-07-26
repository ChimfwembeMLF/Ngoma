import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from '../snake-naming.strategy';

export function typeOrmConfigFactory(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
    username: configService.get<string>('DB_USERNAME') || 'ngoma',
    password: configService.get<string>('DB_PASSWORD') || 'ngoma',
    database: configService.get<string>('DB_DATABASE') || 'ngoma',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../../database/migrations/*.{ts,js}'],
    migrationsRun: configService.get<string>('NODE_ENV') === 'production',
    synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
    namingStrategy: new SnakeNamingStrategy(),
  };
}
