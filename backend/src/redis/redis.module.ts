import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const IORedis = require('ioredis');
        const client = new IORedis({
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get<string>('redis.password') || undefined,
          db: config.get<number>('redis.db'),
          retryStrategy: (times: number) => Math.min(times * 200, 2000),
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
          // allowOfflineQueue: true,
        });
        // Log connection issues without crashing the app
        client.on('error', (err: Error) => {
          // eslint-disable-next-line no-console
          console.warn('[redis] error:', err.message);
        });
        client.on('connect', () => {
          // eslint-disable-next-line no-console
          console.log('[redis] connected');
        });
        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}
