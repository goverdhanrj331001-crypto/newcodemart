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

@Entity('refresh_tokens')
@Index('idx_refresh_tokens_user', ['userId'])
@Index('idx_refresh_tokens_token', ['token'], { unique: true })
export class RefreshToken {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 512, unique: true })
  token: string;

  @ApiProperty()
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  ipAddress: string | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @ManyToOne(() => User, (u) => u.refreshTokens, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;

  /**
   * Returns true if the token is still valid (not revoked & not expired).
   */
  get isValid(): boolean {
    return !this.isRevoked && this.expiresAt.getTime() > Date.now();
  }
}
