import { CommentEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { CreateCommentDto } from './dto';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {
    super(commentRepo.target, commentRepo.manager, commentRepo.queryRunner);
  }

  public async findAll(): Promise<CommentEntity[]> {
    return this.find({
      where: { parent: IsNull() },
      relations: { user: true, replies: { user: true } },
      order: { createdAt: 'DESC' },
    });
  }

  public async findById(id: string): Promise<CommentEntity | null> {
    return this.findOne({
      where: { id },
      relations: { user: true, replies: { user: true } },
    });
  }

  public async store(comment: CreateCommentDto): Promise<CommentEntity> {
    const newComment = this.create({
      ...comment,
      article: { id: comment.articleId },
      user: { id: comment.userId },
      parent: { id: comment.parentId },
    });
    return this.save(newComment);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }
}
