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
import { Shop } from './shop.entity';
import { Category } from './category.entity';
import { Review } from './review.entity';
import { Question } from './question.entity';
import { OrderItem } from './order-item.entity';

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

@Entity('products')
@Index('idx_products_slug', ['slug'], { unique: true })
@Index('idx_products_status', ['status'])
@Index('idx_products_category', ['categoryId'])
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 320, unique: true })
  slug: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  fullDescriptionHtml: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 1024 })
  image: string;

  @ApiProperty({ type: [String] })
  @Column({ type: 'simple-array', nullable: true })
  gallery: string[];

  @ApiProperty({ description: 'Price in major currency unit (e.g. USD).' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Original price (for discount display).' })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  originalPrice: number | null;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isFree: boolean;

  @ApiProperty({ description: 'Currency code (USD, EUR, INR, etc.).' })
  @Column({ type: 'varchar', length: 8, default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Display label category (e.g. "React", "Mobile App").' })
  @Column({ type: 'varchar', length: 100, default: 'General' })
  category: string;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @ApiProperty({ type: [String] })
  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  salesCount: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  downloadCount: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 512, nullable: true })
  liveDemoUrl: string | null;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 512, nullable: true })
  sourceFileUrl: string | null;

  @ApiProperty({ description: 'JSON column for specifications (lastUpdate, published, layoutType, tags, filesIncluded...)' })
  @Column({ type: 'jsonb', nullable: true })
  specifications: Record<string, any> | null;

  @ApiProperty({ enum: ProductStatus })
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.PUBLISHED })
  status: ProductStatus;

  @ApiProperty({ description: 'Soft-delete flag (admin can unpublish).' })
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // --- Relations ---
  @ManyToOne(() => User, (user) => user.products, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => Shop, (shop) => shop.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shopId' })
  shop: Shop | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  shopId: string | null;

  @ManyToOne(() => Category, (cat) => cat.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  categoryRef: Category | null;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Question, (q) => q.product)
  questions: Question[];

  @OneToMany(() => OrderItem, (oi) => oi.product)
  orderItems: OrderItem[];
}
