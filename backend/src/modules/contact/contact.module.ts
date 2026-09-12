import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from '../../database/entities/contact-message.entity';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage]), SettingsModule],
  providers: [ContactService],
  controllers: [ContactController],
  exports: [ContactService],
})
export class ContactModule {}
