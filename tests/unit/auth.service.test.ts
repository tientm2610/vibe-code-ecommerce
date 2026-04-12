import * as userRepository from '../../src/repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../src/repositories/user.repository');
jest.mock('bcrypt');

const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password_hash: 'hashed-password',
    full_name: 'Test User',
    role: 'USER' as const,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  });

  describe('register', () => {
    it('should throw error if email already exists', async () => {
      const { authService } = require('../../src/services/auth.service');
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      await expect(authService.register({ email: 'test@example.com', password: 'password123' }))
        .rejects.toThrow();
    });

    it('should register new user successfully', async () => {
      const { authService } = require('../../src/services/auth.service');
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue({ ...mockUser, role: 'USER' });

      const result = await authService.register({ email: 'new@example.com', password: 'password123', fullName: 'New User' });
      expect(result.user.email).toBe('new@example.com');
      expect(result.user.fullName).toBe('New User');
      expect(result.user.role).toBe('USER');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      const { authService } = require('../../src/services/auth.service');
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: 'notfound@example.com', password: 'password123' }))
        .rejects.toThrow();
    });

    it('should throw error if account is deactivated', async () => {
      const { authService } = require('../../src/services/auth.service');
      mockUserRepository.findByEmail.mockResolvedValue({ ...mockUser, is_active: false });
      await expect(authService.login({ email: 'test@example.com', password: 'password123' }))
        .rejects.toThrow();
    });

    it('should throw error if password is invalid', async () => {
      const { authService } = require('../../src/services/auth.service');
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.login({ email: 'test@example.com', password: 'wrongpassword' }))
        .rejects.toThrow();
    });

    it('should login successfully with correct credentials', async () => {
      const { authService } = require('../../src/services/auth.service');
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ email: 'test@example.com', password: 'password123' });
      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('should throw error for invalid token', async () => {
      const { authService } = require('../../src/services/auth.service');
      await expect(authService.refresh('invalid-token')).rejects.toThrow();
    });

    it('should throw error if user not found', async () => {
      const { authService } = require('../../src/services/auth.service');
      const token = jwt.sign({ user: { id: 'user-1', email: 'test@example.com', fullName: null, role: 'USER' } }, 'test-refresh-secret', { expiresIn: '7d' });
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.refresh(token)).rejects.toThrow();
    });

    it('should refresh token successfully', async () => {
      const { authService } = require('../../src/services/auth.service');
      const token = jwt.sign({ user: { id: 'user-1', email: 'test@example.com', fullName: null, role: 'USER' } }, 'test-refresh-secret', { expiresIn: '7d' });
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await authService.refresh(token);
      expect(result.accessToken).toBeDefined();
    });
  });

  describe('validateToken', () => {
    it('should throw error for invalid token', async () => {
      const { authService } = require('../../src/services/auth.service');
      await expect(authService.validateToken('invalid-token')).rejects.toThrow();
    });

    it('should validate token successfully', async () => {
      const { authService } = require('../../src/services/auth.service');
      const token = jwt.sign({ user: { id: 'user-1', email: 'test@example.com', fullName: null, role: 'USER' } }, 'test-secret', { expiresIn: '15m' });
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await authService.validateToken(token);
      expect(result.email).toBe('test@example.com');
    });
  });
});