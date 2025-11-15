import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Services
import { CacheModule } from './services/cache.module';
import { LoggerModule } from './services/logger.module';
import { MetricsModule } from './services/metrics.module';

// Config
import { databaseConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { appConfig } from './config/app.config';
import { aiConfig } from './config/ai.config';
import { stripeConfig } from './config/stripe.config';

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
import { TrialsModule } from './modules/trials/trials.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { BiorhythmModule } from './modules/biorhythm/biorhythm.module';
import { ChakrasModule } from './modules/chakras/chakras.module';
import { RelationshipModule } from './modules/relationship/relationship.module';
import { SoulmateModule } from './modules/soulmate/soulmate.module';
import { AuraScanModule } from './modules/aura-scan/aura-scan.module';
import { JournalModule } from './modules/journal/journal.module';
import { CosmicClimateModule } from './modules/cosmic-climate/cosmic-climate.module';
import { AstroEventsModule } from './modules/astro-events/astro-events.module';
import { CalendarsModule } from './modules/calendars/calendars.module';
import { FamousPeopleModule } from './modules/famous-people/famous-people.module';
import { LiveServicesModule } from './modules/live-services/live-services.module';
import { AstroMapModule } from './modules/astro-map/astro-map.module';
import { AdvancedChartsModule } from './modules/advanced-charts/advanced-charts.module';
import { TodayModule } from './modules/today/today.module';
import { EducationModule } from './modules/education/education.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { ServicesModule } from './services/services.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, aiConfig, stripeConfig],
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

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
    TrialsModule,
    SubscriptionPlansModule,
    BiorhythmModule,
    ChakrasModule,
    RelationshipModule,
    SoulmateModule,
    AuraScanModule,
    JournalModule,
    CosmicClimateModule,
    AstroEventsModule,
    CalendarsModule,
    FamousPeopleModule,
    LiveServicesModule,
    AstroMapModule,
    AdvancedChartsModule,
    TodayModule,
    EducationModule,
    WidgetsModule,
    ServicesModule,
    PaymentsModule,
    HealthModule,
    CacheModule,
    LoggerModule,
    MetricsModule,
  ],
})
export class AppModule {}
