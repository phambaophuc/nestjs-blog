import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepo.findOneOrFail({ where: { email } });
  }

  save(user: CreateUserDto): Promise<UserEntity> {
    return this.userRepo.save(user);
  }
}
