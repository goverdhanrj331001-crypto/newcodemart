import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../../database/entities/contact-message.entity';
import { Setting } from '../../database/entities/setting.entity';
import { CreateContactDto, UpdateContactStatusDto } from './dto/contact.dto';
import { PaginationDto, paginate, PaginatedResult, skipOf } from "../../common/dto/pagination.dto";
import { MailService } from '../notifications/mail.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage) private readonly messages: Repository<ContactMessage>,
    private readonly mail: MailService,
    private readonly settingsService: SettingsService,
  ) {}

  async create(
    dto: CreateContactDto,
    meta?: { userId?: string; ipAddress?: string; userAgent?: string },
  ): Promise<ContactMessage> {
    const msg = this.messages.create({
      ...dto,
      userId: meta?.userId ?? null,
      ipAddress: meta?.ipAddress ?? null,
      userAgent: meta?.userAgent ?? null,
    });
    const saved = await this.messages.save(msg);

    // Fire-and-forget emails
    this.mail.sendContactAck(saved).catch(() => undefined);
    this.settingsService
      .getCached()
      .then((s) => this.mail.sendContactNotification(saved, s).catch(() => undefined))
      .catch(() => undefined);

    return saved;
  }
  async adminList(pagination: PaginationDto & { status?: string }): Promise<PaginatedResult<ContactMessage>> {
    const qb = this.messages.createQueryBuilder('m');
    if (pagination.search) {
      qb.andWhere('(m.name ILIKE :q OR m.email ILIKE :q OR m.subject ILIKE :q OR m.message ILIKE :q)', {
        q: `%${pagination.search}%`,
      });
    }
    if (pagination.status) {
      qb.andWhere('m.status = :s', { s: pagination.status });
    }
    qb.orderBy('m.createdAt', 'DESC').skip(skipOf(pagination)).take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async adminUpdateStatus(id: string, dto: UpdateContactStatusDto): Promise<ContactMessage> {
    const m = await this.messages.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Message not found');
    m.status = dto.status;
    return this.messages.save(m);
  }

  async adminDelete(id: string): Promise<{ message: string }> {
    const m = await this.messages.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Message not found');
    await this.messages.remove(m);
    return { message: 'Message deleted' };
  }
}
