import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Product } from './product.entity';

export enum ShopStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  SUSPENDED = 'Suspended',
}

@Entity('shops')
export class Shop {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string | null;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  banner: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @ApiProperty({ enum: ShopStatus })
  @Column({ type: 'enum', enum: ShopStatus, default: ShopStatus.PENDING })
  status: ShopStatus;

  @ApiProperty({ type: 'integer' })
  @Column({ type: 'int', default: 0 })
  productsCount: number;

  @ApiProperty({ type: 'integer' })
  @Column({ type: 'int', default: 0 })
  ordersCount: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  revenue: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 15.0 })
  commissionRate: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.shops, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  ownerId: string;

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];
}
