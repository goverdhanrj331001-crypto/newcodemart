import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export type BannerType = 'explore_carousel' | 'courses_top' | 'popup_promo';

@Entity('banners')
export class Banner {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  subtitle: string | null;

  @ApiProperty({ enum: ['explore_carousel', 'courses_top', 'popup_promo'] })
  @Column({ type: 'varchar', length: 30 })
  type: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 1024 })
  imageUrl: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 1024, nullable: true })
  targetUrl: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  badgeText: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  discountTag: string | null;

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

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  createdById: string | null;
}
