import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, UserRole } from '../../database/entities/user.entity';
import { Product, ProductStatus } from '../../database/entities/product.entity';
import { Order, OrderStatus } from '../../database/entities/order.entity';
import { Review, ReviewStatus } from '../../database/entities/review.entity';
import { Shop, ShopStatus } from '../../database/entities/shop.entity';
import { Course } from '../../database/entities/course.entity';
import { Banner } from '../../database/entities/banner.entity';
import { ContactMessage } from '../../database/entities/contact-message.entity';
import { SellerApplication, SellerApplicationStatus } from '../../database/entities/seller-application.entity';
import { RedisService } from '../../redis/redis.service';

export interface DashboardStats {
  users: { total: number; active: number; banned: number; newThisMonth: number };
  sellers: { total: number; pendingApplications: number };
  products: { total: number; published: number; draft: number; deleted: number; newThisMonth: number };
  courses: { total: number; published: number };
  orders: { total: number; pending: number; completed: number; cancelled: number; revenue: number };
  reviews: { total: number; pending: number; approved: number; rejected: number };
  shops: { total: number; active: number; pending: number; suspended: number };
  banners: { total: number; active: number };
  contactMessages: { total: number; pending: number };
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Shop) private readonly shops: Repository<Shop>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(Banner) private readonly banners: Repository<Banner>,
    @InjectRepository(ContactMessage) private readonly contact: Repository<ContactMessage>,
    @InjectRepository(SellerApplication) private readonly sellerApps: Repository<SellerApplication>,
    private readonly redis: RedisService,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    return this.redis.getOrSet('admin:dashboard:stats', 60, async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [
        totalUsers,
        activeUsers,
        bannedUsers,
        newUsersMonth,
        totalSellers,
        pendingApps,
        totalProducts,
        publishedProducts,
        draftProducts,
        deletedProducts,
        newProductsMonth,
        totalCourses,
        publishedCourses,
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        revenue,
        totalReviews,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        totalShops,
        activeShops,
        pendingShops,
        suspendedShops,
        totalBanners,
        activeBanners,
        totalContact,
        pendingContact,
      ] = await Promise.all([
        this.users.count(),
        this.users.count({ where: { status: UserStatus.ACTIVE } }),
        this.users.count({ where: { status: UserStatus.BANNED } }),
        this.users.createQueryBuilder('u').where('u.createdAt >= :d', { d: startOfMonth }).getCount(),
        this.users.count({ where: { role: UserRole.STORE_OWNER } }),
        this.sellerApps.count({ where: { status: SellerApplicationStatus.PENDING } }),
        this.products.count(),
        this.products.count({ where: { status: ProductStatus.PUBLISHED, isDeleted: false } }),
        this.products.count({ where: { status: ProductStatus.DRAFT } }),
        this.products.count({ where: { isDeleted: true } }),
        this.products.createQueryBuilder('p').where('p.createdAt >= :d', { d: startOfMonth }).getCount(),
        this.courses.count(),
        this.courses.count({ where: { isPublished: true } }),
        this.orders.count(),
        this.orders.count({ where: { status: OrderStatus.PENDING } }),
        this.orders.count({ where: { status: OrderStatus.COMPLETED } }),
        this.orders.count({ where: { status: OrderStatus.CANCELLED } }),
        this.orders
          .createQueryBuilder('o')
          .select('COALESCE(SUM(o.finalAmount), 0)', 'rev')
          .where('o.status IN (:...s)', { s: [OrderStatus.COMPLETED, OrderStatus.PROCESSING] })
          .getRawOne<{ rev: string }>(),
        this.reviews.count(),
        this.reviews.count({ where: { status: ReviewStatus.PENDING } }),
        this.reviews.count({ where: { status: ReviewStatus.APPROVED } }),
        this.reviews.count({ where: { status: ReviewStatus.REJECTED } }),
        this.shops.count(),
        this.shops.count({ where: { status: ShopStatus.ACTIVE } }),
        this.shops.count({ where: { status: ShopStatus.PENDING } }),
        this.shops.count({ where: { status: ShopStatus.SUSPENDED } }),
        this.banners.count(),
        this.banners.count({ where: { isActive: true } }),
        this.contact.count(),
        this.contact.count({ where: { status: 'pending' } }),
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
          newThisMonth: newUsersMonth,
        },
        sellers: { total: totalSellers, pendingApplications: pendingApps },
        products: {
          total: totalProducts,
          published: publishedProducts,
          draft: draftProducts,
          deleted: deletedProducts,
          newThisMonth: newProductsMonth,
        },
        courses: { total: totalCourses, published: publishedCourses },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          revenue: Number(revenue?.rev) || 0,
        },
        reviews: {
          total: totalReviews,
          pending: pendingReviews,
          approved: approvedReviews,
          rejected: rejectedReviews,
        },
        shops: {
          total: totalShops,
          active: activeShops,
          pending: pendingShops,
          suspended: suspendedShops,
        },
        banners: { total: totalBanners, active: activeBanners },
        contactMessages: { total: totalContact, pending: pendingContact },
      };
    });
  }

  async revenueByPeriod(days = 30): Promise<Array<{ date: string; revenue: number; orders: number }>> {
    const cacheKey = `admin:revenue:${days}d`;
    return this.redis.getOrSet(cacheKey, 300, async () => {
      const rows = await this.orders
        .createQueryBuilder('o')
        .select(`TO_CHAR(o."createdAt", 'YYYY-MM-DD')`, 'date')
        .addSelect('COALESCE(SUM(o.finalAmount), 0)', 'revenue')
        .addSelect('COUNT(*)', 'orders')
        .where('o.createdAt >= NOW() - INTERVAL \'30 days\'')
        .andWhere('o.status IN (:...s)', { s: [OrderStatus.COMPLETED, OrderStatus.PROCESSING] })
        .groupBy(`TO_CHAR(o."createdAt", 'YYYY-MM-DD')`)
        .orderBy('date', 'ASC')
        .getRawMany<{ date: string; revenue: string; orders: string }>();

      return rows.map((r) => ({
        date: r.date,
        revenue: Number(r.revenue) || 0,
        orders: Number(r.orders) || 0,
      }));
    });
  }

  async topProducts(limit = 10): Promise<Product[]> {
    return this.redis.getOrSet(`admin:top-products:${limit}`, 300, () =>
      this.products.find({
        where: { isDeleted: false },
        order: { salesCount: 'DESC', rating: 'DESC' },
        take: limit,
        relations: ['author'],
      }),
    );
  }
}
