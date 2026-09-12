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

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type CourseBadge = 'Bestseller' | 'Hot' | 'Updated' | 'New' | null;

@Entity('courses')
@Index('idx_courses_slug', ['slug'], { unique: true })
export class Course {
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
  @Column({ type: 'varchar', length: 1024 })
  image: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  category: string;

  @ApiProperty({ description: 'Linked category UUID (optional).' })
  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ type: [String] })
  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  originalPrice: number | null;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isFree: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', length: 8, default: 'USD' })
  currency: string;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  reviewsCount: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  studentsCount: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  duration: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  lessons: number;

  @ApiProperty({ enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] })
  @Column({ type: 'varchar', length: 30, default: 'All Levels' })
  level: string;

  @ApiProperty({ enum: ['Bestseller', 'Hot', 'Updated', 'New'], nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  badge: string | null;

  @ApiProperty({ description: 'JSON column with curriculum sections.' })
  @Column({ type: 'jsonb', nullable: true })
  curriculum: Array<{ title: string; lessons: number; duration: string }> | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 512, nullable: true })
  previewVideoUrl: string | null;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // --- Relations ---
  @ManyToOne(() => User, (u) => u.products, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  instructorId: string;

  @OneToMany(() => Product, (p) => p.categoryRef)
  relatedProducts: Product[];
}
