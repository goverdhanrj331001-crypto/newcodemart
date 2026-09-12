import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { Product, ProductStatus } from '../../database/entities/product.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { makeSlug } from '../../common/utils/slug.util';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly cats: Repository<Category>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly redis: RedisService,
  ) {}

  async listPublic(): Promise<Category[]> {
    return this.redis.getOrSet('categories:all', 300, () =>
      this.cats.find({
        where: { isActive: true },
        order: { sortOrder: 'ASC', name: 'ASC' },
      }),
    );
  }

  async adminList(): Promise<Category[]> {
    return this.cats.find({ order: { sortOrder: 'ASC', createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Category> {
    const c = await this.cats.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ? makeSlug(dto.slug) : makeSlug(dto.name);
    const cat = this.cats.create({ ...dto, slug, count: '0 Products' });
    const saved = await this.cats.save(cat);
    await this.redis.del('categories:all');
    return saved;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const c = await this.findOne(id);
    if (dto.slug) dto.slug = makeSlug(dto.slug);
    if (dto.name && !dto.slug) c.slug = makeSlug(dto.name);
    Object.assign(c, dto);
    const saved = await this.cats.save(c);
    await this.redis.del('categories:all');
    return saved;
  }

  async remove(id: string): Promise<{ message: string }> {
    const c = await this.findOne(id);
    // Detach products
    await this.products.update({ categoryId: id }, { categoryId: null });
    await this.cats.remove(c);
    await this.redis.del('categories:all');
    return { message: 'Category deleted' };
  }

  async recomputeCounts(): Promise<void> {
    const cats = await this.cats.find();
    for (const c of cats) {
      const n = await this.products.count({
        where: { categoryId: c.id, status: ProductStatus.PUBLISHED, isDeleted: false },
      });
      c.productCount = n;
      c.count = `${n} Product${n === 1 ? '' : 's'}`;
      await this.cats.save(c);
    }
    await this.redis.del('categories:all');
  }
}
