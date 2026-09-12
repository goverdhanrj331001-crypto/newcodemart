import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop, ShopStatus } from '../../database/entities/shop.entity';
import { Product, ProductStatus } from '../../database/entities/product.entity';
import { OrderItem, Order } from '../../database/entities/order.entity';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
import { PaginationDto, paginate, PaginatedResult, skipOf } from "../../common/dto/pagination.dto";
import { makeSlug } from '../../common/utils/slug.util';
import { RedisService } from '../../redis/redis.service';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop) private readonly shops: Repository<Shop>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
    private readonly redis: RedisService,
  ) {}

  async listPublic(pagination: PaginationDto): Promise<PaginatedResult<Shop>> {
    const qb = this.shops
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.owner', 'owner')
      .where('s.status = :status', { status: ShopStatus.ACTIVE });

    if (pagination.search) {
      qb.andWhere('(s.name ILIKE :q OR s.description ILIKE :q)', { q: `%${pagination.search}%` });
    }
    qb.orderBy('s.createdAt', 'DESC').skip(skipOf(pagination)).take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async adminList(pagination: PaginationDto & { status?: ShopStatus }): Promise<PaginatedResult<Shop>> {
    const qb = this.shops.createQueryBuilder('s').leftJoinAndSelect('s.owner', 'owner');
    if (pagination.search) {
      qb.andWhere('(s.name ILIKE :q OR owner.name ILIKE :q OR owner.email ILIKE :q)', {
        q: `%${pagination.search}%`,
      });
    }
    if (pagination.status) {
      qb.andWhere('s.status = :status', { status: pagination.status });
    }
    qb.orderBy('s.createdAt', 'DESC').skip(skipOf(pagination)).take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async mine(userId: string): Promise<Shop[]> {
    return this.shops.find({
      where: { ownerId: userId },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Shop> {
    const s = await this.shops.findOne({ where: { id }, relations: ['owner'] });
    if (!s) throw new NotFoundException('Shop not found');
    return s;
  }

  async create(dto: CreateShopDto, userId: string, role: UserRole): Promise<Shop> {
    const slug = dto.slug ? makeSlug(dto.slug) : makeSlug(dto.name);
    const status = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN ? dto.status ?? ShopStatus.ACTIVE : ShopStatus.PENDING;
    const shop = this.shops.create({
      ...dto,
      slug,
      ownerId: userId,
      status,
    });
    return this.shops.save(shop);
  }

  async update(id: string, dto: UpdateShopDto, userId: string, role: UserRole): Promise<Shop> {
    const s = await this.findOne(id);
    if (role === UserRole.STORE_OWNER && s.ownerId !== userId) {
      throw new ForbiddenException('You can only edit your own shop');
    }
    if (dto.name) s.slug = makeSlug(dto.name);
    Object.assign(s, dto);
    return this.shops.save(s);
  }

  async setStatus(id: string, status: ShopStatus): Promise<Shop> {
    const s = await this.findOne(id);
    s.status = status;
    return this.shops.save(s);
  }

  async remove(id: string, userId: string, role: UserRole): Promise<{ message: string }> {
    const s = await this.findOne(id);
    if (role === UserRole.STORE_OWNER && s.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own shop');
    }
    await this.shops.remove(s);
    return { message: 'Shop deleted' };
  }

  /** Recompute shop aggregates (products count, orders, revenue). */
  async recompute(shopId?: string): Promise<void> {
    const ids = shopId ? [shopId] : (await this.shops.find({ select: ['id'] })).map((s) => s.id);
    for (const id of ids) {
      const shop = await this.shops.findOne({ where: { id } });
      if (!shop) continue;
      const productsCount = await this.products.count({
        where: { shopId: id, status: ProductStatus.PUBLISHED, isDeleted: false },
      });
      const agg = await this.orderItems
        .createQueryBuilder('oi')
        .leftJoin(Order, 'o', 'o.id = oi.orderId')
        .leftJoin('oi.product', 'p', 'p.id = oi.productId')
        .where('p.shopId = :id', { id })
        .andWhere('o.status IN (:...statuses)', { statuses: ['Completed', 'Processing'] })
        .select('COUNT(DISTINCT o.id)', 'orders')
        .addSelect('COALESCE(SUM(oi.price * oi.quantity), 0)', 'revenue')
        .getRawOne<{ orders: string; revenue: string }>();

      shop.productsCount = productsCount;
      shop.ordersCount = Number(agg?.orders) || 0;
      shop.revenue = Number(agg?.revenue) || 0;
      await this.shops.save(shop);
    }
  }
}
