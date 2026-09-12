import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, UserRole } from '../../database/entities/user.entity';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async me(id: string): Promise<User> {
    const u = await this.users.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const u = await this.users.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    Object.assign(u, dto);
    return this.users.save(u);
  }

  async adminList(opts: { page: number; limit: number; search?: string; role?: UserRole; status?: UserStatus }) {
    const qb = this.users.createQueryBuilder('u').select([
      'u.id',
      'u.name',
      'u.email',
      'u.avatar',
      'u.role',
      'u.status',
      'u.walletPoints',
      'u.emailVerified',
      'u.createdAt',
      'u.country',
    ]);

    if (opts.search) {
      qb.andWhere('(u.name ILIKE :q OR u.email ILIKE :q)', { q: `%${opts.search}%` });
    }
    if (opts.role) qb.andWhere('u.role = :role', { role: opts.role });
    if (opts.status) qb.andWhere('u.status = :status', { status: opts.status });

    qb.orderBy('u.createdAt', 'DESC')
      .skip((opts.page - 1) * opts.limit)
      .take(opts.limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async adminFindOne(id: string): Promise<User> {
    const u = await this.users.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<User> {
    const u = await this.adminFindOne(id);
    Object.assign(u, dto);
    return this.users.save(u);
  }

  async adminDelete(id: string): Promise<{ message: string }> {
    const u = await this.adminFindOne(id);
    await this.users.remove(u);
    return { message: 'User deleted' };
  }

  async ban(id: string, banned: boolean): Promise<User> {
    const u = await this.adminFindOne(id);
    u.status = banned ? UserStatus.BANNED : UserStatus.ACTIVE;
    return this.users.save(u);
  }

  async adjustWallet(id: string, delta: number): Promise<User> {
    const u = await this.adminFindOne(id);
    u.walletPoints = Math.max(0, u.walletPoints + delta);
    return this.users.save(u);
  }
}
