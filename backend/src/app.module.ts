import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig from './config/jwt.config';
import mailConfig from './config/mail.config';
import throttlerConfig from './config/throttler.config';

import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartModule } from './modules/cart/cart.module';
import { BannersModule } from './modules/banners/banners.module';
import { ShopsModule } from './modules/shops/shops.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ContactModule } from './modules/contact/contact.module';
import { SellerApplicationsModule } from './modules/seller-applications/seller-applications.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    // ===== Configuration =====
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig, mailConfig, throttlerConfig],
      envFilePath: ['.env'],
      cache: true,
    }),

    // ===== Database =====
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        synchronize: config.get<boolean>('database.synchronize'),
        logging: config.get<boolean>('database.logging'),
        entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: false,
        ssl: config.get('database.ssl') || false,
        extra: {
          poolSize: config.get<number>('database.poolSize'),
        },
      }),
      inject: [ConfigService],
    }),

    // ===== Throttling (global rate-limit) =====
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: config.get<number>('throttler.ttl', 60000),
          limit: config.get<number>('throttler.limit', 120),
        },
        {
          name: 'auth',
          ttl: config.get<number>('throttler.authTtl', 60000),
          limit: config.get<number>('throttler.authLimit', 10),
        },
      ],
      inject: [ConfigService],
    }),

    // ===== Scheduled jobs =====
    ScheduleModule.forRoot(),

    // ===== Mailer =====
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('mail.host'),
          port: config.get<number>('mail.port'),
          auth: {
            user: config.get<string>('mail.user'),
            pass: config.get<string>('mail.pass'),
          },
        },
        defaults: {
          from: `"${config.get<string>('mail.fromName')}" <${config.get<string>('mail.from')}>`,
        },
      }),
      inject: [ConfigService],
    }),

    // ===== Feature modules =====
    RedisModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CoursesModule,
    ReviewsModule,
    QuestionsModule,
    OrdersModule,
    CartModule,
    BannersModule,
    ShopsModule,
    SettingsModule,
    ContactModule,
    SellerApplicationsModule,
    AdminModule,
    UploadsModule,
    NotificationsModule,
  ],
  providers: [
    // Global JWT guard (routes opt-out via @Public)
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
