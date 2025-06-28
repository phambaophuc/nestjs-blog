import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TagEntity } from '@/entities';

import { CreateTagDto } from './dto';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private repo: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return this.repo
      .createQueryBuilder('tag')
      .leftJoin('tag.articles', 'article')
      .where('article.id IS NOT NULL')
      .getMany();
  }

  async findById(id: string): Promise<TagEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async store(tag: CreateTagDto): Promise<TagEntity> {
    const newTag = this.repo.create(tag);
    return this.repo.save(newTag);
  }

  async destroy(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async handleTags(tagNames: string[]): Promise<TagEntity[]> {
    const uniqueTagNames = [
      ...new Set(tagNames.map((name) => name.trim().toLowerCase())),
    ];

    const existingTags = await this.repo.find({
      where: uniqueTagNames.map((name) => ({ name })),
    });

    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = uniqueTagNames.filter(
      (name) => !existingTagNames.includes(name),
    );

    const newTags = this.repo.create(newTagNames.map((name) => ({ name })));

    const savedNewTags = await this.repo.save(newTags);

    return [...existingTags, ...savedNewTags];
  }
}
