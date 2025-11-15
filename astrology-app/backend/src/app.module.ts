import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Config
import { databaseConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { appConfig } from './config/app.config';
import { aiConfig } from './config/ai.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ChartsModule } from './modules/charts/charts.module';
import { ForecastsModule } from './modules/forecasts/forecasts.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TarotModule } from './modules/tarot/tarot.module';
import { CoffeeReadingModule } from './modules/coffee-reading/coffee-reading.module';
import { NumerologyModule } from './modules/numerology/numerology.module';
import { AiAssistantModule } from './modules/ai-assistant/ai-assistant.module';
import { ActionsModule } from './modules/actions/actions.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, aiConfig],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('app.nodeEnv') === 'development',
        logging: configService.get('app.nodeEnv') === 'development',
      }),
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Scheduling (for daily forecasts, etc.)
    ScheduleModule.forRoot(),

    // Feature Modules
    AuthModule,
    UsersModule,
    ProfilesModule,
    ChartsModule,
    ForecastsModule,
    SubscriptionsModule,
    TarotModule,
    CoffeeReadingModule,
    NumerologyModule,
    AiAssistantModule,
    ActionsModule,
  ],
})
export class AppModule {}
