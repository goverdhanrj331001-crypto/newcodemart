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

@Entity('audit_logs')
@Index('idx_audit_logs_user', ['userId'])
@Index('idx_audit_logs_entity', ['entityType'])
export class AuditLog {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  action: string;

  @ApiProperty({ description: 'Entity name (User, Product, Order, etc.)' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  entityType: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  entityId: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  ipAddress: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.auditLogs, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;
}
