import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { TagEntity } from '../entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
  ) {
    super(tagRepo.target, tagRepo.manager, tagRepo.queryRunner);
  }

  public async findAll(): Promise<TagEntity[]> {
    return this.find();
  }

  public async findById(id: string): Promise<TagEntity | null> {
    return this.findOne({ where: { id } });
  }

  public async store(tag: CreateTagDto): Promise<TagEntity> {
    const newTag = this.create(tag);
    return this.save(newTag);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }
}
