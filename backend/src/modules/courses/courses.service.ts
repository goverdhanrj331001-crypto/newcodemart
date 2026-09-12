import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { PaginationDto, paginate, PaginatedResult, skipOf } from "../../common/dto/pagination.dto";
import { makeSlug } from '../../common/utils/slug.util';
import { RedisService } from '../../redis/redis.service';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    private readonly redis: RedisService,
  ) {}

  async listPublic(pagination: PaginationDto & { category?: string; level?: string; isFree?: boolean }): Promise<PaginatedResult<Course>> {
    const qb = this.courses
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.instructor', 'instructor')
      .where('c.isPublished = true');

    if (pagination.search) {
      qb.andWhere('(c.title ILIKE :q OR c.description ILIKE :q)', { q: `%${pagination.search}%` });
    }
    if (pagination.category) {
      qb.andWhere('c.category = :cat', { cat: pagination.category });
    }
    if ((pagination as any).level) {
      qb.andWhere('c.level = :lvl', { lvl: (pagination as any).level });
    }
    if ((pagination as any).isFree === 'true') {
      qb.andWhere('c.isFree = true');
    }

    const sortField = this.allowedSort(pagination.sortBy) || 'c.createdAt';
    qb.orderBy(sortField, (pagination.sortDir === 'asc' ? 'ASC' : 'DESC') as any)
      .skip(skipOf(pagination))
      .take(pagination.limit);

    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async getBySlug(slug: string): Promise<Course> {
    return this.redis.getOrSet(`course:slug:${slug}`, 120, async () => {
      const course = await this.courses.findOne({
        where: { slug: slug.replace(/^\//, ''), isPublished: true },
        relations: ['instructor'],
      });
      if (!course) throw new NotFoundException('Course not found');
      return course;
    });
  }

  async featured(limit = 8): Promise<Course[]> {
    return this.redis.getOrSet('courses:featured', 300, () =>
      this.courses.find({
        where: { isPublished: true },
        order: { studentsCount: 'DESC', rating: 'DESC' },
        take: limit,
        relations: ['instructor'],
      }),
    );
  }

  // ---- Auth ----

  async listForUser(userId: string, role: UserRole, pagination: PaginationDto): Promise<PaginatedResult<Course>> {
    const qb = this.courses.createQueryBuilder('c').leftJoinAndSelect('c.instructor', 'instructor');
    if (role === UserRole.STORE_OWNER) {
      qb.andWhere('c.instructorId = :userId', { userId });
    }
    if (pagination.search) {
      qb.andWhere('c.title ILIKE :q', { q: `%${pagination.search}%` });
    }
    qb.orderBy(this.allowedSort(pagination.sortBy) || 'c.createdAt', (pagination.sortDir === 'asc' ? 'ASC' : 'DESC') as any)
      .skip(skipOf(pagination))
      .take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async create(dto: CreateCourseDto, userId: string): Promise<Course> {
    const slug = dto.slug ? makeSlug(dto.slug) : makeSlug(dto.title);
    const course = this.courses.create({
      ...dto,
      slug,
      instructorId: userId,
      curriculum: (dto.curriculum as any) ?? null,
      features: dto.features ?? [],
      isFree: dto.isFree ?? (Number(dto.price) === 0),
    });
    const saved = await this.courses.save(course);
    await this.redis.del('courses:featured');
    return saved;
  }

  async update(id: string, dto: UpdateCourseDto, userId: string, role: UserRole): Promise<Course> {
    const course = await this.courses.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (role === UserRole.STORE_OWNER && course.instructorId !== userId) {
      throw new ForbiddenException('You can only edit your own courses');
    }
    if (dto.title && !dto.slug) dto.slug = makeSlug(dto.title);
    if (dto.slug) dto.slug = makeSlug(dto.slug);
    Object.assign(course, dto);
    const saved = await this.courses.save(course);
    await this.redis.del(`course:slug:${saved.slug}`);
    await this.redis.del('courses:featured');
    return saved;
  }

  async remove(id: string, userId: string, role: UserRole): Promise<{ message: string }> {
    const course = await this.courses.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (role === UserRole.STORE_OWNER && course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }
    await this.courses.remove(course);
    await this.redis.del(`course:slug:${course.slug}`);
    await this.redis.del('courses:featured');
    return { message: 'Course deleted' };
  }

  private allowedSort(field?: string): string | null {
    if (!field) return null;
    const allowed = ['createdAt', 'updatedAt', 'price', 'title', 'studentsCount', 'rating'];
    return allowed.includes(field) ? `c.${field}` : null;
  }
}
