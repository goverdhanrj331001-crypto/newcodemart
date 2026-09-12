import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../../database/entities/banner.entity';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner) private readonly banners: Repository<Banner>,
    private readonly redis: RedisService,
  ) {}

  async listPublic(): Promise<Banner[]> {
    return this.redis.getOrSet('banners:public', 300, () =>
      this.banners.find({
        where: { isActive: true },
        order: { sortOrder: 'ASC', createdAt: 'DESC' },
      }),
    );
  }

  async adminList(): Promise<Banner[]> {
    return this.banners.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateBannerDto, userId: string): Promise<Banner> {
    const b = this.banners.create({ ...dto, createdById: userId });
    const saved = await this.banners.save(b);
    await this.redis.del('banners:public');
    return saved;
  }

  async update(id: string, dto: UpdateBannerDto): Promise<Banner> {
    const b = await this.banners.findOne({ where: { id } });
    if (!b) throw new NotFoundException('Banner not found');
    Object.assign(b, dto);
    const saved = await this.banners.save(b);
    await this.redis.del('banners:public');
    return saved;
  }

  async toggle(id: string): Promise<Banner> {
    const b = await this.banners.findOne({ where: { id } });
    if (!b) throw new NotFoundException('Banner not found');
    b.isActive = !b.isActive;
    const saved = await this.banners.save(b);
    await this.redis.del('banners:public');
    return saved;
  }

  async remove(id: string): Promise<{ message: string }> {
    const b = await this.banners.findOne({ where: { id } });
    if (!b) throw new NotFoundException('Banner not found');
    await this.banners.remove(b);
    await this.redis.del('banners:public');
    return { message: 'Banner deleted' };
  }
}
