import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Shop } from './entities/shop.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Course } from './entities/course.entity';
import { Review } from './entities/review.entity';
import { Question } from './entities/question.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Banner } from './entities/banner.entity';
import { Setting } from './entities/setting.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { SellerApplication } from './entities/seller-application.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuditLog } from './entities/audit-log.entity';
import { Subscription } from './entities/subscription.entity';

const ENTITIES = [
  User,
  Shop,
  Product,
  Category,
  Course,
  Review,
  Question,
  Order,
  OrderItem,
  Banner,
  Setting,
  ContactMessage,
  SellerApplication,
  RefreshToken,
  AuditLog,
  Subscription,
];

/**
 * Standalone TypeORM DataSource — used by CLI commands (migrations, seeds)
 * OUTSIDE the NestJS application context.
 *
 * Inside the app, TypeOrmModule.forRootAsync() reads the same env vars.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'codemart',
  password: process.env.DB_PASSWORD || 'codemart',
  database: process.env.DB_NAME || 'codemart',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: ENTITIES,
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
  extra: {
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  },
});

export default AppDataSource;
