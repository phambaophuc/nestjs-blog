import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TagEntity } from '@/entities';
import { GeminiService } from '@/shared';

import { CreateTagDto, TagResponseDto } from './dto';
import { TagRepository } from './tag.repository';

const categories = [
  'Web Development',
  'Programming',
  'UI/UX Design',
  'Database',
  'DevOps',
  'Git',
  'AI Tools',
  'Machine Learning',
  'Prompt Engineering',
  'ChatGPT',
  'Automation',
  'Open Source',
  'Side Project',
  'Startup',
];

@Injectable()
export class TagService {
  constructor(
    private readonly repo: TagRepository,
    private readonly geminiService: GeminiService,
  ) {}

  async findAll(): Promise<TagResponseDto[]> {
    try {
      const tags = await this.repo.findAll();
      return TagResponseDto.fromEntities(tags);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<TagResponseDto> {
    try {
      const tag = await this.repo.findById(id);
      if (!tag) {
        throw new NotFoundException('Tag not found.');
      }
      return TagResponseDto.fromEntity(tag);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findTrendingTags(): Promise<TagResponseDto[]> {
    try {
      const tags = await this.repo.findTrendingTags();
      return TagResponseDto.fromEntities(tags);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    try {
      const savedTag = await this.repo.store(createTagDto);
      return TagResponseDto.fromEntity(savedTag);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.repo.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateTagsAndSave(content: string): Promise<TagEntity[]> {
    const result = await this.geminiService.generateTags(
      content,
      categories,
      4,
    );
    return this.repo.handleTags(result.tags);
  }
}
