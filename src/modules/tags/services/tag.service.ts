import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { TagResponseDto } from '../dtos/tag-response.dto';
import { TagRepository } from '../repositories/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findAll(): Promise<TagResponseDto[]> {
    try {
      const tags = await this.tagRepository.findAll();
      return TagResponseDto.fromEntities(tags);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<TagResponseDto> {
    try {
      const tag = await this.tagRepository.findById(id);
      if (!tag) {
        throw new NotFoundException('Tag not found.');
      }
      return TagResponseDto.fromEntity(tag);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    try {
      const savedTag = await this.tagRepository.store(createTagDto);
      return TagResponseDto.fromEntity(savedTag);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.tagRepository.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
