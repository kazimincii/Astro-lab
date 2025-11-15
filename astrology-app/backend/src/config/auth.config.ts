import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '30d',
  bcryptRounds: 10,
}));
