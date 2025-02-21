import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResponseDto } from './dtos/user-response.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmail(email);
    return UserResponseDto.fromEntity(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.save(createUserDto);
    return UserResponseDto.fromEntity(user);
  }
}
