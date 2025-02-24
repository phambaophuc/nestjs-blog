import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagResponseDto } from './dtos/tag-response.dto';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async getAllTags(): Promise<TagResponseDto[]> {
    const tag = await this.tagRepository.findAll();
    return TagResponseDto.fromEntities(tag);
  }

  async createTag(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    const savedTag = await this.tagRepository.save(createTagDto);
    return TagResponseDto.fromEntity(savedTag);
  }
}
