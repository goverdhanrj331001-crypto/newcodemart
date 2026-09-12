import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

export type CategoryGroupType = 'tech' | 'project_type';

@Entity('categories')
@Index('idx_categories_slug', ['slug'], { unique: true })
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200, unique: true })
  slug: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Display count label, e.g. "28 Products".' })
  @Column({ type: 'varchar', length: 50, default: '0 Products' })
  count: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  productCount: number;

  @ApiProperty({ enum: ['tech', 'project_type'] })
  @Column({ type: 'varchar', length: 20, default: 'tech' })
  type: string;

  @ApiProperty({ description: 'Tailwind gradient classes, e.g. "from-[#087ea4] via-[#0ea5e9] to-[#0284c7".' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  gradient: string | null;

  @ApiProperty({ description: 'Single character or short monogram for icon fallback.' })
  @Column({ type: 'varchar', length: 8, nullable: true })
  monogram: string | null;

  @ApiProperty({ description: 'Lucide icon name (frontend picks rendering).' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  iconName: string | null;

  @ApiProperty({ description: 'Filter category label as used by the marketplace filter bar.' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  filterCategory: string | null;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Product, (p) => p.categoryRef)
  products: Product[];
}
