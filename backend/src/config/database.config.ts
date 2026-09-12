import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'codemart',
  password: process.env.DB_PASSWORD || 'codemart',
  database: process.env.DB_NAME || 'codemart',
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
  poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  autoLoadEntities: true,
  migrations: ['dist/database/migrations/*.{ts,js}'],
  migrationsRun: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
}));
