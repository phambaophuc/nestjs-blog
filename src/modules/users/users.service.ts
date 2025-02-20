import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async createOrUpdate(user: Partial<User>): Promise<User> {
    return this.usersRepository.createOrUpdate(user);
  }
}
