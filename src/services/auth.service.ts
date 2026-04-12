import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { userService } from './user.service';
import AppError from '../utils/app-error';
import { UserRole } from '@prisma/client';

export interface RegisterDto {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export class AuthService {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await userRepository.create({
      email: dto.email,
      password_hash: passwordHash,
      full_name: dto.fullName,
      role: UserRole.USER
    });

    const tokens = this.generateTokens(this.formatUserResponse(user));
    return { user: this.formatUserResponse(user), ...tokens };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.is_active) {
      throw new AppError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(this.formatUserResponse(user));
    return { user: this.formatUserResponse(user), ...tokens };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { user: UserResponse };
      const user = await userRepository.findById(decoded.user.id);
      if (!user || !user.is_active) {
        throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
      }
      const tokens = this.generateTokens(this.formatUserResponse(user));
      return { user: this.formatUserResponse(user), ...tokens };
    } catch (error) {
      throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
    }
  }

  async validateToken(token: string): Promise<UserResponse> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { user: UserResponse };
      const user = await userRepository.findById(decoded.user.id);
      if (!user || !user.is_active) {
        throw new AppError('User not found', 401, 'USER_NOT_FOUND');
      }
      return this.formatUserResponse(user);
    } catch (error) {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }
  }

  private generateTokens(user: UserResponse): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  private formatUserResponse(user: { id: string; email: string; full_name: string | null; role: UserRole }): UserResponse {
    return { id: user.id, email: user.email, fullName: user.full_name, role: user.role };
  }
}

export const authService = new AuthService();