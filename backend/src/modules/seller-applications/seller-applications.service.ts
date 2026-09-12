import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerApplication, SellerApplicationStatus } from '../../database/entities/seller-application.entity';
import { User, UserRole, UserStatus } from '../../database/entities/user.entity';
import { CreateSellerApplicationDto, ReviewSellerApplicationDto } from './dto/seller-application.dto';
import { PaginationDto, paginate, PaginatedResult, skipOf } from "../../common/dto/pagination.dto";
import { MailService } from '../notifications/mail.service';

@Injectable()
export class SellerApplicationsService {
  constructor(
    @InjectRepository(SellerApplication) private readonly apps: Repository<SellerApplication>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly mail: MailService,
  ) {}

  async create(dto: CreateSellerApplicationDto, userId: string): Promise<SellerApplication> {
    const existing = await this.apps.findOne({
      where: { userId, status: SellerApplicationStatus.PENDING },
    });
    if (existing) {
      throw new BadRequestException('You already have a pending application. Please wait for review.');
    }
    const app = this.apps.create({ ...dto, userId });
    return this.apps.save(app);
  }

  async mine(userId: string): Promise<SellerApplication[]> {
    return this.apps.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async adminList(
    pagination: PaginationDto,
    status?: SellerApplicationStatus,
  ): Promise<PaginatedResult<SellerApplication>> {
    const qb = this.apps
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'user');
    if (pagination.search) {
      qb.andWhere('(a.studioName ILIKE :q OR user.name ILIKE :q OR user.email ILIKE :q)', {
        q: `%${pagination.search}%`,
      });
    }
    if (status) qb.andWhere('a.status = :status', { status });
    qb.orderBy('a.createdAt', 'DESC').skip(skipOf(pagination)).take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async adminReview(
    id: string,
    dto: ReviewSellerApplicationDto,
    reviewerId: string,
  ): Promise<SellerApplication> {
    const app = await this.apps.findOne({ where: { id }, relations: ['user'] });
    if (!app) throw new NotFoundException('Application not found');
    if (app.status !== SellerApplicationStatus.PENDING) {
      throw new BadRequestException('Application already reviewed');
    }

    app.status = dto.status;
    app.adminNotes = dto.adminNotes ?? null;
    app.reviewedAt = new Date();
    app.reviewedById = reviewerId;
    const saved = await this.apps.save(app);

    // On approval: promote user to STORE_OWNER role
    if (dto.status === SellerApplicationStatus.APPROVED && app.user) {
      const user = app.user;
      if (user.role === UserRole.CUSTOMER) {
        user.role = UserRole.STORE_OWNER;
        await this.users.save(user);
      }
    }

    this.mail.sendSellerApplicationStatus(saved).catch(() => undefined);
    return saved;
  }
}
