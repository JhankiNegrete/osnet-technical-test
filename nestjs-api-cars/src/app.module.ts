import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CacheModule } from '@nestjs/cache-manager';

// import { RedisOptions } from './config/cache';
import { MainDataSourceConfig } from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(MainDataSourceConfig),
    // CacheModule.registerAsync(RedisOptions),
  ],
  //providers: [],
})
export class AppModule {}
