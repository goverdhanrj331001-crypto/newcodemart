import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
@Index('idx_order_items_order', ['orderId'])
export class OrderItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  productTitle: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 1024 })
  productImage: string;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @ApiProperty({ type: 'integer' })
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Order, (o) => o.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty()
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Product, (p) => p.orderItems, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'productId' })
  product: Product | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  productId: string | null;
}
