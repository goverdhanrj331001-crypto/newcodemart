import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Product, ProductStatus } from '../../database/entities/product.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { PaginationDto, paginate, PaginatedResult, skipOf } from "../../common/dto/pagination.dto";
import { generateOrderNumber } from '../../common/utils/slug.util';
import { MailService } from '../notifications/mail.service';
import { UserRole, UserStatus } from '../../database/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly mail: MailService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateOrderDto, user?: { id: string; name: string; email: string }): Promise<Order> {
    // Validate items
    if (!dto.items?.length) throw new BadRequestException('Order must contain at least one item');

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.products.find({
      where: productIds.map((id) => ({ id, status: ProductStatus.PUBLISHED, isDeleted: false })),
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are not available');
    }

    // Build order items
    const orderItems: OrderItem[] = [];
    let total = 0;
    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId)!;
      const qty = item.quantity ?? 1;
      const price = Number(product.price);
      orderItems.push(
        this.orders.manager.create(OrderItem, {
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          price,
          quantity: qty,
        }),
      );
      total += price * qty;
    }

    const orderNumber = generateOrderNumber();
    const order = this.orders.create({
      orderNumber,
      userId: user?.id ?? null,
      customerName: user?.name ?? null,
      customerEmail: user?.email ?? null,
      itemsCount: orderItems.length,
      totalAmount: total,
      discountAmount: 0,
      taxAmount: 0,
      finalAmount: total,
      status: OrderStatus.PENDING,
      paymentMethod: dto.paymentMethod,
      billingAddress: dto.billingAddress ?? null,
      items: orderItems,
    });

    const saved = await this.orders.save(order);

    // Increment salesCount
    for (const p of products) {
      p.salesCount += 1;
      await this.products.save(p);
    }

    if (user) {
      this.mail
        .sendOrderConfirmation(saved, { id: user.id, email: user.email } as any)
        .catch(() => undefined);
    }

    return saved;
  }

  async listForUser(userId: string, pagination: PaginationDto): Promise<PaginatedResult<Order>> {
    const qb = this.orders
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'items')
      .where('o.userId = :userId', { userId })
      .orderBy('o.createdAt', 'DESC')
      .skip(skipOf(pagination))
      .take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async adminList(pagination: PaginationDto & { status?: OrderStatus }): Promise<PaginatedResult<Order>> {
    const qb = this.orders.createQueryBuilder('o').leftJoinAndSelect('o.items', 'items');
    if (pagination.search) {
      qb.andWhere('(o.orderNumber ILIKE :q OR o.customerName ILIKE :q OR o.customerEmail ILIKE :q)', {
        q: `%${pagination.search}%`,
      });
    }
    if (pagination.status) {
      qb.andWhere('o.status = :status', { status: pagination.status });
    }
    qb.orderBy('o.createdAt', 'DESC').skip(skipOf(pagination)).take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async findOne(id: string): Promise<Order> {
    const o = await this.orders.findOne({ where: { id }, relations: ['items', 'user'] });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  async findByNumber(orderNumber: string): Promise<Order> {
    const o = await this.orders.findOne({ where: { orderNumber }, relations: ['items', 'user'] });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  async adminUpdateStatus(id: string, dto: UpdateOrderStatusDto, adminId: string): Promise<Order> {
    const o = await this.findOne(id);
    o.status = dto.status;
    if (dto.status === OrderStatus.COMPLETED) o.completedAt = new Date();
    if (dto.status === OrderStatus.CANCELLED) o.cancelledAt = new Date();
    return this.orders.save(o);
  }
}
