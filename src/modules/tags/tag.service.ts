import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TagEntity } from '@/entities';
import { GeminiService } from '@/shared';

import { CreateTagDto, TagMapper } from './dto';
import { TagDetailResponse, TagListResponse } from './dto/responses.dto';
import { TagRepository } from './tag.repository';

const tags = [
  'Web Development',
  'Frontend',
  'Backend',
  'Fullstack',
  'UI/UX Design',
  'Database',
  'NoSQL',
  'SQL',
  'DevOps',
  'Docker',
  'CI/CD',
  'Cloud',
  'AWS',
  'Software Architecture',
  'Version Control',
  'Git',
  'Open Source',
  'Startup',
  'Automation',
  'AI',
  'Machine Learning',
  'ChatGPT',
  'Tech Career',
  'Interview Prep',
  'Productivity Tools',
];

@Injectable()
export class TagService {
  constructor(
    private readonly repo: TagRepository,
    private readonly geminiService: GeminiService,
  ) {}

  async findAll(): Promise<TagListResponse[]> {
    try {
      const tags = await this.repo.findAll();
      return TagMapper.toLists(tags);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<TagDetailResponse> {
    try {
      const tag = await this.repo.findById(id);
      if (!tag) {
        throw new NotFoundException('Tag not found.');
      }
      return TagMapper.toDetail(tag);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findTrendingTags(): Promise<TagListResponse[]> {
    try {
      const tags = await this.repo.findTrendingTags();
      return TagMapper.toLists(tags);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createTagDto: CreateTagDto): Promise<TagDetailResponse> {
    try {
      const savedTag = await this.repo.store(createTagDto);
      return TagMapper.toDetail(savedTag);
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
    const result = await this.geminiService.generateTags(content, tags, 4);
    return this.repo.handleTags(result.tags);
  }
}
