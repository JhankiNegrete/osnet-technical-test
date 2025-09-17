import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: configService.get<string>('CLIENTS_ACCESS')?.split(',') || '*',
    credentials: true,
  });

  await app.listen(configService.getOrThrow<number>('PORT') || 3000, '0.0.0.0');

  logger.log(`App running on port ${configService.get<number>('PORT')}`);
}
void bootstrap();
