import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

export const throttleOptionsFromConfig = (
  config: ConfigService,
): ThrottlerModuleOptions => ({
  throttlers: [
    {
      name: 'default',
      ttl: config.get<number>('THROTTLE_TTL', 60_000),
      limit: config.get<number>('THROTTLE_LIMIT', 100),
    },
  ],
});
