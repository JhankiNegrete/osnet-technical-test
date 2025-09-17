import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { RedisOptions } from './config/cache';
import { ThrottlerConfig } from './config/throttler';
import { MainDataSourceConfig } from './config/database';

import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(MainDataSourceConfig),
    ThrottlerModule.forRootAsync(ThrottlerConfig),
    CacheModule.registerAsync(RedisOptions),
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
