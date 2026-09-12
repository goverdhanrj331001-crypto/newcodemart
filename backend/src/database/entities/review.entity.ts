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
import { User } from './user.entity';
import { Product } from './product.entity';

export enum ReviewStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
}

@Entity('reviews')
@Index('idx_reviews_product', ['productId'])
@Index('idx_reviews_user', ['userId'])
export class Review {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  userName: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 512, nullable: true })
  userAvatar: string | null;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty()
  @Column({ type: 'text' })
  comment: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  likes: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  helpfulCount: number;

  @ApiProperty({ enum: ReviewStatus })
  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => User, (u) => u.reviews, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => Product, (p) => p.reviews, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty()
  @Column({ type: 'uuid' })
  productId: string;
}
