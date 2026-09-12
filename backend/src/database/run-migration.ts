/**
 * Lightweight migration runner.
 *
 * This script performs TypeORM `synchronize: true` on first launch (dev mode),
 * or runs pending SQL migrations (production mode).
 *
 * In production:
 *   DB_SYNC=false  →  runs `migration:run`
 *   DB_SYNC=true   →  runs `synchronize` (NOT recommended for prod)
 *
 * Usage:
 *   node dist/database/run-migration.js
 */
import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function run() {
  await AppDataSource.initialize();
  console.log('✅ DataSource initialised');

  if (process.env.DB_SYNC === 'true') {
    console.log('• DB_SYNC=true — running synchronize()...');
    await AppDataSource.synchronize();
    console.log('✅ Schema synchronised');
  } else {
    console.log('• DB_SYNC=false — running pending migrations...');
    const migrations = await AppDataSource.runMigrations();
    console.log(`✅ ${migrations.length} migration(s) executed`);
  }

  await AppDataSource.destroy();
}

run().catch((e) => {
  console.error('❌ Migration failed:', e);
  process.exit(1);
});
