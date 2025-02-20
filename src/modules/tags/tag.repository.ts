import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { TagResponseDto } from './dtos/tag-response.dto';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  async findAll(): Promise<TagResponseDto[]> {
    const tags = await this.tagRepo.find();
    return TagResponseDto.fromEntities(tags);
  }

  async findByName(name: string): Promise<TagResponseDto> {
    const tag = await this.tagRepo.findOne({ where: { name } });
    if (!tag) throw new NotFoundException();
    return TagResponseDto.fromEntity(tag);
  }
}
