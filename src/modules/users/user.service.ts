import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateUserDto,
  UserDetailResponse,
  UserInternalDto,
  UserListResponse,
  UserMapper,
} from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserListResponse[]> {
    try {
      const users = await this.userRepository.findAll();
      return UserMapper.toLists(users);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<UserDetailResponse> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return UserMapper.toDetail(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserDetailResponse | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return null;
      }
      return UserMapper.toDetail(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findWithPasswordByEmail(email: string): Promise<UserInternalDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return UserMapper.toInternal(user);
  }

  async create(user: CreateUserDto): Promise<UserDetailResponse> {
    try {
      const newUser = await this.userRepository.store(user);
      return UserMapper.toDetail(newUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(id, { refreshToken });
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.userRepository.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
