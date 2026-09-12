import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('app.apiPrefix', 'api');
  const port = config.get<number>('app.port', 4000);
  const corsOrigins = config.get<string[]>('app.corsOrigins', ['http://localhost:3000']);
  const swaggerPath = config.get<string>('app.swaggerPath', 'docs');

  // Trust proxy (when behind nginx/load-balancer)
  const httpAdapter = app.getHttpAdapter() as any;
  if (typeof httpAdapter.set === 'function') {
    httpAdapter.set('trust proxy', 1);
  }

  // Security headers
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // Cookies (for refresh token cookie)
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  });

  // Body parsers
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global interceptors & filters
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger docs
  const docConfig = new DocumentBuilder()
    .setTitle('CodeMart / Pixer API')
    .setDescription(
      'Enterprise-grade backend API for the CodeMart digital marketplace (themes, templates, scripts, courses). ' +
        'JWT auth, role-based access (customer / store_owner / admin / super_admin), cart, orders, reviews, banners, admin dashboard & more.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .addTag('auth', 'Authentication & account')
    .addTag('users', 'User profile & management')
    .addTag('products', 'Digital marketplace products')
    .addTag('categories', 'Product categories')
    .addTag('courses', 'Courses & academy')
    .addTag('reviews', 'Product reviews')
    .addTag('questions', 'Product Q&A')
    .addTag('orders', 'Orders & checkout')
    .addTag('cart', 'Cart (Redis-backed)')
    .addTag('banners', 'Marketing banners')
    .addTag('shops', 'Shops / vendors')
    .addTag('settings', 'Site settings')
    .addTag('contact', 'Contact form')
    .addTag('seller-applications', 'Seller applications')
    .addTag('admin', 'Admin panel endpoints')
    .addTag('uploads', 'File uploads')
    .addTag('health', 'Health checks')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none' },
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 CodeMart API listening on http://0.0.0.0:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger docs at    http://0.0.0.0:${port}/${swaggerPath}`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal boot error:', err);
  process.exit(1);
});
