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

export enum SellerApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('seller_applications')
@Index('idx_seller_apps_status', ['status'])
export class SellerApplication {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  studioName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 512 })
  portfolioUrl: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 512, nullable: true })
  githubUrl: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  sampleWork: string | null;

  @ApiProperty({ enum: SellerApplicationStatus })
  @Column({ type: 'enum', enum: SellerApplicationStatus, default: SellerApplicationStatus.PENDING })
  status: SellerApplicationStatus;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  reviewedById: string | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (u) => u.sellerApplications, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;
}
