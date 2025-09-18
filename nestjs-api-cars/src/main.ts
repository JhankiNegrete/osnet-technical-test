import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

/**
 * Main function that initializes the NestJS application.
 * - Configures global prefixes
 * - Enables global validation
 * - Enables CORS
 * - Configures Swagger for API documentation
 */
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OSNet Cars API')
    .setDescription('API para gestión de usuarios, productos, órdenes y pagos')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.getOrThrow<number>('PORT') || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`App running on port ${port}`);
}
void bootstrap();
