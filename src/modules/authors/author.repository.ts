import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { CreateAuthorDto } from './dtos/create-author.dto';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepo: Repository<AuthorEntity>,
  ) {}

  findAll(): Promise<AuthorEntity[]> {
    return this.authorRepo.find();
  }

  findByEmail(email: string): Promise<AuthorEntity> {
    return this.authorRepo.findOneOrFail({ where: { email } });
  }

  save(author: CreateAuthorDto): Promise<AuthorEntity> {
    return this.authorRepo.save(author);
  }
}
