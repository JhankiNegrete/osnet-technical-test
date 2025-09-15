import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ThrottlerAsyncOptions,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';

export const ThrottlerConfig: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
    throttlers: [
      {
        limit: Number(config.get<string>('RATE_LIMIT') ?? '10'),
        ttl: Number(config.get<string>('RATE_TTL') ?? '60'),
      },
    ],
  }),
};
