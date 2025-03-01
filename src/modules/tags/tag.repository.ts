import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
  ) {}

  findAll(): Promise<TagEntity[]> {
    return this.tagRepo.find();
  }

  findById(id: string): Promise<TagEntity> {
    return this.tagRepo.findOneOrFail({ where: { id } });
  }

  save(tag: Partial<TagEntity>): Promise<TagEntity> {
    return this.tagRepo.save(tag);
  }
}
