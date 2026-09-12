import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from '../../database/entities/review.entity';
import { Product } from '../../database/entities/product.entity';
import { CreateReviewDto, UpdateReviewDto, AdminUpdateReviewDto } from './dto/review.dto';
import { PaginationDto, paginate, PaginatedResult, skipOf } from "../../common/dto/pagination.dto";
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly redis: RedisService,
  ) {}

  async listByProduct(productId: string, pagination: PaginationDto): Promise<PaginatedResult<Review>> {
    const qb = this.reviews
      .createQueryBuilder('r')
      .where('r.productId = :productId', { productId })
      .andWhere('r.status = :status', { status: ReviewStatus.APPROVED })
      .orderBy('r.createdAt', 'DESC')
      .skip(skipOf(pagination))
      .take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async listAll(pagination: PaginationDto & { status?: ReviewStatus }): Promise<PaginatedResult<Review>> {
    const qb = this.reviews.createQueryBuilder('r').leftJoinAndSelect('r.product', 'product');
    if (pagination.search) {
      qb.andWhere('(r.comment ILIKE :q OR r.userName ILIKE :q)', { q: `%${pagination.search}%` });
    }
    if (pagination.status) {
      qb.andWhere('r.status = :status', { status: pagination.status });
    }
    qb.orderBy('r.createdAt', 'DESC').skip(skipOf(pagination)).take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async create(
    productId: string,
    dto: CreateReviewDto,
    user: { id: string; name: string; avatar?: string | null },
  ): Promise<Review> {
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.reviews.findOne({
      where: { productId, userId: user.id },
    });
    if (existing) throw new BadRequestException('You have already reviewed this product');

    const review = this.reviews.create({
      ...dto,
      productId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar ?? null,
      status: ReviewStatus.PENDING,
    });
    const saved = await this.reviews.save(review);
    await this.redis.del(`product:slug:${product.slug}`);
    return saved;
  }

  async update(id: string, dto: UpdateReviewDto, userId: string): Promise<Review> {
    const r = await this.reviews.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Review not found');
    if (r.userId !== userId) throw new BadRequestException('You can only edit your own reviews');
    Object.assign(r, dto);
    r.status = ReviewStatus.PENDING;
    const saved = await this.reviews.save(r);
    await this.redis.del(`product:slug:${r.productId}`);
    return saved;
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const r = await this.reviews.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Review not found');
    if (r.userId !== userId) throw new BadRequestException('You can only delete your own reviews');
    await this.reviews.remove(r);
    await this.redis.del(`product:slug:${r.productId}`);
    return { message: 'Review deleted' };
  }

  async adminUpdate(id: string, dto: AdminUpdateReviewDto): Promise<Review> {
    const r = await this.reviews.findOne({ where: { id }, relations: ['product'] });
    if (!r) throw new NotFoundException('Review not found');
    Object.assign(r, dto);
    const saved = await this.reviews.save(r);
    if (saved.status === ReviewStatus.APPROVED) {
      await this.recomputeProductRating(saved.productId);
    }
    await this.redis.del(`product:slug:${r.product?.slug}`);
    return saved;
  }

  async adminDelete(id: string): Promise<{ message: string }> {
    const r = await this.reviews.findOne({ where: { id }, relations: ['product'] });
    if (!r) throw new NotFoundException('Review not found');
    const slug = r.product?.slug;
    await this.reviews.remove(r);
    await this.recomputeProductRating(r.productId);
    if (slug) await this.redis.del(`product:slug:${slug}`);
    return { message: 'Review deleted' };
  }

  async like(id: string): Promise<Review> {
    const r = await this.reviews.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Review not found');
    r.likes += 1;
    return this.reviews.save(r);
  }

  async recomputeProductRating(productId: string): Promise<void> {
    const row = await this.reviews
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.productId = :id', { id: productId })
      .andWhere('r.status = :s', { s: ReviewStatus.APPROVED })
      .getRawOne<{ avg: string; count: string }>();

    const avg = Number(row?.avg) || 0;
    const count = Number(row?.count) || 0;

    await this.products.update(productId, {
      rating: avg,
      totalReviews: count,
    });
  }
}
