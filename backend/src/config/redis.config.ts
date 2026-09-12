import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  const password = process.env.REDIS_PASSWORD || '';
  const auth = password ? `:${encodeURIComponent(password)}@` : '';
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
    url: `redis://${auth}${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}/${process.env.REDIS_DB || '0'}`,
  };
});
