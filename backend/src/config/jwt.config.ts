import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_min_32_chars_long_string_DO_NOT_USE_IN_PROD',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_min_32_chars_long_string_DO_NOT_USE_IN_PROD',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  passwordResetExpiresMs: parseInt(process.env.PASSWORD_RESET_EXPIRES || '3600000', 10),
  emailVerificationExpiresMs: parseInt(process.env.EMAIL_VERIFICATION_EXPIRES || '86400000', 10),
}));
