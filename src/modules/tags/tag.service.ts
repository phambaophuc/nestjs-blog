import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagResponseDto } from './dtos/tag-response.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async getAllTags(): Promise<TagResponseDto[]> {
    const tag = await this.tagRepository.findAll();
    return TagResponseDto.fromEntities(tag);
  }
}
