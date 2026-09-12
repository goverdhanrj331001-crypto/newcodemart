import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export { OrderItem };

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  PAYPAL = 'PayPal',
  STRIPE = 'Stripe',
  WALLET = 'Wallet',
  RAZORPAY = 'Razorpay',
}

@Entity('orders')
@Index('idx_orders_user', ['userId'])
@Index('idx_orders_status', ['status'])
@Index('idx_orders_number', ['orderNumber'], { unique: true })
export class Order {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  customerName: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  customerEmail: string | null;

  @ApiProperty({ type: 'integer' })
  @Column({ type: 'int', default: 0 })
  itemsCount: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  finalAmount: number;

  @ApiProperty({ enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentMethod })
  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 1024, nullable: true })
  billingAddress: string | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @ManyToOne(() => User, (u) => u.orders, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true, eager: false })
  items: OrderItem[];
}
