import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Shop } from './shop.entity';
import { Product } from './product.entity';
import { Review } from './review.entity';
import { Question } from './question.entity';
import { Order } from './order.entity';
import { RefreshToken } from './refresh-token.entity';
import { SellerApplication } from './seller-application.entity';
import { ContactMessage } from './contact-message.entity';
import { AuditLog } from './audit-log.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  STORE_OWNER = 'store_owner',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  BANNED = 'Banned',
}

@Entity('users')
@Index('idx_users_email', ['email'], { unique: true })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string | null;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ type: 'integer' })
  @Column({ type: 'int', default: 0 })
  walletPoints: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  bio: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @ApiProperty({ description: 'OAuth provider (local | google | github)' })
  @Column({ type: 'varchar', length: 50, default: 'local' })
  provider: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken?: string | null;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken?: string | null;

  @Exclude()
  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpires?: Date | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // --- Relations ---
  @OneToMany(() => Shop, (shop) => shop.owner)
  shops: Shop[];

  @OneToMany(() => Product, (product) => product.author)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => SellerApplication, (app) => app.user)
  sellerApplications: SellerApplication[];

  @OneToMany(() => ContactMessage, (msg) => msg.user)
  contactMessages: ContactMessage[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];
}
