/**
 * CodeMart / Pixer — Database seed script.
 *
 * Run via:
 *   npm run seed
 *   # OR inside docker:
 *   docker compose exec api node dist/database/seed.js
 *
 * Idempotent — running multiple times is safe. The script:
 *   1. Ensures the singleton settings row exists.
 *   2. Seeds the super admin (from env vars).
 *   3. Seeds sample sellers + a shop.
 *   4. Seeds categories (mirror of frontend).
 *   5. Seeds products (mirror of frontend INITIAL_PRODUCTS).
 *   6. Seeds courses (mirror of frontend POPULAR_COURSES).
 *   7. Seeds banners (mirror of frontend INITIAL_ADMIN_BANNERS).
 *   8. Seeds a couple of reviews.
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import {
  User,
  UserRole,
  UserStatus,
} from './entities/user.entity';
import { Shop, ShopStatus } from './entities/shop.entity';
import { Product, ProductStatus } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Course } from './entities/course.entity';
import { Banner } from './entities/banner.entity';
import { Setting } from './entities/setting.entity';
import { Review, ReviewStatus } from './entities/review.entity';
import { makeSlug } from '../common/utils/slug.util';

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ DataSource initialised');

  const userRepo = AppDataSource.getRepository(User);
  const shopRepo = AppDataSource.getRepository(Shop);
  const productRepo = AppDataSource.getRepository(Product);
  const categoryRepo = AppDataSource.getRepository(Category);
  const courseRepo = AppDataSource.getRepository(Course);
  const bannerRepo = AppDataSource.getRepository(Banner);
  const settingRepo = AppDataSource.getRepository(Setting);
  const reviewRepo = AppDataSource.getRepository(Review);

  // ---- 1. Settings ----
  const existingSettings = await settingRepo.findOne({ where: {} });
  if (!existingSettings) {
    await settingRepo.save(settingRepo.create({}));
    console.log('✅ Settings row created');
  } else {
    console.log('• Settings row already exists');
  }

  // ---- 2. Super Admin ----
  const adminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@codemart.io').toLowerCase();
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'ChangeMe@Admin123';
  const adminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  let admin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!admin) {
    admin = userRepo.create({
      name: adminName,
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(adminName)}`,
    });
    admin = await userRepo.save(admin);
    console.log(`✅ Super admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    admin.role = UserRole.SUPER_ADMIN;
    admin.status = UserStatus.ACTIVE;
    admin.emailVerified = true;
    admin = await userRepo.save(admin);
    console.log('• Super admin already exists (ensured role)');
  }

  // ---- 3. Sample sellers (store_owners) + shop ----
  const sellers = [
    { name: 'Omnico Team', email: 'omnico@codemart.io', studio: 'Omnico Digital Studio' },
    { name: 'Imagineco', email: 'imagineco@codemart.io', studio: 'Imagineco' },
    { name: 'BentaSoft', email: 'bentasoft@codemart.io', studio: 'BentaSoft' },
    { name: 'Bitronic', email: 'bitronic@codemart.io', studio: 'Bitronic Studio' },
  ];

  const sellerUsers: User[] = [];
  for (const s of sellers) {
    let u = await userRepo.findOne({ where: { email: s.email } });
    if (!u) {
      u = userRepo.create({
        name: s.name,
        email: s.email,
        password: await bcrypt.hash('Seller@Pass123', 12),
        role: UserRole.STORE_OWNER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(s.name)}`,
      });
      u = await userRepo.save(u);
      console.log(`✅ Seller created: ${s.email} / Seller@Pass123`);
    }
    sellerUsers.push(u);

    let shop = await shopRepo.findOne({ where: { ownerId: u.id } });
    if (!shop) {
      shop = shopRepo.create({
        name: s.studio,
        slug: makeSlug(s.studio),
        logo: `https://picsum.photos/seed/${makeSlug(s.studio)}/100/100`,
        description: `${s.studio} — premium digital assets.`,
        ownerId: u.id,
        status: ShopStatus.ACTIVE,
        commissionRate: 15,
      });
      await shopRepo.save(shop);
    }
  }

  // ---- 4. Categories ----
  const categoriesData = [
    // tech group
    { name: 'React', slug: 'react', gradient: 'from-[#087ea4] via-[#0ea5e9] to-[#0284c7]', monogram: '⚛', filterCategory: 'React', description: 'Component-driven web applications, Next.js starters, and modern hooks libraries.', type: 'tech', productCount: 28 },
    { name: 'Next.js', slug: 'nextjs', gradient: 'from-[#171717] via-[#262626] to-[#404040]', monogram: 'N', filterCategory: 'React', description: 'Full-stack Next.js App Router templates with SSR, server actions, and high SEO scores.', type: 'tech', productCount: 24 },
    { name: 'Flutter', slug: 'flutter', gradient: 'from-[#02569B] via-[#0175C2] to-[#13B9FD]', monogram: 'F', filterCategory: 'Mobile App', description: 'Multi-platform iOS and Android mobile kits built with Google Flutter and Dart.', type: 'tech', productCount: 18 },
    { name: 'Laravel', slug: 'laravel', gradient: 'from-[#FF2D20] via-[#E11D48] to-[#991B1B]', monogram: 'L', filterCategory: 'PHP Script', description: 'Robust PHP full-stack scripts, Blade dashboard themes, and secure REST APIs.', type: 'tech', productCount: 22 },
    { name: 'WordPress', slug: 'wordpress', gradient: 'from-[#21759B] via-[#1A5C7A] to-[#00425A]', monogram: 'W', filterCategory: 'WordPress Theme', description: 'Premium WordPress themes, plugins and WooCommerce-ready storefront kits.', type: 'tech', productCount: 35 },
    // project_type group
    { name: 'E-commerce', slug: 'ecommerce', gradient: 'from-[#10b981] via-[#059669] to-[#047857]', monogram: '🛒', filterCategory: 'E-commerce', description: 'Marketplace, single-vendor and grocery e-commerce templates and themes.', type: 'project_type', productCount: 41 },
    { name: 'Mobile App', slug: 'mobile-app', gradient: 'from-[#6366f1] via-[#4f46e5] to-[#4338ca]', monogram: '📱', filterCategory: 'Mobile App', description: 'Cross-platform mobile UI kits and complete app source code.', type: 'project_type', productCount: 38 },
    { name: 'UI templates', slug: 'ui-templates', gradient: 'from-[#ec4899] via-[#db2777] to-[#be185d]', monogram: '🎨', filterCategory: 'UI templates', description: 'Adobe XD, Figma & Sketch UI kits for SaaS, dashboards and mobile apps.', type: 'project_type', productCount: 32 },
    { name: 'Free', slug: 'free', gradient: 'from-[#16a34a] via-[#15803d] to-[#166534]', monogram: '🎁', filterCategory: 'Free', description: 'Free-to-download templates, starter kits and boilerplates.', type: 'project_type', productCount: 19 },
  ];

  const categoryBySlug: Record<string, Category> = {};
  for (const c of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { slug: c.slug } });
    if (!cat) {
      cat = categoryRepo.create({
        ...c,
        count: `${c.productCount} Products`,
        isActive: true,
      });
      cat = await categoryRepo.save(cat);
    }
    categoryBySlug[c.slug] = cat;
  }
  console.log(`✅ Categories ready (${Object.keys(categoryBySlug).length})`);

  // ---- 5. Products (mirror frontend) ----
  const productsData = [
    {
      title: 'ChawkBazar Laravel Flutter Mobile UI Kit',
      slug: 'chawkbazar-laravel-flutter',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/34.jpg',
      gallery: ['https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/34.jpg', 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/16.jpg', 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/146.jpg'],
      author: 'Omnico Team',
      price: 39,
      category: 'Mobile App',
      categorySlug: 'mobile-app',
      description: 'Comprehensive multi-vendor e-commerce mobile application solution built with Flutter and Laravel REST API. Includes product showcase, checkout, and order tracking.',
      features: ['Cross-platform iOS and Android support via Flutter', 'Integrated Laravel REST API with JWT authentication', 'Payment gateways: Stripe, PayPal, Razorpay', 'Clean BLoC state management architecture'],
      rating: 5.0,
      totalReviews: 24,
      salesCount: 890,
      specifications: { lastUpdate: 'Sep 02, 2026', published: 'Feb 14, 2026', layoutType: 'Responsive', filesIncluded: ['Flutter Code', 'Laravel Backend', 'Documentation'], tags: ['Flutter', 'Laravel', 'Mobile App', 'E-commerce'] },
    },
    {
      title: 'ShppingPro Joomla Template',
      slug: 'shppingpro-joomla-template',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/194.jpg',
      gallery: ['https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/194.jpg', 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/16.jpg'],
      author: 'Imagineco',
      price: 0,
      isFree: true,
      category: 'Free',
      categorySlug: 'free',
      description: 'Lightweight and clean e-commerce web template for Joomla 5 and VirtueMart. Designed with accessibility and fast loading speeds in mind.',
      features: ['Joomla 5 quickstart package', 'VirtueMart integration', 'Accessibility-ready markup', 'SEO-optimised HTML'],
      rating: 4.9,
      totalReviews: 31,
      salesCount: 3200,
      specifications: { lastUpdate: 'Aug 12, 2026', published: 'Jan 10, 2026', layoutType: 'Responsive', filesIncluded: ['Joomla QuickStart', 'CSS', 'PHP', 'Documentation'], tags: ['Joomla', 'Free', 'E-commerce', 'VirtueMart'] },
    },
    {
      title: 'Borobazar React Next Grocery Template',
      slug: 'borobazar-react-next-grocery',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/16.jpg',
      gallery: ['https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/16.jpg', 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/34.jpg'],
      author: 'BentaSoft',
      price: 65,
      originalPrice: 69,
      category: 'React',
      categorySlug: 'react',
      description: 'Modern online grocery and food delivery application template powered by Next.js 15 App Router and Tailwind CSS.',
      features: ['Next.js 15 App Router', 'Tailwind CSS 4', 'Server Actions for cart & checkout', 'Stripe + PayPal integration'],
      rating: 4.8,
      totalReviews: 18,
      salesCount: 650,
      specifications: { lastUpdate: 'Jul 28, 2026', published: 'Mar 01, 2026', layoutType: 'Fluid', filesIncluded: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Documentation'], tags: ['React', 'Next.js', 'Grocery', 'E-commerce'] },
    },
    {
      title: 'Scholar Multipurpose Education XD Template',
      slug: 'scholar-multipurpose-education',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/71.jpg',
      gallery: ['https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/71.jpg', 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/83.jpg'],
      author: 'Bitronic',
      price: 70,
      originalPrice: 79,
      category: 'UI templates',
      categorySlug: 'ui-templates',
      description: 'Multi-page Adobe XD UI kit designed for universities, academies, and online learning platforms with 50+ components.',
      features: ['50+ pre-built pages', 'Adobe XD + Figma versions', 'Design tokens & reusable components', 'Dark + light variants'],
      rating: 4.9,
      totalReviews: 12,
      salesCount: 410,
      specifications: { lastUpdate: 'Aug 05, 2026', published: 'Feb 20, 2026', layoutType: 'Vector', filesIncluded: ['Adobe XD', 'Figma', 'Icons', 'Documentation'], tags: ['Education', 'Adobe XD', 'UI Kit', 'Course'] },
    },
    {
      title: 'MagazzinePro Lyfestyle Blog Template',
      slug: 'magazzinepro-lifestyle-blog',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/196.jpg',
      gallery: ['https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/196.jpg', 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/146.jpg'],
      author: 'BentaSoft',
      price: 30,
      originalPrice: 35,
      category: 'WordPress Theme',
      categorySlug: 'wordpress',
      description: 'High-contrast dark editorial magazine and conference event template with slick typography and newsletter integration.',
      features: ['Gutenberg-ready blocks', 'Newsletter integration (Mailchimp)', 'AMP support', 'WCAG 2.1 AA accessibility'],
      rating: 4.7,
      totalReviews: 15,
      salesCount: 520,
      specifications: { lastUpdate: 'Aug 19, 2026', published: 'Jan 15, 2026', layoutType: 'Responsive', filesIncluded: ['PHP', 'CSS', 'WordPress Theme', 'Documentation'], tags: ['Magazine', 'Blog', 'WordPress', 'Dark Mode'] },
    },
    {
      title: 'FastEat Delivery - Online Food Restaurant Mobile',
      slug: 'fasteat-delivery-food',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/208.jpg',
      author: 'Imagineco',
      price: 55,
      category: 'Mobile App',
      categorySlug: 'mobile-app',
      description: 'On-demand food delivery app with live driver tracking and restaurant menu manager.',
      features: ['Live driver tracking', 'Stripe + COD support', 'Restaurant dashboard included', 'Push notifications'],
      rating: 4.9,
      salesCount: 710,
    },
    {
      title: 'Shoppy Audio & Electronics Mobile UI',
      slug: 'shoppy-audio-electronics',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/172.jpg',
      author: 'Bitronic',
      price: 29,
      category: 'Mobile App',
      categorySlug: 'mobile-app',
      description: 'Consumer electronics and headphone e-commerce mobile application kit.',
      features: ['Pixel-perfect UI screens', 'Animated product gallery', 'Cart & checkout flow', 'Custom illustrations'],
      rating: 4.7,
      salesCount: 320,
    },
    {
      title: 'SuperProps Next.js Customer Application',
      slug: 'superprops-customer-app',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/83.jpg',
      author: 'Omnico Team',
      price: 49,
      category: 'React',
      categorySlug: 'react',
      description: 'Next.js SaaS customer relationship and client portal dashboard template.',
      features: ['Auth + RBAC', 'Stripe billing', 'Multi-tenant ready', 'TanStack Query'],
      rating: 4.8,
      salesCount: 460,
    },
  ];

  const sellerByName: Record<string, User> = Object.fromEntries(sellerUsers.map((u) => [u.name, u]));
  let created = 0;
  for (const p of productsData) {
    const exists = await productRepo.findOne({ where: { slug: p.slug } });
    if (exists) continue;
    const author = sellerByName[p.author] ?? sellerUsers[0];
    const category = p.categorySlug ? categoryBySlug[p.categorySlug] : null;
    const product = productRepo.create({
      title: p.title,
      slug: p.slug,
      image: p.image,
      gallery: p.gallery ?? [p.image],
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      isFree: p.isFree ?? (p.price === 0),
      currency: 'USD',
      category: p.category,
      categoryId: category?.id ?? null,
      description: p.description,
      features: p.features ?? [],
      rating: p.rating ?? 0,
      totalReviews: p.totalReviews ?? 0,
      salesCount: p.salesCount ?? 0,
      authorId: author.id,
      status: ProductStatus.PUBLISHED,
      specifications: (p.specifications as any) ?? null,
    });
    await productRepo.save(product);
    created++;
  }
  console.log(`✅ Products seeded (${created} new)`);

  // ---- 6. Courses (mirror frontend) ----
  const coursesData = [
    {
      title: 'Web Development with Next.js',
      slug: 'web-development-nextjs',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/83.jpg',
      category: 'Web Development',
      description: 'Build modern, fast and scalable web applications with Next.js and React.',
      features: ['Next.js 15 App Router', 'Server Actions & RSC', 'Authentication patterns', 'Deploy to Vercel'],
      price: 49,
      rating: 4.9,
      reviewsCount: 234,
      studentsCount: 1250,
      duration: '32h',
      lessons: 145,
      level: 'All Levels',
      badge: 'Bestseller',
      instructor: 'Omnico Team',
      curriculum: [
        { title: 'Foundations', lessons: 18, duration: '4h' },
        { title: 'App Router Deep Dive', lessons: 32, duration: '8h' },
        { title: 'Building Real App', lessons: 95, duration: '20h' },
      ],
    },
    {
      title: 'Master UI/UX Design',
      slug: 'master-ui-ux-design',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/71.jpg',
      category: 'UI/UX Design',
      description: 'Learn design thinking, wireframing, Figma and create beautiful user experiences.',
      features: ['Design thinking process', 'Figma auto-layout mastery', 'Design systems', 'Portfolio project'],
      price: 59,
      originalPrice: 79,
      rating: 4.8,
      reviewsCount: 187,
      studentsCount: 890,
      duration: '24h',
      lessons: 110,
      level: 'Beginner',
      badge: 'Hot',
      instructor: 'Bitronic',
      curriculum: [
        { title: 'Design Thinking', lessons: 15, duration: '4h' },
        { title: 'Figma Mastery', lessons: 50, duration: '12h' },
        { title: 'Portfolio Project', lessons: 45, duration: '8h' },
      ],
    },
    {
      title: 'Flutter Mobile App Bootcamp',
      slug: 'flutter-mobile-app-bootcamp',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/34.jpg',
      category: 'Mobile App',
      description: 'Build 5 production-ready Flutter apps with clean architecture and BLoC.',
      features: ['Dart fundamentals', 'BLoC pattern', 'Firebase integration', '5 real apps'],
      price: 39,
      rating: 4.7,
      reviewsCount: 92,
      studentsCount: 450,
      duration: '40h',
      lessons: 180,
      level: 'Intermediate',
      badge: 'Updated',
      instructor: 'Omnico Team',
      curriculum: [
        { title: 'Dart & Flutter Basics', lessons: 40, duration: '10h' },
        { title: 'State Management', lessons: 30, duration: '8h' },
        { title: '5 Real-World Apps', lessons: 110, duration: '22h' },
      ],
    },
    {
      title: 'Laravel REST API Masterclass',
      slug: 'laravel-rest-api-masterclass',
      image: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/146.jpg',
      category: 'Backend & APIs',
      description: 'Build secure, scalable REST APIs with Laravel 11, Passport, Sanctum & Queues.',
      features: ['Laravel 11', 'API resources & transformers', 'Sanctum + Passport', 'Horizon & Queues'],
      price: 0,
      isFree: true,
      rating: 4.9,
      reviewsCount: 312,
      studentsCount: 1800,
      duration: '28h',
      lessons: 130,
      level: 'Intermediate',
      badge: 'New',
      instructor: 'Imagineco',
      curriculum: [
        { title: 'Laravel Basics', lessons: 25, duration: '6h' },
        { title: 'Building APIs', lessons: 60, duration: '14h' },
        { title: 'Auth & Queues', lessons: 45, duration: '8h' },
      ],
    },
  ];

  let coursesCreated = 0;
  for (const c of coursesData) {
    const exists = await courseRepo.findOne({ where: { slug: c.slug } });
    if (exists) continue;
    const instructor = sellerByName[c.instructor] ?? sellerUsers[0];
    const course = courseRepo.create({
      title: c.title,
      slug: c.slug,
      image: c.image,
      category: c.category,
      description: c.description,
      features: c.features,
      price: c.price,
      originalPrice: (c as any).originalPrice ?? null,
      isFree: c.isFree ?? (c.price === 0),
      rating: c.rating,
      reviewsCount: c.reviewsCount,
      studentsCount: c.studentsCount,
      duration: c.duration,
      lessons: c.lessons,
      level: c.level,
      badge: c.badge,
      curriculum: c.curriculum,
      instructorId: instructor.id,
      isPublished: true,
    });
    await courseRepo.save(course);
    coursesCreated++;
  }
  console.log(`✅ Courses seeded (${coursesCreated} new)`);

  // ---- 7. Banners ----
  const bannersData = [
    {
      title: 'WordPress Themes & Creative UI/UX Templates',
      subtitle: 'High performance digital marketplace for themes, templates, scripts & creative assets.',
      type: 'explore_carousel',
      imageUrl: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/1.png',
      targetUrl: '/explore',
      badgeText: 'Exclusive Digital Assets',
      discountTag: 'Save Up To 50% Off',
    },
    {
      title: 'Master Full-Stack Web & Mobile Development',
      subtitle: 'Hands-on video courses taught by industry veterans with full source code download.',
      type: 'courses_top',
      imageUrl: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/3.png',
      targetUrl: '/courses',
      badgeText: 'Developer Academy',
      discountTag: 'Get Certified Today',
    },
    {
      title: 'Limited Time Offer: Get 30% Off All Next.js Kits!',
      subtitle: 'Use coupon code PIXER30 at checkout before the end of the week.',
      type: 'popup_promo',
      imageUrl: 'https://picsum.photos/seed/popbanner/800/400',
      targetUrl: '/explore',
      badgeText: 'Special Promo',
      discountTag: '30% OFF',
    },
  ];

  let bannersCreated = 0;
  for (const b of bannersData) {
    const exists = await bannerRepo.findOne({ where: { title: b.title } });
    if (exists) continue;
    const banner = bannerRepo.create({
      ...b,
      isActive: true,
      sortOrder: bannersCreated,
      createdById: admin.id,
    });
    await bannerRepo.save(banner);
    bannersCreated++;
  }
  console.log(`✅ Banners seeded (${bannersCreated} new)`);

  // ---- 8. Sample reviews ----
  const products = await productRepo.find({ take: 3 });
  for (const p of products) {
    const existing = await reviewRepo.findOne({ where: { productId: p.id } });
    if (existing) continue;
    const r = reviewRepo.create({
      productId: p.id,
      userId: admin.id,
      userName: admin.name,
      userAvatar: admin.avatar,
      rating: 5,
      comment: 'Outstanding quality and excellent documentation. Highly recommended for production use.',
      status: ReviewStatus.APPROVED,
    });
    await reviewRepo.save(r);
  }
  console.log('✅ Sample reviews seeded');

  // ---- Re-cache invalidation keys (so cached versions don't override new data) ----
  // (Redis is initialised separately by the app; this script touches DB only.)

  console.log('\n🎉 Seed complete.');
  console.log(`\n📋 Login credentials:`);
  console.log(`   Super Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`   Sample Sellers: ${sellers.map((s) => s.email).join(', ')} / Seller@Pass123`);

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
