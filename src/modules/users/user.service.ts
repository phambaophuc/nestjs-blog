import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResponseDto } from './dtos/user-response.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return UserResponseDto.fromEntities(users);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    return UserResponseDto.fromEntity(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.save(createUserDto);
    return UserResponseDto.fromEntity(user);
  }
}
