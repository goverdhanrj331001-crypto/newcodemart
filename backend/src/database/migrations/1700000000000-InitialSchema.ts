import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial schema — creates all tables for the CodeMart / Pixer backend.
 *
 * Run via `npm run migration:run` after `migration:generate` is unnecessary
 * because TypeORM synchronize=true is acceptable for the first release.
 *
 * This migration exists for production deploys where synchronize is disabled.
 */
export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  async up(q: QueryRunner): Promise<void> {
    // USERS
    await q.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('customer','store_owner','admin','super_admin');
      CREATE TYPE "user_status_enum" AS ENUM ('Active','Inactive','Banned');
      CREATE TABLE IF NOT EXISTS "users" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name"          varchar(150) NOT NULL,
        "email"         varchar(255) NOT NULL UNIQUE,
        "password"      varchar(255),
        "avatar"        varchar(255),
        "role"          "user_role_enum" NOT NULL DEFAULT 'customer',
        "status"        "user_status_enum" NOT NULL DEFAULT 'Active',
        "walletPoints"  int NOT NULL DEFAULT 0,
        "bio"           varchar(255),
        "phone"         varchar(100),
        "country"       varchar(100),
        "provider"      varchar(50) NOT NULL DEFAULT 'local',
        "emailVerified" boolean NOT NULL DEFAULT false,
        "emailVerificationToken" varchar(255),
        "passwordResetToken"    varchar(255),
        "passwordResetExpires"  timestamptz,
        "createdAt"     timestamptz NOT NULL DEFAULT now(),
        "updatedAt"     timestamptz NOT NULL DEFAULT now()
      );
    `);

    // SHOPS
    await q.query(`
      CREATE TYPE "shop_status_enum" AS ENUM ('Active','Pending','Suspended');
      CREATE TABLE IF NOT EXISTS "shops" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name"          varchar(255) NOT NULL,
        "logo"          varchar(255),
        "description"   text,
        "banner"        varchar(255),
        "slug"          varchar(255),
        "website"       varchar(255),
        "status"        "shop_status_enum" NOT NULL DEFAULT 'Pending',
        "productsCount" int NOT NULL DEFAULT 0,
        "ordersCount"   int NOT NULL DEFAULT 0,
        "revenue"       decimal(12,2) NOT NULL DEFAULT 0,
        "commissionRate" decimal(5,2) NOT NULL DEFAULT 15.0,
        "ownerId"       uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "createdAt"     timestamptz NOT NULL DEFAULT now(),
        "updatedAt"     timestamptz NOT NULL DEFAULT now()
      );
    `);

    // CATEGORIES
    await q.query(`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name"          varchar(150) NOT NULL,
        "slug"          varchar(200) NOT NULL UNIQUE,
        "description"   text,
        "count"         varchar(50) NOT NULL DEFAULT '0 Products',
        "productCount"  int NOT NULL DEFAULT 0,
        "type"          varchar(20) NOT NULL DEFAULT 'tech',
        "gradient"      varchar(255),
        "monogram"      varchar(8),
        "iconName"      varchar(100),
        "filterCategory" varchar(100),
        "isActive"      boolean NOT NULL DEFAULT true,
        "sortOrder"     int NOT NULL DEFAULT 0,
        "createdAt"     timestamptz NOT NULL DEFAULT now(),
        "updatedAt"     timestamptz NOT NULL DEFAULT now()
      );
    `);

    // PRODUCTS
    await q.query(`
      CREATE TYPE "product_status_enum" AS ENUM ('draft','published','pending','rejected');
      CREATE TABLE IF NOT EXISTS "products" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title"         varchar(255) NOT NULL,
        "slug"          varchar(320) NOT NULL UNIQUE,
        "description"   text,
        "fullDescriptionHtml" text,
        "image"         varchar(1024) NOT NULL,
        "gallery"       simple-array,
        "price"         decimal(12,2) NOT NULL,
        "originalPrice" decimal(12,2),
        "isFree"        boolean NOT NULL DEFAULT false,
        "currency"      varchar(8) NOT NULL DEFAULT 'USD',
        "category"      varchar(100) NOT NULL DEFAULT 'General',
        "categoryId"    uuid REFERENCES "categories"("id") ON DELETE SET NULL,
        "features"      simple-array,
        "rating"        decimal(3,2) NOT NULL DEFAULT 0,
        "totalReviews"  int NOT NULL DEFAULT 0,
        "salesCount"    int NOT NULL DEFAULT 0,
        "downloadCount" int NOT NULL DEFAULT 0,
        "liveDemoUrl"   varchar(512),
        "sourceFileUrl" varchar(512),
        "specifications" jsonb,
        "status"        "product_status_enum" NOT NULL DEFAULT 'published',
        "isDeleted"     boolean NOT NULL DEFAULT false,
        "authorId"      uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "shopId"        uuid REFERENCES "shops"("id") ON DELETE SET NULL,
        "createdAt"     timestamptz NOT NULL DEFAULT now(),
        "updatedAt"     timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS "idx_products_status"   ON "products"("status");
      CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products"("categoryId");
    `);

    // COURSES
    await q.query(`
      CREATE TABLE IF NOT EXISTS "courses" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title"         varchar(255) NOT NULL,
        "slug"          varchar(320) NOT NULL UNIQUE,
        "image"         varchar(1024) NOT NULL,
        "category"      varchar(100) NOT NULL,
        "categoryId"    uuid,
        "description"   text NOT NULL,
        "features"      simple-array,
        "price"         decimal(12,2) NOT NULL,
        "originalPrice" decimal(12,2),
        "isFree"        boolean NOT NULL DEFAULT false,
        "currency"      varchar(8) NOT NULL DEFAULT 'USD',
        "rating"        decimal(3,2) NOT NULL DEFAULT 0,
        "reviewsCount"  int NOT NULL DEFAULT 0,
        "studentsCount" int NOT NULL DEFAULT 0,
        "duration"      varchar(50) NOT NULL,
        "lessons"       int NOT NULL DEFAULT 0,
        "level"         varchar(30) NOT NULL DEFAULT 'All Levels',
        "badge"         varchar(30),
        "curriculum"    jsonb,
        "previewVideoUrl" varchar(512),
        "isPublished"   boolean NOT NULL DEFAULT true,
        "instructorId"  uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "createdAt"     timestamptz NOT NULL DEFAULT now(),
        "updatedAt"     timestamptz NOT NULL DEFAULT now()
      );
    `);

    // REVIEWS
    await q.query(`
      CREATE TYPE "review_status_enum" AS ENUM ('Approved','Pending','Rejected');
      CREATE TABLE IF NOT EXISTS "reviews" (
        "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userName"    varchar(150) NOT NULL,
        "userAvatar"  varchar(512),
        "rating"      int NOT NULL,
        "comment"     text NOT NULL,
        "likes"       int NOT NULL DEFAULT 0,
        "helpfulCount" int NOT NULL DEFAULT 0,
        "status"      "review_status_enum" NOT NULL DEFAULT 'Pending',
        "createdAt"   timestamptz NOT NULL DEFAULT now(),
        "updatedAt"   timestamptz,
        "userId"      uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "productId"   uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "idx_reviews_product" ON "reviews"("productId");
      CREATE INDEX IF NOT EXISTS "idx_reviews_user"    ON "reviews"("userId");
    `);

    // QUESTIONS
    await q.query(`
      CREATE TABLE IF NOT EXISTS "questions" (
        "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userName"    varchar(150) NOT NULL,
        "userAvatar"  varchar(512),
        "question"    text NOT NULL,
        "answer"      text,
        "answeredBy"  varchar(150),
        "answerDate"  timestamptz,
        "createdAt"   timestamptz NOT NULL DEFAULT now(),
        "userId"      uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "productId"   uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "idx_questions_product" ON "questions"("productId");
    `);

    // ORDERS
    await q.query(`
      CREATE TYPE "order_status_enum" AS ENUM ('Pending','Processing','Completed','Cancelled','Refunded');
      CREATE TABLE IF NOT EXISTS "orders" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orderNumber"   varchar(50) NOT NULL UNIQUE,
        "customerName"  varchar(150),
        "customerEmail" varchar(255),
        "itemsCount"    int NOT NULL DEFAULT 0,
        "totalAmount"   decimal(12,2) NOT NULL,
        "discountAmount" decimal(12,2) NOT NULL DEFAULT 0,
        "taxAmount"     decimal(12,2) NOT NULL DEFAULT 0,
        "finalAmount"   decimal(12,2) NOT NULL,
        "status"        "order_status_enum" NOT NULL DEFAULT 'Pending',
        "paymentMethod" varchar(50) NOT NULL,
        "paymentReference" varchar(255),
        "billingAddress" varchar(1024),
        "createdAt"     timestamptz NOT NULL DEFAULT now(),
        "completedAt"   timestamptz,
        "cancelledAt"   timestamptz,
        "userId"        uuid REFERENCES "users"("id") ON DELETE SET NULL
      );
      CREATE INDEX IF NOT EXISTS "idx_orders_user"   ON "orders"("userId");
      CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders"("status");
    `);

    // ORDER_ITEMS
    await q.query(`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "productTitle" varchar(255) NOT NULL,
        "productImage" varchar(1024) NOT NULL,
        "price"       decimal(12,2) NOT NULL,
        "quantity"    int NOT NULL DEFAULT 1,
        "createdAt"   timestamptz NOT NULL DEFAULT now(),
        "orderId"     uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "productId"   uuid REFERENCES "products"("id") ON DELETE SET NULL
      );
      CREATE INDEX IF NOT EXISTS "idx_order_items_order" ON "order_items"("orderId");
    `);

    // BANNERS
    await q.query(`
      CREATE TABLE IF NOT EXISTS "banners" (
        "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title"       varchar(255) NOT NULL,
        "subtitle"    varchar(500),
        "type"        varchar(30) NOT NULL,
        "imageUrl"    varchar(1024) NOT NULL,
        "targetUrl"   varchar(1024),
        "badgeText"   varchar(100),
        "discountTag" varchar(100),
        "isActive"    boolean NOT NULL DEFAULT true,
        "sortOrder"   int NOT NULL DEFAULT 0,
        "createdById" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "createdAt"   timestamptz NOT NULL DEFAULT now(),
        "updatedAt"   timestamptz NOT NULL DEFAULT now()
      );
    `);

    // SETTINGS
    await q.query(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "siteTitle"     varchar(255) NOT NULL DEFAULT 'Pixer - Digital Marketplace',
        "siteDescription" text NOT NULL DEFAULT 'A high-performance digital marketplace for themes, templates, scripts, wireframes, and creative design assets.',
        "currencySymbol" varchar(10) NOT NULL DEFAULT '$',
        "currencyCode"  varchar(8) NOT NULL DEFAULT 'USD',
        "supportEmail"  varchar(255) NOT NULL DEFAULT 'support@pixer.com',
        "contactNumber" varchar(50) NOT NULL DEFAULT '+1 (800) 555-0199',
        "enableVendorRegistration" boolean NOT NULL DEFAULT true,
        "enableGuestCheckout" boolean NOT NULL DEFAULT true,
        "popupBannerEnabled" boolean NOT NULL DEFAULT true,
        "enableEmailVerification" boolean NOT NULL DEFAULT true,
        "socialLinks"   text,
        "footerHtml"    text,
        "extraJson"     text,
        "updatedAt"     timestamptz NOT NULL DEFAULT now()
      );
    `);

    // CONTACT MESSAGES
    await q.query(`
      CREATE TABLE IF NOT EXISTS "contact_messages" (
        "id"        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name"      varchar(150) NOT NULL,
        "email"     varchar(255) NOT NULL,
        "subject"   varchar(200),
        "message"   text NOT NULL,
        "status"    varchar(20) NOT NULL DEFAULT 'pending',
        "ipAddress" varchar(50),
        "userAgent" varchar(255),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "userId"    uuid REFERENCES "users"("id") ON DELETE SET NULL
      );
    `);

    // SELLER APPLICATIONS
    await q.query(`
      CREATE TYPE "seller_application_status_enum" AS ENUM ('pending','approved','rejected');
      CREATE TABLE IF NOT EXISTS "seller_applications" (
        "id"            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "studioName"    varchar(200) NOT NULL,
        "portfolioUrl"  varchar(512) NOT NULL,
        "githubUrl"     varchar(512),
        "bio"           text,
        "sampleWork"    text,
        "status"        "seller_application_status_enum" NOT NULL DEFAULT 'pending',
        "adminNotes"    text,
        "reviewedAt"    timestamptz,
        "reviewedById"  uuid,
        "userId"        uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "createdAt"     timestamptz NOT NULL DEFAULT now(),
        "updatedAt"     timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS "idx_seller_apps_status" ON "seller_applications"("status");
    `);

    // REFRESH TOKENS
    await q.query(`
      CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id"        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "token"     varchar(512) NOT NULL UNIQUE,
        "expiresAt" timestamptz NOT NULL,
        "isRevoked" boolean NOT NULL DEFAULT false,
        "userAgent" varchar(100),
        "ipAddress" varchar(100),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "revokedAt" timestamptz,
        "userId"    uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_user"  ON "refresh_tokens"("userId");
    `);

    // AUDIT LOGS
    await q.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id"         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "action"     varchar(100) NOT NULL,
        "entityType" varchar(100),
        "entityId"   varchar(100),
        "metadata"   jsonb,
        "ipAddress"  varchar(100),
        "userAgent"  varchar(255),
        "createdAt"  timestamptz NOT NULL DEFAULT now(),
        "userId"     uuid REFERENCES "users"("id") ON DELETE SET NULL
      );
      CREATE INDEX IF NOT EXISTS "idx_audit_logs_user"   ON "audit_logs"("userId");
      CREATE INDEX IF NOT EXISTS "idx_audit_logs_entity" ON "audit_logs"("entityType");
    `);

    // SUBSCRIPTIONS
    await q.query(`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id"        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email"     varchar(255) NOT NULL UNIQUE,
        "name"      varchar(150),
        "isActive"  boolean NOT NULL DEFAULT true,
        "source"    varchar(100),
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    // Create extensions
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await q.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm";`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS "subscriptions" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "refresh_tokens" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "seller_applications" CASCADE;`);
    await q.query(`DROP TYPE IF EXISTS "seller_application_status_enum" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "contact_messages" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "settings" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "banners" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "order_items" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "orders" CASCADE;`);
    await q.query(`DROP TYPE IF EXISTS "order_status_enum" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "questions" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "reviews" CASCADE;`);
    await q.query(`DROP TYPE IF EXISTS "review_status_enum" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "courses" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "products" CASCADE;`);
    await q.query(`DROP TYPE IF EXISTS "product_status_enum" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "categories" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "shops" CASCADE;`);
    await q.query(`DROP TYPE IF EXISTS "shop_status_enum" CASCADE;`);
    await q.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    await q.query(`DROP TYPE IF EXISTS "user_role_enum" CASCADE;`);
    await q.query(`DROP TYPE IF EXISTS "user_status_enum" CASCADE;`);
  }
}
