import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResponseDto } from './dtos/user-response.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    return this.usersRepository.findByEmail(email);
  }

  async createUser(user: CreateUserDto): Promise<CreateUserDto> {
    return this.usersRepository.save(user);
  }
}
