import { UserEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
    super(userRepo.target, userRepo.manager, userRepo.queryRunner);
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.find({ relations: { articles: true } });
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return this.findOne({ where: { id }, relations: { articles: true } });
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ where: { email }, relations: { articles: true } });
  }

  public async store(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.create(user);
    return this.save(newUser);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }
}
