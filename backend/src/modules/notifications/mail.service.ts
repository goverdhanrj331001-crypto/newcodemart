import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../database/entities/user.entity';
import { Setting } from '../../database/entities/setting.entity';
import { ContactMessage } from '../../database/entities/contact-message.entity';
import { SellerApplication } from '../../database/entities/seller-application.entity';

@Injectable()
export class MailService {
  readonly logger = new Logger('Mail');

  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {}

  private get appUrl(): string {
    return this.config.get<string>('app.frontendUrl', 'http://localhost:3000');
  }

  async sendEmailVerification(user: User, token: string): Promise<void> {
    const link = `${this.appUrl}/verify-email?token=${token}`;
    await this.mailer.sendMail({
      to: user.email,
      subject: `Verify your email — ${'CodeMart'}`,
      template: 'email-verification',
      context: { name: user.name, link },
    });
  }

  async sendPasswordReset(user: User, token: string): Promise<void> {
    const link = `${this.appUrl}/reset-password?token=${token}`;
    await this.mailer.sendMail({
      to: user.email,
      subject: 'Reset your CodeMart password',
      template: 'password-reset',
      context: { name: user.name, link, expiry: '1 hour' },
    });
  }

  async sendWelcome(user: User): Promise<void> {
    await this.mailer.sendMail({
      to: user.email,
      subject: 'Welcome to CodeMart 🎉',
      template: 'welcome',
      context: { name: user.name, appUrl: this.appUrl },
    });
  }

  async sendOrderConfirmation(order: any, user?: User | null): Promise<void> {
    const to = user?.email || order.customerEmail;
    if (!to) return;
    await this.mailer.sendMail({
      to,
      subject: `Order ${order.orderNumber} confirmed`,
      template: 'order-confirmation',
      context: {
        orderNumber: order.orderNumber,
        amount: order.finalAmount,
        itemsCount: order.itemsCount,
        appUrl: this.appUrl,
      },
    });
  }

  async sendContactAck(msg: ContactMessage): Promise<void> {
    await this.mailer.sendMail({
      to: msg.email,
      subject: 'We received your message — CodeMart',
      template: 'contact-ack',
      context: { name: msg.name, subject: msg.subject, appUrl: this.appUrl },
    });
  }

  async sendContactNotification(msg: ContactMessage, settings?: Setting | null): Promise<void> {
    const to = settings?.supportEmail || this.config.get<string>('mail.from')!;
    await this.mailer.sendMail({
      to,
      subject: `New contact message: ${msg.subject || '(no subject)'}`,
      template: 'contact-notification',
      context: {
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        appUrl: this.appUrl,
      },
    });
  }

  async sendSellerApplicationStatus(app: SellerApplication): Promise<void> {
    const statusText = app.status === 'approved' ? 'approved' : 'declined';
    await this.mailer.sendMail({
      to: app.user.email,
      subject: `Your seller application has been ${statusText}`,
      template: 'seller-application-status',
      context: {
        name: app.user.name,
        studioName: app.studioName,
        status: statusText,
        notes: app.adminNotes,
        appUrl: this.appUrl,
      },
    });
  }
}
