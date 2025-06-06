import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto, UserInternalDto, UserResponseDto } from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.findAll();
      return UserResponseDto.fromEntities(users);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return UserResponseDto.fromEntity(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return UserResponseDto.fromEntity(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findWithPasswordByEmail(email: string): Promise<UserInternalDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return UserInternalDto.fromEntity(user);
  }

  async create(user: CreateUserDto): Promise<UserResponseDto> {
    try {
      const newUser = await this.userRepository.store(user);
      return UserResponseDto.fromEntity(newUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.userRepository.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
