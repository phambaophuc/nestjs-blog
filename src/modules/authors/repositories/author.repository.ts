import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { AuthorEntity } from '../entities/author.entity';

@Injectable()
export class AuthorRepository extends Repository<AuthorEntity> {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>,
  ) {
    super(authorRepo.target, authorRepo.manager, authorRepo.queryRunner);
  }

  public async findAll(): Promise<AuthorEntity[]> {
    return this.find({ relations: { articles: true } });
  }

  public async findById(id: string): Promise<AuthorEntity | null> {
    return this.findOne({ where: { id }, relations: { articles: true } });
  }

  public async findByEmail(email: string): Promise<AuthorEntity | null> {
    return this.findOne({ where: { email }, relations: { articles: true } });
  }

  public async store(author: CreateAuthorDto): Promise<AuthorEntity> {
    const newAuthor = this.create(author);
    return this.save(newAuthor);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }
}
