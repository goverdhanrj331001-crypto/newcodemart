import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Optional subscription model for newsletter / marketing opt-ins
 * collected from the footer subscribe form.
 */
@Entity('subscriptions')
@Index('idx_subscriptions_email', ['email'], { unique: true })
export class Subscription {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  name: string | null;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  source: string | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
