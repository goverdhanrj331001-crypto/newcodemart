import { registerAs } from '@nestjs/config';

export default registerAs('throttler', () => ({
  ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
  limit: parseInt(process.env.THROTTLE_LIMIT || '120', 10),
  authTtl: parseInt(process.env.AUTH_THROTTLE_TTL || '60000', 10),
  authLimit: parseInt(process.env.AUTH_THROTTLE_LIMIT || '10', 10),
}));
