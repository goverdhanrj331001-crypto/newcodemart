import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../../database/entities/user.entity';
import { RefreshToken } from '../../database/entities/refresh-token.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * Global JWT module — registers JwtService globally so any guard (e.g.
 * OptionalJwtGuard, JwtAuthGuard) can inject it from anywhere without
 * having to import JwtModule in every feature module.
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.accessExpiresIn') as any,
        },
      }),
    }),
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

