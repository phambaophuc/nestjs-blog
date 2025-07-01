import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { CommentEntity } from '@/entities';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private repo: Repository<CommentEntity>,
  ) {}

  async findAll(): Promise<CommentEntity[]> {
    return this.repo.find({
      where: { parent: IsNull() },
      relations: { user: true, replies: { user: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<CommentEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: { user: true, replies: { user: true } },
    });
  }

  async store(comment: Partial<CommentEntity>): Promise<CommentEntity> {
    const newComment = this.repo.create(comment);
    return this.repo.save(newComment);
  }

  async destroy(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
