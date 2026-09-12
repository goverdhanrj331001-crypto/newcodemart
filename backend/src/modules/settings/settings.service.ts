import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../database/entities/setting.entity';
import { UpdateSettingsDto } from './dto/settings.dto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly settings: Repository<Setting>,
    private readonly redis: RedisService,
  ) {}

  /** Returns the singleton settings row. If missing, creates default. */
  async get(): Promise<Setting> {
    let s = await this.settings.findOne({ where: {} });
    if (!s) {
      s = this.settings.create({});
      s = await this.settings.save(s);
    }
    return s;
  }

  async update(dto: UpdateSettingsDto): Promise<Setting> {
    const s = await this.get();
    Object.assign(s, dto);
    const saved = await this.settings.save(s);
    await this.redis.del('settings:singleton');
    return saved;
  }

  async getCached(): Promise<Setting> {
    return this.redis.getOrSet('settings:singleton', 300, () => this.get());
  }
}
