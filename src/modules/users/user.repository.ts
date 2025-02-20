import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dtos/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException();
    }

    return UserResponseDto.fromEntity(user);
  }

  async save(user: CreateUserDto): Promise<CreateUserDto> {
    return this.userRepo.save(user);
  }
}
