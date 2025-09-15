import * as mysql2 from 'mysql2';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const MainDataSourceConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    driver: mysql2,
    host: configService.getOrThrow<string>('DB_HOST'),
    port: +configService.getOrThrow('DB_PORT'),
    database: configService.getOrThrow<string>('DB_NAME'),
    username: configService.getOrThrow<string>('DB_USERNAME'),
    password: configService.getOrThrow<string>('DB_PASSWORD'),
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
  }),
};
