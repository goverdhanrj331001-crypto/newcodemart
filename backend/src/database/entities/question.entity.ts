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

@Entity('questions')
@Index('idx_questions_product', ['productId'])
export class Question {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  userName: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 512, nullable: true })
  userAvatar: string | null;

  @ApiProperty()
  @Column({ type: 'text' })
  question: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  answer: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  answeredBy: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  answerDate: Date | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.questions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => Product, (p) => p.questions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty()
  @Column({ type: 'uuid' })
  productId: string;
}
