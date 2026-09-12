import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User, UserRole, UserStatus } from '../../database/entities/user.entity';
import { RefreshToken } from '../../database/entities/refresh-token.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/auth.dto';
import { MailService } from '../notifications/mail.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  permissions?: string[];
}

export interface AuthResult {
  user: Omit<User, 'password' | 'emailVerificationToken' | 'passwordResetToken'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(RefreshToken) private readonly refreshTokens: Repository<RefreshToken>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto, req?: any): Promise<AuthResult> {
    const existing = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new UnauthorizedException('An account with this email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 12);
    const verificationToken = uuidv4();

    const user = this.users.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashed,
      phone: dto.phone ?? null,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerificationToken: verificationToken,
      emailVerified: false,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(dto.name)}`,
    });

    const saved = await this.users.save(user);

    // Send verification email (non-blocking, log on failure)
    this.mail
      .sendEmailVerification(saved, verificationToken)
      .catch((e) => this.mail.logger.warn(`Email send failed: ${e.message}`));

    return this.issueTokens(saved, req);
  }

  async login(dto: LoginDto, req?: any): Promise<AuthResult> {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status === UserStatus.BANNED) {
      throw new UnauthorizedException('Account is banned. Contact support.');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    return this.issueTokens(user, req);
  }

  async refresh(refreshToken: string, req?: any): Promise<AuthResult> {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.refreshTokens.findOne({
      where: { token: refreshToken, userId: payload.sub },
    });
    if (!stored || !stored.isValid) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }

    // Rotate: revoke old, issue new
    stored.isRevoked = true;
    stored.revokedAt = new Date();
    await this.refreshTokens.save(stored);

    const user = await this.users.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    return this.issueTokens(user, req);
  }

  async logout(userId: string, refreshToken?: string): Promise<{ message: string }> {
    if (refreshToken) {
      await this.refreshTokens.update(
        { token: refreshToken, userId },
        { isRevoked: true, revokedAt: new Date() },
      );
    } else {
      // Revoke ALL sessions for this user
      await this.refreshTokens.update({ userId, isRevoked: false }, { isRevoked: true, revokedAt: new Date() });
    }
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user) {
      // For security reasons, do NOT leak which emails are registered.
      return { message: 'If that email exists, a reset link has been sent.' };
    }
    const token = uuidv4();
    const expiresMs = this.config.get<number>('jwt.passwordResetExpiresMs', 3600000);
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + expiresMs);
    await this.users.save(user);

    this.mail
      .sendPasswordReset(user, token)
      .catch((e) => this.mail.logger.warn(`Email send failed: ${e.message}`));

    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.users.findOne({ where: { passwordResetToken: dto.token } });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires.getTime() < Date.now()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const hashed = await bcrypt.hash(dto.password, 12);
    user.password = hashed;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.users.save(user);

    // Revoke all sessions
    await this.refreshTokens.update(
      { userId: user.id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() },
    );
    return { message: 'Password reset successfully. Please log in.' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.users.findOne({ where: { emailVerificationToken: token } });
    if (!user) throw new UnauthorizedException('Invalid verification token');
    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.users.save(user);
    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.users.findOne({ where: { email: email.toLowerCase() } });
    if (!user || user.emailVerified) {
      return { message: 'If that email exists and is unverified, a new link has been sent.' };
    }
    const token = uuidv4();
    user.emailVerificationToken = token;
    await this.users.save(user);
    this.mail.sendEmailVerification(user, token).catch(() => undefined);
    return { message: 'If that email exists and is unverified, a new link has been sent.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user || !user.password) throw new UnauthorizedException('Account has no password set');

    const ok = await bcrypt.compare(dto.currentPassword, user.password);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await this.users.save(user);

    await this.refreshTokens.update(
      { userId: user.id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() },
    );
    return { message: 'Password changed successfully. Please log in again.' };
  }

  // ---- helpers ----

  private async issueTokens(user: User, req?: any): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwt.signAsync(payload as any, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessExpiresIn') as any,
    });

    const refreshToken = await this.jwt.signAsync(payload as any, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiresIn') as any,
    });

    const refreshExpiresIn = this.parseExpiry(this.config.get<string>('jwt.refreshExpiresIn', '7d'));
    const expiresAt = new Date(Date.now() + refreshExpiresIn);

    // Truncate userAgent to fit column size (db column is varchar(500))
    const rawUA = req?.headers?.['user-agent'] ?? null;
    const userAgent = rawUA ? (rawUA.length > 495 ? rawUA.substring(0, 495) : rawUA) : null;

    const stored = this.refreshTokens.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
      userAgent,
      ipAddress: req?.ip ?? null,
    });
    await this.refreshTokens.save(stored);

    // Strip sensitive fields
    const safeUser = { ...user } as any;
    delete safeUser.password;
    delete safeUser.emailVerificationToken;
    delete safeUser.passwordResetToken;
    delete safeUser.passwordResetExpires;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiry(this.config.get<string>('jwt.accessExpiresIn', '15m')),
    };
  }

  private parseExpiry(expr: string): number {
    const m = expr.match(/^(\d+)([smhd])$/);
    if (!m) return 900_000; // 15m default
    const n = parseInt(m[1], 10);
    switch (m[2]) {
      case 's': return n * 1000;
      case 'm': return n * 60_000;
      case 'h': return n * 3_600_000;
      case 'd': return n * 86_400_000;
      default: return 900_000;
    }
  }
}
