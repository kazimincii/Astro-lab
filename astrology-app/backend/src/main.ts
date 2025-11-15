import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const nodeEnv = configService.get('NODE_ENV') || 'development';

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

  // Swagger API Documentation (only in development)
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Astrology Super App API')
      .setDescription(
        'Complete API documentation for the Astrology Super App - including birth charts, ' +
        'horoscopes, tarot readings, numerology, AI assistant, and subscription management.'
      )
      .setVersion('1.0.0')
      .addTag('auth', 'Authentication endpoints')
      .addTag('profiles', 'User profile management')
      .addTag('charts', 'Birth chart calculations')
      .addTag('forecasts', 'Daily, weekly, and monthly horoscopes')
      .addTag('tarot', 'Tarot card readings')
      .addTag('coffee-reading', 'Coffee cup fortune reading')
      .addTag('numerology', 'Numerology reports')
      .addTag('compatibility', 'Relationship compatibility analysis')
      .addTag('ai-assistant', 'AI-powered astrology assistant')
      .addTag('subscriptions', 'Subscription plans and management')
      .addTag('actions', 'Premium action tracking')
      .addTag('health', 'Health check endpoints')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .addServer('http://localhost:3000', 'Local development')
      .addServer('https://api.astrology-app.com', 'Production')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customSiteTitle: 'Astrology API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
  }

  await app.listen(port);
  console.log(`🚀 Astrology Backend running on: http://localhost:${port}/api/v1`);
}
bootstrap();
