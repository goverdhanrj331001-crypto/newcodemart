import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Site-wide settings — a singleton row (id = 'singleton').
 * Seeded on first boot via the seed script.
 */
@Entity('settings')
export class Setting {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, default: 'Pixer - Digital Marketplace' })
  siteTitle: string;

  @ApiProperty()
  @Column({ type: 'text', default: 'A high-performance digital marketplace for themes, templates, scripts, wireframes, and creative design assets.' })
  siteDescription: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10, default: '$' })
  currencySymbol: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 8, default: 'USD' })
  currencyCode: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, default: 'support@pixer.com' })
  supportEmail: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, default: '+1 (800) 555-0199' })
  contactNumber: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  enableVendorRegistration: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  enableGuestCheckout: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  popupBannerEnabled: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  enableEmailVerification: boolean;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  socialLinks: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  footerHtml: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  extraJson: string | null;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
