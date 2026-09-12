import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT || '4000', 10),
  url: process.env.APP_URL || 'http://localhost:4000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  uploadDir: process.env.UPLOAD_DIR || '/app/uploads',
  maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '25', 10),
  swaggerPath: process.env.SWAGGER_PATH || 'docs',
}));
