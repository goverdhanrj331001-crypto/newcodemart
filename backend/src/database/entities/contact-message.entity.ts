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

@Entity('contact_messages')
export class ContactMessage {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200, nullable: true })
  subject: string | null;

  @ApiProperty()
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ description: 'pending | read | resolved | archived' })
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;
}
