import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagResponseDto } from './dtos/tag-response.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  getAllTags(): Promise<TagResponseDto[]> {
    return this.tagRepository.findAll();
  }

  getTagByName(name: string): Promise<TagResponseDto> {
    return this.tagRepository.findByName(name);
  }
}
