import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike, In, Not, IsNull } from 'typeorm';
import { Product, ProductStatus } from '../../database/entities/product.entity';
import { Review, ReviewStatus } from '../../database/entities/review.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationDto, PaginatedResult, paginate, skipOf } from "../../common/dto/pagination.dto";
import { makeSlug } from '../../common/utils/slug.util';
import { RedisService } from '../../redis/redis.service';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    private readonly redis: RedisService,
  ) {}

  // ---- Public ----

  async listPublic(pagination: PaginationDto & { category?: string; isFree?: boolean; authorId?: string }): Promise<PaginatedResult<Product>> {
    const qb = this.products
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.author', 'author')
      .leftJoinAndSelect('p.shop', 'shop')
      .where('p.status = :status', { status: ProductStatus.PUBLISHED })
      .andWhere('p.isDeleted = false');

    if (pagination.search) {
      qb.andWhere('(p.title ILIKE :q OR p.description ILIKE :q)', { q: `%${pagination.search}%` });
    }
    if (pagination.category) {
      qb.andWhere('(p.category = :cat OR p.categoryId = :catId)', {
        cat: pagination.category,
        catId: pagination.category,
      });
    }
    if (typeof pagination.isFree === 'boolean' || (pagination as any).isFree === 'true') {
      qb.andWhere('p.isFree = :free', { free: true });
    }
    const authorId = (pagination as any).authorId;
    if (authorId) qb.andWhere('p.authorId = :authorId', { authorId });

    const sortField = this.allowedSort(pagination.sortBy) || 'p.createdAt';
    qb.orderBy(sortField, (pagination.sortDir === 'asc' ? 'ASC' : 'DESC') as any)
      .skip(skipOf(pagination))
      .take(pagination.limit);

    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async getBySlug(slug: string, opts?: { incrementViews?: boolean }) {
    // Cached lookup
    const cacheKey = `product:slug:${slug}`;
    return this.redis.getOrSet(cacheKey, 60, async () => {
      const product = await this.products.findOne({
        where: { slug: slug.replace(/^\//, ''), isDeleted: false },
        relations: ['author', 'shop', 'categoryRef'],
      });
      if (!product || product.status !== ProductStatus.PUBLISHED) {
        throw new NotFoundException('Product not found');
      }

      const [reviews, questionsCount, related] = await Promise.all([
        this.reviews.find({
          where: { productId: product.id, status: ReviewStatus.APPROVED },
          order: { createdAt: 'DESC' },
          take: 20,
        }),
        this.reviews.count({ where: { productId: product.id } }),
        this.products.find({
          where: {
            category: product.category,
            id: Not(product.id),
            status: ProductStatus.PUBLISHED,
            isDeleted: false,
          },
          take: 4,
          order: { salesCount: 'DESC' },
        }),
      ]);

      return { ...product, reviews, questionsCount, related };
    });
  }

  async featured(limit = 8): Promise<Product[]> {
    return this.redis.getOrSet('products:featured', 300, () =>
      this.products.find({
        where: { status: ProductStatus.PUBLISHED, isDeleted: false },
        order: { salesCount: 'DESC', rating: 'DESC' },
        take: limit,
        relations: ['author'],
      }),
    );
  }

  // ---- Auth (seller/admin) ----

  async listForUser(userId: string, role: UserRole, pagination: PaginationDto): Promise<PaginatedResult<Product>> {
    const qb = this.products
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.author', 'author')
      .where('p.isDeleted = false');

    if (role === UserRole.STORE_OWNER) {
      qb.andWhere('p.authorId = :userId', { userId });
    }
    if (pagination.search) {
      qb.andWhere('p.title ILIKE :q', { q: `%${pagination.search}%` });
    }
    qb.orderBy(this.allowedSort(pagination.sortBy) || 'p.createdAt', (pagination.sortDir === 'asc' ? 'ASC' : 'DESC') as any)
      .skip(skipOf(pagination))
      .take(pagination.limit);

    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async create(dto: CreateProductDto, userId: string): Promise<Product> {
    const slug = dto.slug ? makeSlug(dto.slug) : makeSlug(dto.title);
    const product = this.products.create({
      ...dto,
      slug,
      authorId: userId,
      gallery: dto.gallery ?? [dto.image],
      features: dto.features ?? [],
      specifications: (dto.specifications as any) ?? null,
      status: dto.status ?? ProductStatus.PUBLISHED,
      isFree: dto.isFree ?? (Number(dto.price) === 0),
    });
    const saved = await this.products.save(product);
    await this.redis.del('products:featured');
    return saved;
  }

  async update(id: string, dto: UpdateProductDto, userId: string, role: UserRole): Promise<Product> {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (role === UserRole.STORE_OWNER && product.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own products');
    }
    if (dto.title && !dto.slug) dto.slug = makeSlug(dto.title);
    if (dto.slug) dto.slug = makeSlug(dto.slug);
    Object.assign(product, dto);
    const saved = await this.products.save(product);
    await this.redis.del(`product:slug:${saved.slug}`);
    await this.redis.del('products:featured');
    return saved;
  }

  async remove(id: string, userId: string, role: UserRole): Promise<{ message: string }> {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (role === UserRole.STORE_OWNER && product.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own products');
    }
    // Soft-delete
    product.isDeleted = true;
    product.status = ProductStatus.DRAFT;
    await this.products.save(product);
    await this.redis.del(`product:slug:${product.slug}`);
    await this.redis.del('products:featured');
    return { message: 'Product deleted' };
  }

  private allowedSort(field?: string): string | null {
    if (!field) return null;
    const allowed = ['createdAt', 'updatedAt', 'price', 'title', 'salesCount', 'rating', 'totalReviews'];
    return allowed.includes(field) ? `p.${field}` : null;
  }
}
