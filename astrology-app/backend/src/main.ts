import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  // Enable CORS
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL'),
      'http://localhost:8081', // Expo default
      'exp://192.168.*.*:*', // Expo LAN
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  console.log(`🚀 Astrology Backend running on: http://localhost:${port}/api/v1`);
}
bootstrap();
