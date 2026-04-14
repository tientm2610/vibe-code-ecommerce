import { userRepository } from '../repositories/user.repository';
import AppError from '../utils/app-error';
import { UserRole } from '@prisma/client';

export interface UpdateUserDto {
  fullName?: string;
  isActive?: boolean;
  role?: UserRole;
}

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
  }

  async updateProfile(userId: string, data: { fullName?: string }) {
    const user = await userRepository.update(userId, { fullName: data.fullName });
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
  }
}

export const userService = new UserService();