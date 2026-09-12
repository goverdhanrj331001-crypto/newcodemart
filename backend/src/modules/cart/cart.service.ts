import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from '../../database/entities/product.entity';
import { RedisService } from '../../redis/redis.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  quantity: number;
  isFree: boolean;
  authorName?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

@Injectable()
export class CartService {
  constructor(
    private readonly redis: RedisService,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  private key(userId: string) {
    return `cart:${userId}`;
  }

  async get(userId: string): Promise<Cart> {
    const raw = await this.redis.hgetall<CartItem>(this.key(userId));
    const items = Object.values(raw || {});
    const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
    return { items, total: Number(total.toFixed(2)), count: items.length };
  }

  async add(userId: string, dto: AddToCartDto): Promise<Cart> {
    const product = await this.products.findOne({
      where: { id: dto.productId, status: ProductStatus.PUBLISHED, isDeleted: false },
      relations: ['author'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const existing = (await this.redis.hget<CartItem>(this.key(userId), product.id)) ?? {
      productId: product.id,
      title: product.title,
      image: product.image,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      isFree: product.isFree,
      authorName: product.author?.name,
      quantity: 0,
    };

    existing.quantity += dto.quantity;
    await this.redis.hset(this.key(userId), product.id, existing);
    await this.redis.expire(this.key(userId), 60 * 60 * 24 * 7); // 7 days

    return this.get(userId);
  }

  async update(userId: string, dto: UpdateCartDto): Promise<Cart> {
    const existing = await this.redis.hget<CartItem>(this.key(userId), dto.productId);
    if (!existing) throw new NotFoundException('Item not in cart');
    existing.quantity = dto.quantity;
    await this.redis.hset(this.key(userId), dto.productId, existing);
    return this.get(userId);
  }

  async remove(userId: string, productId: string): Promise<Cart> {
    await this.redis.hdel(this.key(userId), productId);
    return this.get(userId);
  }

  async clear(userId: string): Promise<{ message: string }> {
    await this.redis.delKey(this.key(userId));
    return { message: 'Cart cleared' };
  }

  async count(userId: string): Promise<number> {
    return this.redis.hlen(this.key(userId));
  }
}
